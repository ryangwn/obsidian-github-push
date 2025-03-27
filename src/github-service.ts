import { Notice } from 'obsidian';
import { Octokit } from '@octokit/core';
import { GithubPushSettings } from './settings';

export class GithubService {
  constructor(
    private settings: GithubPushSettings,
    private vault: any
  ) {}

  async pushFileToGithub(file: any): Promise<void> {
    // Function to update both modal and notice
    const updateStatus = (
      message: string,
      progress: number,
      isError = false,
      isSuccess = false
    ) => {
      new Notice(message);
    };

    // Check if all required settings are set
    if (!this.settings.githubToken || !this.settings.repoOwner || !this.settings.repoName) {
      const message =
        'GitHub repository details are not configured. Please check the plugin settings.';
      updateStatus(message, 0, true);
      return;
    }

    // Check if there's an active file
    if (!file) {
      const message = 'No file is currently active.';
      updateStatus(message, 0, true);
      return;
    }

    try {
      const octokit = new Octokit({
        auth: this.settings.githubToken,
      });

      // Get the current file content
      updateStatus('Reading file content...', 20);
      const fileContent = await this.vault.read(file);
      const fileName = file.name;
      const filePath = `${this.settings.folderPath}/${fileName}`;

      // First, try to get the file info and content (if it exists)
      updateStatus('Checking if file exists on GitHub...', 40);
      let fileSha: string | null = null;
      let existingContent: string | null = null;
      let fileExists = false;

      try {
        const response = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
          owner: this.settings.repoOwner,
          repo: this.settings.repoName,
          path: filePath,
          ref: this.settings.branchName,
        });

        const fileData = response.data;
        if (!Array.isArray(fileData)) {
          fileExists = true;
          fileSha = fileData.sha;
          updateStatus('File exists. Comparing content...', 50);

          // Check if it's a file (not a symlink or submodule)
          if (fileData.type === 'file' && fileData.content) {
            // Decode the base64 content
            existingContent = Buffer.from(fileData.content, 'base64').toString('utf-8');
          } else {
            const message = `Cannot read content from ${filePath}: Not a regular file`;
            updateStatus(message, 50, true);
            throw new Error(message);
          }
        }
      } catch (error) {
        // File might not exist, which is fine
        updateStatus('File does not exist yet. Will create it.', 50);
        console.log('File does not exist yet, will create it.');
      }

      // Check if content has changed or file doesn't exist
      if (!fileExists || existingContent !== fileContent) {
        // Push the file to GitHub only if content changed or file is new
        const statusMessage = fileExists
          ? 'Content changed. Uploading changes...'
          : 'Uploading new file...';
        updateStatus(statusMessage, 70);

        const response = await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
          owner: this.settings.repoOwner,
          repo: this.settings.repoName,
          path: filePath,
          message: this.settings.commitMessage,
          content: Buffer.from(fileContent).toString('base64'),
          branch: this.settings.branchName,
          sha: fileSha || undefined,
        });

        const successMessage = `Successfully pushed "${fileName}" to GitHub`;
        updateStatus(successMessage, 100, false, true);
        console.log('GitHub API response:', response);
      } else {
        const skipMessage = `No changes detected in "${fileName}". Skipping push.`;
        updateStatus(skipMessage, 100, false, true);
      }
    } catch (error: any) {
      const errorMessage = `Failed to push to GitHub: ${error.message}`;
      updateStatus(errorMessage, 100, true);
      console.error('Error pushing note to GitHub:', error);
    }
  }
}

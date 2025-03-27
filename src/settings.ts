export interface GithubPushSettings {
  githubToken: string;
  repoOwner: string;
  repoName: string;
  branchName: string;
  commitMessage: string;
  folderPath: string;
}

export const DEFAULT_SETTINGS: GithubPushSettings = {
  githubToken: '',
  repoOwner: '',
  repoName: '',
  branchName: 'main',
  commitMessage: 'Update note from Obsidian',
  folderPath: 'notes',
};

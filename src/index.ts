import { MarkdownView, Notice, Plugin } from 'obsidian';
import { GithubPushSettings, DEFAULT_SETTINGS } from './settings';
import { GithubService } from './github-service';
import { GithubPushSettingTab } from './ui/settings-tab';

export default class GithubPushPlugin extends Plugin {
  settings: GithubPushSettings;
  githubService: GithubService;

  async onload() {
    await this.loadSettings();
    this.githubService = new GithubService(this.settings, this.app.vault);

    this.addRibbonIcon('bird', 'Push to GitHub', async (evt: MouseEvent) => {
      const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
      if (activeView) {
        await this.pushNoteToGithub(activeView);
      } else {
        new Notice('No active markdown file to push to GitHub');
      }
    });

    this.addCommand({
      id: 'push-note-to-github',
      name: 'Push current note to GitHub',
      checkCallback: (checking: boolean) => {
        const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
        if (activeView) {
          if (!checking) {
            this.pushNoteToGithub(activeView);
          }
          return true;
        }
        return false;
      },
    });

    this.addSettingTab(new GithubPushSettingTab(this.app, this));
  }

  onunload() {
    // Clean up when the plugin is disabled
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  async pushNoteToGithub(view: MarkdownView) {
    await this.githubService.pushFileToGithub(view.file);
  }
}

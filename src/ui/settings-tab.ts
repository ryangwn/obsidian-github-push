import { App, PluginSettingTab, Setting } from 'obsidian';
import GithubPushPlugin from '../index';

export class GithubPushSettingTab extends PluginSettingTab {
  plugin: GithubPushPlugin;

  constructor(app: App, plugin: GithubPushPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;

    containerEl.empty();

    containerEl.createEl('h2', { text: 'GitHub Push Settings' });

    new Setting(containerEl)
      .setName('GitHub Personal Access Token')
      .setDesc(
        'Token with repo scope. Create one at GitHub -> Settings -> Developer settings -> Personal access tokens'
      )
      .addText(
        (text) =>
          (text
            .setPlaceholder('ghp_xxxxxxxxxxxxxxxxxxxx')
            .setValue(this.plugin.settings.githubToken)
            .onChange(async (value) => {
              this.plugin.settings.githubToken = value;
              await this.plugin.saveSettings();
            }).inputEl.type = 'password')
      );

    new Setting(containerEl)
      .setName('Repository Owner')
      .setDesc('GitHub username or organization name')
      .addText((text) =>
        text
          .setPlaceholder('username')
          .setValue(this.plugin.settings.repoOwner)
          .onChange(async (value) => {
            this.plugin.settings.repoOwner = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName('Repository Name')
      .setDesc('Name of the repository')
      .addText((text) =>
        text
          .setPlaceholder('repo-name')
          .setValue(this.plugin.settings.repoName)
          .onChange(async (value) => {
            this.plugin.settings.repoName = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName('Branch Name')
      .setDesc('Branch to push to (default: main)')
      .addText((text) =>
        text
          .setPlaceholder('main')
          .setValue(this.plugin.settings.branchName)
          .onChange(async (value) => {
            this.plugin.settings.branchName = value || 'main';
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName('Commit Message')
      .setDesc('Default commit message when pushing notes')
      .addText((text) =>
        text
          .setPlaceholder('Update note from Obsidian')
          .setValue(this.plugin.settings.commitMessage)
          .onChange(async (value) => {
            this.plugin.settings.commitMessage = value || 'Update note from Obsidian';
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName('Folder Path')
      .setDesc('Folder path in the repository where notes should be saved')
      .addText((text) =>
        text
          .setPlaceholder('notes')
          .setValue(this.plugin.settings.folderPath)
          .onChange(async (value) => {
            this.plugin.settings.folderPath = value || 'notes';
            await this.plugin.saveSettings();
          })
      );
  }
}

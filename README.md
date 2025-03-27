# Obsidian GitHub Push

A simple yet powerful Obsidian plugin that allows you to push your notes directly to a GitHub repository with a single click.

## Features

- **One-Click Push**: Push the current note to GitHub with a single click from the ribbon icon or command palette
- **Smart Syncing**: Only pushes files when changes are detected
- **Customizable Settings**: Configure your GitHub repository details, branch, commit messages, and more
- **Progress Notifications**: Clear notifications about the push process and results
- **Secure**: Your GitHub token is stored securely

## Installation

### From Obsidian Community Plugins

*Coming soon*

### Manual Installation

1. Download the latest release from the [GitHub releases page](https://github.com/ryangwn/obsidian-github-push/releases)
2. Extract the zip file into your Obsidian plugins folder: `<vault>/.obsidian/plugins/`
3. Enable the plugin in Obsidian settings under "Community Plugins"

### From Source

1. Clone this repository to your Obsidian plugins folder: `<vault>/.obsidian/plugins/`
2. Navigate to the plugin folder and run:
   ```bash
   pnpm install
   pnpm build
   ```

3. Enable the plugin in Obsidian settings under "Community Plugins"

## Configuration

1. Go to Obsidian settings under "Community Plugins" and click on "GitHub Push"
2. Enter the following information:
   - GitHub Personal Access Token: Create a token with repo scope at GitHub > Settings > Developer settings > Personal access tokens
   - Repository Owner: Your GitHub username or organization name
   - Repository Name: The name of your GitHub repository
   - Branch Name (optional): The branch to push to (default: main)
   - Commit Message (optional): Default commit message (default: Update note from Obsidian)
   - Folder Path (optional): Folder path in the repository where notes should be saved (default: notes)

## Usage

### Push Current Note

1. Click the bird icon in the left sidebar
2. Or open the command palette (Ctrl/Cmd + P) and search for "Push current note to GitHub"

### What Happens When You Push

1. The plugin checks if your note already exists in the GitHub repository
2. If the note exists, it compares the content to see if there are changes
3. If there are changes (or the note doesn't exist), it pushes the note to GitHub
4. You'll receive notifications about the progress and result of the push

## Troubleshooting

### Common Issues

1. **Token Permissions**: Ensure the token has the `repo` scope
2. **Repository Not Found**: Verify the repository owner and name are correct
3. **Branch Not Found**: Check that the branch exists in the repository
4. **Folder Path**: Make sure the folder path is correct and exists in the repository

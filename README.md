# VsCode Action Buttons

Add customizable buttons to the status bar to execute actions or tasks in VS Code.

## Features

* Execute command in terminal
* Execute VS Code command
    * Any command that can be activated via a keyboard shortcut can be activated via a button
* Ability to customize text color for each button
* Add icons to buttons
    * Icons can be added to buttons by using the Markdown icons-in-labels syntax. For example, to add an alert icon you include `$(alert) in the button name. See https://code.visualstudio.com/api/references/icons-in-labels for more info

### Example

![](action.gif)

## Installation and setup

 - [x] Install the `VsCode Action Buttons` extension in your VS Code instance.
 - [x] After installing, open your VS Code settings (`Ctrl + ,`). Navigate to the `VsCode Action Buttons` section.
 - [x] Define the action buttons you want. Below is a sample configuration for reference.
 - [x] Reload the VS Code window to see the new buttons. Alternatively, you can run the `Refresh Action Buttons` command to refresh without reloading the window.

 ```json
 	"actionButtons": {
		 "defaultColor": "#ff0034", // Can also use string color names.
		 "loadNpmCommands":false, // Disables automatic generation of actions for npm commands.
		 "reloadButton":"♻️", // Custom reload button text or icon (default ↻). null value enables automatic reload on configuration change
		 "commands": [
			 {
				 "cwd": "/home/custom_folder", 	// Terminal initial folder ${workspaceFolder} and os user home as defaults
				 "name": "Run Cargo",
				 "color": "green",
				 "singleInstance": true,
				 "command": "cargo run ${file}", // This is executed in the terminal.
			 },
			 {
				 "name": "Build Cargo",
				 "color": "green",
				 "command": "cargo build ${file}",
			 },
			 {
				"name": "🪟 Split editor",
				"color": "orange",
				"useVsCodeApi": true,
				"command": "workbench.action.splitEditor"
		     }
		 ]
	 }
 ```

## Config Options

* **reloadButton**
    * Text for reload actions button. Defaults to `↻`. If null, the reload button is disabled.
* **defaultColor**
    * Default text color of action buttons. Defaults to `white`.
* **loadNpmCommands**
    * Whether or not to automatically generate action buttons from commands specified in `package.json`. Defaults to `false`.
* **commands**
    * List of action buttons to add to the status bar. Defaults to `[]`. See below for a list of valid options for each command

### Command Options

* **name**
    * Name of the action button. This field is required.
* **command**
    * Command to execute when action is activated. This field is required.
	* If `useVsCodeApi` is `true`, this is the VS Code command to execute. Otherwise, this specifies the command to execute in the terminal
* **color**
    * Specifies the action button text color. Defaults to `defaultColor`.
* **cwd**
    * Start directory when executing terminal command. Defaults to `${workspaceFolder}`. Only valid when `useVsCodeApi` is `false`
* **singleInstance**
    * Reopen associated terminal each time this action is activated. Defaults to `false`. Only valid when `useVsCodeApi` is `false`
* **focus**
    * Focus the terminal after executing the command. Defaults to `false`. Only valid when `useVsCodeApi` is `false`
* **useVsCodeApi**
    * Specifies whether to execute a VS Code command or terminal command. Defaults to `false`.
* **args**
    * Specifies additional arguments to pass to VS Code command. Only valid when `useVsCodeApi` is `true`.

## Usage

 ```json
 	"actionButtons": {
		 "reloadButton": null,
		 "loadNpmCommands": false,
		 "commands": [
			 {
				 "name": "Run Cargo",
				 "singleInstance": true,
				 "color": "#af565c",
				 "command": "cargo run ${file}",
			 },
		 ]
	 }
 ```

## Config Vars

As seen in the previous example, vars such as `${file}` can be used. Below is a list of each of them and what they do.

* `workspaceFolder` - the path of the folder opened in VS Code
* `workspaceFolderBasename` - the name of the folder opened in VS Code without any slashes (/)
* `file` - the current opened file
* `relativeFile` - the current opened file relative to workspaceFolder
* `fileBasename` - the current opened file's basename
* `fileBasenameNoExtension` - the current opened file's basename with no file extension
* `fileDirname` -  the current opened file's dirname
* `fileExtname` - the current opened file's extension
* `cwd` -  the task runner's current working directory on startup
* `lineNumber` - the current selected line number in the active file
* `selectedText` - the current selected text in the active file
* `execPath` - the path to the running VS Code executable

## Release Notes

### v1.1.5
Added support for VSCode API calls
Added `api` option.

### v1.1.4
Added support for VSCode predefined variables as ${file}
Added `cwd` option.
Added `reloadButton` option.

### v1.1.3
Added `loadNpmCommands` option.

### v1.1.2


### v1.1.0
Added `Refresh Action Buttons` action button

### v1.0.0
Changed configuration name from `run` to `actionButton`
Better support for js projects

### v0.0.8
Added `singleInstance` option.

### v0.0.7
Added support for default Colors

### v0.0.6
Added support for reading actions from the scripts segment of package.json.

### v0.0.3
Better documentation.

### v0.0.1
  Initial Release

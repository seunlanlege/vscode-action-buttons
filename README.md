# VsCode Action Buttons

This allows you to define custom actions such as `run` or `build` and append them to a status bar button in vscode.

## NEW!

You can now execute Visual Studio API commands through action buttons.

## Features

You can define a custom action to build a rust project like so.

![](action.gif)


## Installation and set up

 - [x] Search for `VsCode Action Buttons` in the extensions store.

 - [x] After installing, type `ctrl + shift + p` and open up work space settings.

 - [x] Now you can define, your action buttons. Below is a sample.

 - [x] Now Reload.

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
 ([List of VSCommands](https://gist.github.com/skfarhat/4e88ef386c93b9dceb98121d9457edbf) )

https://code.visualstudio.com/api/references/icons-in-labels

 # Alternatively

 If you open an existing project and want to set up action buttons for that workspace.

 * Define the action buttons in your workspace settings.
 * Then, click on `Refresh Action Buttons` in the status bar
 * You Should now see the action buttons on the status bar :).

# Config Options

## singleInstance: boolean default [false]
	Kills the running associated process and restarts it.

## focus: boolean default [false]
    Focus the terminal after running the command

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

# Release Notes

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

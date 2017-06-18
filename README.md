# VsCode Action Buttons

This allows you to define custom actions such as `run` or `build` and append them to a status bar button in vscode.

## Features

You can define a custom action to build a rust project like so.

![](action.gif)


## Installation and set up

 - [x]  Search for custom action buttons in the extensions store.

 - [x] After installing, type `ctrl + shift + p` and open up work space settings.

 - [x] Now you can define, your action buttons. Below is a sample

 ```json
 	"run": {
		 "commands": [
			 {
				 "name": "Run Cargo",
				 "color": "green",
				 "command": "cargo run", // This is executed in the terminal
			 },
			 {
				 "name": "Build Cargo",
				 "color": "green",
				 "command": "cargo build",
			 }
		 ]
	 }
 ```


## Release Notes


### v0.0.1
  Initial Release

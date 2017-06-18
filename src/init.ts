import * as vscode from 'vscode';

type RunButton = {
	command: string,
	name: string,
	color: string,
}

const registerCommand = vscode.commands.registerCommand

function init (context) {
	const config = vscode.workspace.getConfiguration("run")

	const commands = config.get("commands") as [RunButton] 

		if (commands) {
			commands.forEach(({ command, name, color }: RunButton) => {
	
			let disposable = registerCommand(`extension.${command.replace(' ', '')}`, () => {			
				const terminal = vscode.window.createTerminal()
				terminal.show(false)
				terminal.sendText(command)				
			});

			context.subscriptions.push(disposable);

			loadButton({ command: `extension.${command.replace(' ', '')}`, name, color })
			})
		} else {
      vscode.window.showInformationMessage('VsCode Action Buttons: You have no run commands ');			
		}

}

function loadButton ({ command, name, color }: RunButton) {
	const runButton = vscode.window.createStatusBarItem(1, 0)
	runButton.text = name
	runButton.color = color || "green"
	runButton.tooltip = "Runs the command specified in your workspace settings"
	runButton.command = command
	runButton.show()
}

export default init;

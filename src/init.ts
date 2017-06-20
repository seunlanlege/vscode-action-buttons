import * as vscode from 'vscode';

type RunButton = {
	command: string,
	name: string,
	color: string,
}

type Terminal = {
	name: string,
	terminal: vscode.Terminal,
}

const registerCommand = vscode.commands.registerCommand

function init (context) {
	const config = vscode.workspace.getConfiguration("run")

	const commands = config.get("commands") as [RunButton] 

		if (commands) {
			const terminals = [] as [Terminal]
			commands.forEach(({ command, name, color }: RunButton) => {
				const vsCommand = `extension.${command.replace(' ', '')}`
	
				let disposable = registerCommand(vsCommand, () => {
					const assocTerminal = terminals.find(el => el.name === vsCommand)
					if (!assocTerminal) {
						const terminal = vscode.window.createTerminal()
						terminal.show(false)
						terminal.sendText(command)
						terminals.push({ name: vsCommand, terminal })
					} else {
						assocTerminal.terminal.show()
						assocTerminal.terminal.sendText('clear')
						assocTerminal.terminal.sendText(command)
					}
				});

				context.subscriptions.push(disposable);

				loadButton({ command: vsCommand, name, color })
			})
		} else {
      // vscode.window.showInformationMessage('VsCode Action Buttons: You have no run commands ');			
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

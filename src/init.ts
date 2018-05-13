import * as vscode from 'vscode';
import { getPackageJson } from './packageJson'

interface RunButton {
	command: string,
	singleInstance?: boolean,
	name: string,
	color: string,
	showTooltip: boolean,
}

interface Terminal {
	name: string,
	terminal: vscode.Terminal,
}

const registerCommand = vscode.commands.registerCommand

const init =  async (context: vscode.ExtensionContext) => {
	let packageJson;
	try {
		packageJson = await getPackageJson()
	} catch (e) {
		console.log('Could Not Read package.json')
	}
	const config = vscode.workspace.getConfiguration("run")
	const defaultColor = config.get("defaultColor")
	const cmd = config.get("commands") as [RunButton]
	let commands = [];

	if (config) {
		commands.push(...cmd)
	}

	if (typeof packageJson !== 'undefined') {
		const { scripts } = packageJson
		let keys = Object.keys(scripts);
	
		const packageJsonCommands = keys.map(key => ({
			command: `npm run ${key}`,
			color: defaultColor || 'green',
			name: key,
		})) as [RunButton]

		commands = [...packageJsonCommands]
	}
	
		if (commands.length) {
			let terminals = [] as Terminal[]
			commands.forEach(({ command, name, color, singleInstance, showTooltip }: RunButton) => {
				const vsCommand = `extension.${command.replace(' ', '')}`
	
				let disposable = registerCommand(vsCommand, async () => {
					const assocTerminal = terminals.find(el => el.name === vsCommand) 
					if (!assocTerminal) {
						const terminal = vscode.window.createTerminal()
						terminal.show(false)
						terminals.push({ name: vsCommand, terminal })
						terminal.sendText(command)						
					} else {
						if (singleInstance) {
							terminals = terminals.filter(el => el.name !== vsCommand) 							
							assocTerminal.terminal.dispose();
							const terminal = vscode.window.createTerminal()
							terminal.show();
							terminal.sendText(command)
							terminals.push({ name: vsCommand, terminal })
						} else {						
							assocTerminal.terminal.show()
							assocTerminal.terminal.sendText('clear')
							assocTerminal.terminal.sendText(command)
						}
					}
				});

				context.subscriptions.push(disposable);

				loadButton({ command: vsCommand, name, color, showTooltip })
			})
		} else {
      // vscode.window.showInformationMessage('VsCode Action Buttons: You have no run commands ');			
		}

}

function loadButton ({ command, name, color, showTooltip }: RunButton) {
	const runButton = vscode.window.createStatusBarItem(1, 0)
	runButton.text = name
	runButton.color = color || "green"
	if (showTooltip === true) {
		runButton.tooltip = "Runs the command specified in your workspace settings"
	} else {
		runButton.tooltip = ""
	}
	
	runButton.command = command
	runButton.show()
}

export default init;

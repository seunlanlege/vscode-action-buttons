import { buildConfigFromPackageJson } from './packageJson'
import * as vscode from 'vscode'
import { RunButton } from './types'

const registerCommand = vscode.commands.registerCommand

const disposables = []

const init = async (context: vscode.ExtensionContext) => {
	disposables.forEach(d => d.dispose())
	const config = vscode.workspace.getConfiguration('actionButtons')
	const defaultColor = config.get<string>('defaultColor')
	const cmds = config.get<RunButton[]>('commands')
	const commands = []

	if (cmds && cmds.length) {
		commands.push(...cmds)
	}

	commands.push(...(await buildConfigFromPackageJson(defaultColor)))

	console.log({ commands })

	if (commands.length) {
		const terminals: { [name: string]: vscode.Terminal } = {}
		commands.forEach(
			({ command, name, color, singleInstance, showTooltip }: RunButton) => {
				const vsCommand = `extension.${name.replace(' ', '')}`

				const disposable = registerCommand(vsCommand, async () => {
					const assocTerminal = terminals[vsCommand]
					if (!assocTerminal) {
						const terminal = vscode.window.createTerminal(name)
						terminal.show(true)
						terminals[vsCommand] = terminal
						terminal.sendText(command)
					} else {
						if (singleInstance) {
							delete terminals[vsCommand]
							assocTerminal.dispose()
							const terminal = vscode.window.createTerminal(name)
							terminal.show(true)
							terminal.sendText(command)
							terminals[vsCommand] = terminal
						} else {
							assocTerminal.show()
							assocTerminal.sendText('clear')
							assocTerminal.sendText(command)
						}
					}
				})

				context.subscriptions.push(disposable)

				disposables.push(disposable)

				loadButton({
					vsCommand,
					command,
					name,
					color: color || defaultColor,
					showTooltip
				})
			}
		)
	} else {
		vscode.window.showInformationMessage(
			'VsCode Action Buttons: You have no run commands '
		)
	}
}

function loadButton({ command, name, color, showTooltip, vsCommand }: RunButton) {
	const runButton = vscode.window.createStatusBarItem(1, 0)
	runButton.text = name
	runButton.color = color || 'green'
	if (showTooltip === false) {
		runButton.tooltip = ''
	} else {
		runButton.tooltip = command
	}

	runButton.command = vsCommand
	runButton.show()
	disposables.push(runButton)
}

export default init

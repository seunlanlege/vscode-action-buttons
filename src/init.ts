import { buildConfigFromPackageJson } from './packageJson'
import * as vscode from 'vscode'
import { RunButton } from './types'
import * as path from 'path'

const registerCommand = vscode.commands.registerCommand

const disposables = []

const init = async (context: vscode.ExtensionContext) => {
	disposables.forEach(d => d.dispose())
	const config = vscode.workspace.getConfiguration('actionButtons')
	const defaultColor = config.get<string>('defaultColor')
	const loadNpmCommands = config.get<boolean>('loadNpmCommands')
	const cmds = config.get<RunButton[]>('commands')
	const commands = []

	loadButton({
		vsCommand: 'extension.refreshButtons',
		name: '↻',
		color: defaultColor || 'white',
		command: 'Refreshes the action buttons'
	})

	if (cmds && cmds.length) {
		commands.push(...cmds)
	}

	if (loadNpmCommands !== false) commands.push(...(await buildConfigFromPackageJson(defaultColor)))

	console.log({ commands })

	if (commands.length) {
		const terminals: { [name: string]: vscode.Terminal } = {}
		commands.forEach(
			({ command, name, color, singleInstance }: RunButton) => {
				const vsCommand = `extension.${name.replace(' ', '')}`

				const disposable = registerCommand(vsCommand, async () => {
					const vars = {

						// - the path of the folder opened in VS Code
						workspaceFolder: (vscode.workspace)? vscode.workspace.rootPath : null,

						// - the name of the folder opened in VS Code without any slashes (/)
						workspaceFolderBasename: (vscode.workspace)? path.basename(vscode.workspace.rootPath) : null,

						// - the current opened file
						file: (vscode.window.activeTextEditor) ? vscode.window.activeTextEditor.document.fileName : null,

						// - the current opened file relative to workspaceFolder
						relativeFile: (vscode.window.activeTextEditor) ? path.relative(
							vscode.workspace.rootPath,
							vscode.window.activeTextEditor.document.fileName
						) : null,

						// - the current opened file's basename
						fileBasename: (vscode.window.activeTextEditor) ? path.basename(vscode.window.activeTextEditor.document.fileName) : null,

						// - the current opened file's basename with no file extension
						fileBasenameNoExtension: (vscode.window.activeTextEditor) ? path.parse(path.basename(vscode.window.activeTextEditor.document.fileName)).name : null,

						// - the current opened file's dirname
						fileDirname: (vscode.window.activeTextEditor) ? path.dirname(vscode.window.activeTextEditor.document.fileName) : null,

						// - the current opened file's extension
						fileExtname: (vscode.window.activeTextEditor) ? path.parse(path.basename(vscode.window.activeTextEditor.document.fileName)).ext : null,
						
						// - the task runner's current working directory on startup
						cwd: process.cwd(),
						
						//- the current selected line number in the active file
						lineNumber: (vscode.window.activeTextEditor) ? vscode.window.activeTextEditor.selection.active.line + 1 : null,

						// - the current selected text in the active file
						selectedText: (vscode.window.activeTextEditor) ? vscode.window.activeTextEditor.document.getText(vscode.window.activeTextEditor.selection) : null,

						// - the path to the running VS Code executable
						execPath: process.execPath


					}

					const assocTerminal = terminals[vsCommand]
					if (!assocTerminal) {
						const terminal = vscode.window.createTerminal(name)
						terminal.show(true)
						terminals[vsCommand] = terminal
						terminal.sendText(interpolateString(command, vars))
					} else {
						if (singleInstance) {
							delete terminals[vsCommand]
							assocTerminal.dispose()
							const terminal = vscode.window.createTerminal(name)
							terminal.show(true)
							terminal.sendText(interpolateString(command, vars))
							terminals[vsCommand] = terminal
						} else {
							assocTerminal.show()
							assocTerminal.sendText('clear')
							assocTerminal.sendText(interpolateString(command, vars))
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
				})
			}
		)
	} else {
		vscode.window.showInformationMessage(
			'VsCode Action Buttons: You have no run commands '
		)
	}
}

function loadButton({
	command,
	name,
	color,
	vsCommand
}: RunButton) {
	const runButton = vscode.window.createStatusBarItem(1, 0)
	runButton.text = name
	runButton.color = color || 'white'
	runButton.tooltip = command

	runButton.command = vsCommand
	runButton.show()
	disposables.push(runButton)
}

function interpolateString(tpl: string, data: object): string {
	let re = /\$\{([^\}]+)\}/g, match;
	while (match = re.exec(tpl)) {
		let path = match[1].split('.').reverse();
		let obj = data[path.pop()];
		while (path.length) obj = obj[path.pop()];
		tpl = tpl.replace(match[0], obj)
	}
	return tpl;
}

export default init

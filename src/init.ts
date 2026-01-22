import { buildConfigFromPackageJson } from './packageJson'
import * as vscode from 'vscode'
import * as path from "path"
import { homedir } from "os"
import { ButtonOpts, CommandOpts, VsCodeVars } from './types'

const registerCommand = vscode.commands.registerCommand

const disposables = []

const init = async (context: vscode.ExtensionContext) => {
	disposables.forEach(d => d.dispose())
	const config = vscode.workspace.getConfiguration('actionButtons')
	const defaultColor = config.get<string>('defaultColor')
	const reloadButton = config.get<string>('reloadButton')
	const loadNpmCommands = config.get<boolean>('loadNpmCommands')
	const inheritGlobalCommands = config.get<boolean>('inheritGlobalCommands')
	const cmds = config.get<CommandOpts[]>('commands')
	const commands: CommandOpts[] = []

	if (reloadButton !== null) {
		loadButton({
			command: 'extension.refreshButtons',
			name: reloadButton,
			tooltip: 'Refreshes the action buttons',
			color: defaultColor
		})
	}
	else {
		const onCfgChange: vscode.Disposable = vscode.workspace.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration('actionButtons')) {
				vscode.commands.executeCommand('extension.refreshButtons');
			}
		});
		context.subscriptions.push(onCfgChange)
		disposables.push(onCfgChange);
	}

	if (inheritGlobalCommands) {
		let commandsInspected = config.inspect('commands');
		const cmdsGlobal = commandsInspected.globalValue as CommandOpts[];
		if (cmdsGlobal && cmdsGlobal.length) {
			commands.push(...cmdsGlobal)
		}
	}

	if (cmds && cmds.length) {
		commands.push(...cmds)
	}

	if (loadNpmCommands !== false) commands.push(...(await buildConfigFromPackageJson(defaultColor)))

	if (commands.length) {
		const terminals: { [name: string]: vscode.Terminal } = {}
		commands.forEach(
			({ cwd, saveAll, command, name, tooltip, color, singleInstance, focus, useVsCodeApi, args }: CommandOpts) => {
				const vsCommand = `extension.${name.replace(' ', '')}`

				const disposable = registerCommand(vsCommand, async () => {
					const vars: VsCodeVars = {
						userHome: homedir(),
						workspaceFolder: vscode.workspace.workspaceFolders[0].uri?.fsPath,
						workspaceFolderBasename: (vscode.workspace.workspaceFolders[0]) ? path.basename(vscode.workspace.workspaceFolders[0].uri?.fsPath) : null,
						file: (vscode.window.activeTextEditor) ? vscode.window.activeTextEditor.document.fileName : null,
						fileWorkspaceFolder: (vscode.window.activeTextEditor) ?
							vscode.workspace.getWorkspaceFolder(vscode.window.activeTextEditor.document.uri) != undefined ?
								normalizeDriveLetter(vscode.workspace.getWorkspaceFolder(vscode.window.activeTextEditor.document.uri).uri?.fsPath)
								: null
							: null,
						relativeFile: (vscode.window.activeTextEditor && vscode.workspace.workspaceFolders[0]) ? path.relative(
							vscode.workspace.workspaceFolders[0].uri?.fsPath,
							vscode.window.activeTextEditor.document.fileName
						) : null,
						relativeFileDirname: (vscode.window.activeTextEditor && vscode.workspace.workspaceFolders[0]) ? path.basename(path.dirname(path.relative(
							vscode.workspace.workspaceFolders[0].uri?.fsPath,
							vscode.window.activeTextEditor.document.fileName
						))) : null,
						fileBasename: (vscode.window.activeTextEditor) ? path.basename(vscode.window.activeTextEditor.document.fileName) : null,
						fileBasenameNoExtension: (vscode.window.activeTextEditor) ? path.parse(path.basename(vscode.window.activeTextEditor.document.fileName)).name : null,
						fileExtname: (vscode.window.activeTextEditor) ? path.parse(path.basename(vscode.window.activeTextEditor.document.fileName)).ext : null,
						fileDirname: (vscode.window.activeTextEditor) ? path.dirname(vscode.window.activeTextEditor.document.fileName) : null,
						fileDirnameBasename: (vscode.window.activeTextEditor) ? path.basename(path.dirname(vscode.window.activeTextEditor.document.fileName)) : null,
						lineNumber: (vscode.window.activeTextEditor) ? vscode.window.activeTextEditor.selection.active.line + 1 : null,
						columnNumber: (vscode.window.activeTextEditor) ? vscode.window.activeTextEditor.selection.active.character + 1 : null,
						selectedText: (vscode.window.activeTextEditor) ? vscode.window.activeTextEditor.document.getText(vscode.window.activeTextEditor.selection) : null,
						execPath: process.execPath,
						pathSeparator: process.platform == "win32" ? "\\" : "/",
						cwd: vscode.workspace.workspaceFolders[0].uri?.fsPath || homedir()
					};
					vars.cwd = interpolateString(cwd, vars) ?? vars.cwd

					if (!command) {
						vscode.window.showErrorMessage('No command to execute for this action');
						return;
					}

					if (saveAll) {
						vscode.commands.executeCommand('workbench.action.files.saveAll');
					}

					if (useVsCodeApi) {
						vscode.commands.executeCommand(command, ...(args || []));
					} else {
						let assocTerminal = terminals[vsCommand]
						if (!assocTerminal) {
							assocTerminal = vscode.window.createTerminal({ name, cwd: vars.cwd });
							terminals[vsCommand] = assocTerminal;
						} else {
							if (singleInstance) {
								delete terminals[vsCommand];
								assocTerminal.dispose();
								assocTerminal = vscode.window.createTerminal({ name, cwd: vars.cwd });
								terminals[vsCommand] = assocTerminal;
							} else {
								if (process.platform === "win32") {
									assocTerminal.sendText("cls");
								} else {
									assocTerminal.sendText("clear");
								}
							}
						}
						assocTerminal.show(!focus);
						assocTerminal.sendText(interpolateString(command, vars));
					}
				})

				context.subscriptions.push(disposable)

				disposables.push(disposable)

				loadButton({
					command: vsCommand,
					name,
					tooltip: tooltip || command,
					color: color || defaultColor,
				})
			}
		)
	} else {
		vscode.window.setStatusBarMessage(
			'VsCode Action Buttons: You have no run commands.',
			4000
		)
	}
}

function loadButton({
	command,
	name,
	tooltip,
	color,
}: ButtonOpts) {
	const runButton = vscode.window.createStatusBarItem(1, 0)
	runButton.text = name
	runButton.color = color
	runButton.tooltip = tooltip

	runButton.command = command
	runButton.show()
	disposables.push(runButton)
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function interpolateString(tpl: string, data: object): string {
	let re = /\$\{([^\}]+)\}/g, match;
	while (match = re.exec(tpl)) {
		if (match[1].startsWith("workspaceFolder:")) {
			const folderName = match[1].split(":")[1];
			const found = vscode.workspace.workspaceFolders.find(f => f.name === folderName);

			const value = found ? found.uri.fsPath : "";
			tpl = tpl.replace(match[0], value);
			continue;
		}
		let path = match[1].split('.').reverse();
		let obj = data[path.pop()];
		while (path.length) obj = obj[path.pop()];
		tpl = tpl.replace(new RegExp(escapeRegExp(match[0]), "g"), obj)
	}
	return tpl;
}

export function isWindowsDriveLetter(char0: string): boolean {
	return char0.match(/[A-Za-z]/) != null
}

export function hasDriveLetter(path: string, isWindowsOS: boolean): boolean {
	if (isWindowsOS) {
		return isWindowsDriveLetter(path.charAt(0)) && path.charAt(1) === ':';
	}

	return false;
}

export function normalizeDriveLetter(path: string): string {
	console.log("path: " + path)
	if (hasDriveLetter(path, process.platform == "win32")) {
		return path.charAt(0).toUpperCase() + path.slice(1);
	}

	return path;
}

export default init

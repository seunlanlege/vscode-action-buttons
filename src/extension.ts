'use strict'
import * as vscode from 'vscode'
import init from './init'

export function activate(context: vscode.ExtensionContext) {
	init(context)

	const refreshButtons = vscode.commands.registerCommand(
		'extension.refreshButtons',
		() => init(context)
	)

	const cycleButtonGroup = vscode.commands.registerCommand(
		'extension.cycleButtonGroup', async () => {
			const cycle = context.workspaceState.get<string[]>('actionButtons.groupCycle', ['all', 'none'])
			const current = context.workspaceState.get<string>('actionButtons.activeGroup', 'all')
			const next = cycle[(cycle.indexOf(current) + 1) % cycle.length]
			await context.workspaceState.update('actionButtons.activeGroup', next)
			init(context)
		}
	)

	context.subscriptions.push(refreshButtons, cycleButtonGroup)
}

// this method is called when your extension is deactivated
export function deactivate() {}

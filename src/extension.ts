'use strict';
import * as vscode from 'vscode';
import init from './init'


export function activate(context: vscode.ExtensionContext) {
		init(context);

    let disposable = vscode.commands.registerCommand('extension.refreshButtons', () => {
			init(context);				
    });

    context.subscriptions.push(disposable);
}



// this method is called when your extension is deactivated
export function deactivate() {
}
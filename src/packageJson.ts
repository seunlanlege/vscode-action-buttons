import { workspace } from 'vscode'

export const getPackageJson = async (): Promise<any> => new Promise ((resolve, reject) => {
	const cwd = workspace.rootPath

	try {
		const packageJson = require(`${cwd}/package.json`)

		resolve(packageJson)		
	} catch (e) {
		reject(e)
	}
})
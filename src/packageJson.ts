import { RunButton } from './types'
import { workspace } from 'vscode'

export const getPackageJson = async (): Promise<any> =>
	new Promise(resolve => {
		const cwd = workspace.rootPath

		try {
			const packageJson = require(`${cwd}/package.json`)

			resolve(packageJson)
		} catch (e) {
			resolve()
		}
	})

export const buildConfigFromPackageJson = async (defaultColor: string) => {
	const pkg = await getPackageJson()
	if (!pkg) {
		return []
	}
	const { scripts } = pkg

	return Object.keys(scripts).map(key => ({
		command: `npm run ${key}`,
		color: defaultColor || 'white',
		name: key,
		singleInstance: true
	})) as RunButton[]
}

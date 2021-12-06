export interface RunButton {
	cwd?: string
	command: string
	vsCommand: string
	singleInstance?: boolean
	name: string
	color: string
	focus?: boolean
	useVsCodeApi?: boolean
	args?: string[]
}

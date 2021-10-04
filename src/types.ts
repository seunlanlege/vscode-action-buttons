export interface RunButton {
	cwd?: string
	command: string
	vsCommand: string
	singleInstance?: boolean
	name: string
	color: string
	focus?: string
	useVsCodeApi?: boolean
}

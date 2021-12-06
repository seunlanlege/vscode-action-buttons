export interface RunButton {
	cwd?: string
	command: string
	vsCommand: string
	singleInstance?: boolean
	name: string
	color: string
	focus?: boolean
	useVsCodeApi?: boolean
}

export interface ButtonOpts {
	command: string
	tooltip: string
	name: string
	color: string
}
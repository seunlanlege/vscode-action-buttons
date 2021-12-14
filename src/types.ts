export interface CommandOpts {
	cwd?: string
	command: string
	singleInstance?: boolean
	name: string
	tooltip: string
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
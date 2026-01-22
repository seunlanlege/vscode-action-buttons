export interface CommandOpts {
	cwd?: string
	saveAll?: boolean
	command: string
	openOwnTerminal?: boolean
	singleInstance?: boolean
	name: string
	tooltip: string
	color: string
	focus?: boolean
	closeOnSuccess?: boolean
	useVsCodeApi?: boolean
	args?: string[]
}

export interface ButtonOpts {
	command: string
	tooltip: string
	name: string
	color: string
}
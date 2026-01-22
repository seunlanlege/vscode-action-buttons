export interface CommandOpts {
	cwd?: string
	saveAll?: boolean
	command: string
	singleInstance?: boolean
	name: string
	tooltip: string
	color: string
	focus?: boolean
	useVsCodeApi?: boolean
	args?: string[]
}

export interface ButtonOpts {
	command: string
	tooltip: string
	name: string
	color: string
}

export interface VsCodeVars {
	/**
	 * The path of the user's home folder
	*/
	userHome: string
	/**
	 * The path of the folder opened in VS Code
	 */
	workspaceFolder: string
	/**
	 * The name of the folder opened in VS Code without any slashes (/)
	 */
	workspaceFolderBasename: string | null
	/**
	 * The full path of the current opened file
	 */
	file: string | null
	/**
	 * The current opened file's workspace folder
	 */
	fileWorkspaceFolder: string | null
	/**
	 * The current opened file relative to workspaceFolder
	 */
	relativeFile: string | null
	/**
	 * The current opened file dirname relative to workspaceFolder
	 */
	relativeFileDirname: string | null
	/**
	 * The current opened file's basename
	 */
	fileBasename: string | null
	/**
	 * The current opened file name without extension
	 */
	fileBasenameNoExtension: string | null
	/**
	 * The current opened file extension
	 */
	fileExtname: string | null
	/**
	 * The current opened file's folder full path
	 */
	fileDirname: string | null
	/**
	 * The current opened file's folder dirname
	 */
	fileDirnameBasename: string | null
	/**
	 * The current selected line number in the active file
	 */
	lineNumber: number | null
	/**
	 * The current selected column number in the active file
	 */
	columnNumber: number | null
	/**
	 * The current selected text in the active file
	 */
	selectedText: string | null
	/**
	 * The path to the running VS Code executable
	 */
	execPath: any,
	/**
	 * The character used by the OS to seperate folders in uri paths
	 */
	pathSeparator: string,
	/**
	 * The task runner's current working directory on startup
	 */
	cwd: string
}
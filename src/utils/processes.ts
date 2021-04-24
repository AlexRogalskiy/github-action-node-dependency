import { ChildProcess, exec, ExecException, ExecOptions } from 'child_process'

import { Optional } from '../../typings/standard-types'
import { ExecCallback } from '../../typings/domain-types'

import { errorLogs, logs } from './loggers'

const DEFAULT_EXEC_CALLBACK = (error: Optional<ExecException>, stdout: string, stderr: string) => {
    error ? errorLogs(stderr) : logs(stdout)
}

export const execCommand = (
    command: string,
    options: ExecOptions,
    cb: ExecCallback = DEFAULT_EXEC_CALLBACK
): ChildProcess => {
    return exec(command, options, cb)
}

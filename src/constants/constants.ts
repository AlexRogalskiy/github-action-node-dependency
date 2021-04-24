import boxen from 'boxen'
import { ExecOptions } from 'child_process'

import { CommandOptions, ReportOptions } from '../../typings/domain-types'

/**
 * Command configuration options
 */
export const COMMAND_OPTIONS: Readonly<CommandOptions> = {
    command: 'npm',
    args: [],
}

/**
 * Report configuration options
 */
export const REPORT_OPTIONS: Readonly<ReportOptions> = {
    reportFile: 'report.json',
    reportPath: 'data',
}

/**
 * Output configuration options
 */
export const OUTPUT_OPTIONS: Readonly<boxen.Options> = {
    padding: 1,
    margin: 1,
    borderStyle: 'single',
    borderColor: 'yellow',
}

/**
 * Execution configuration options
 */
export const EXEC_OPTIONS: Readonly<ExecOptions> = {
    maxBuffer: 1024 * 1024,
}

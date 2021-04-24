import boxen from 'boxen'

import { ExecException, ExecOptions } from 'child_process'

import { OperationMode } from './enum-types'
import { Optional } from './standard-types'

//--------------------------------------------------------------------------------------------------
/**
 * CommandType
 * @desc Type representing supported commands
 */
export type CommandType = 'npm' | 'yarn'
//--------------------------------------------------------------------------------------------------
/**
 * ProfileOptions
 * @desc Type representing profiles options
 */
export type ProfileOptions = {
    /**
     * Command options
     */
    readonly commandOptions: CommandOptions
    /**
     * Report options
     */
    readonly reportOptions: ReportOptions
    /**
     * Execution options
     */
    readonly execOptions: ExecOptions
    /**
     * Output options
     */
    readonly outputOptions?: boxen.Options
}
//--------------------------------------------------------------------------------------------------
/**
 * ConfigOptions
 * @desc Type representing configuration options
 */
export type ConfigOptions = {
    /**
     * Command options
     */
    readonly commandOptions: CommandOptions
    /**
     * Resource options
     */
    readonly resourceOptions: ResourceOptions
    /**
     * Operation mode
     */
    readonly operation: OperationMode
}
//--------------------------------------------------------------------------------------------------
/**
 * CommandOptions
 * @desc Type representing command options
 */
export type CommandOptions = {
    /**
     * Command
     */
    readonly command: CommandType
    /**
     * Command arguments
     */
    readonly args: string[]
}
//--------------------------------------------------------------------------------------------------
/**
 * ResourceOptions
 * @desc Type representing resource options
 */
export type ResourceOptions = {
    /**
     * Target file
     */
    readonly targetFile: string
    /**
     * Target path
     */
    readonly targetPath: string
}
//--------------------------------------------------------------------------------------------------
/**
 * ReportOptions
 * @desc Type representing report options
 */
export type ReportOptions = {
    /**
     * Report file
     */
    readonly reportFile: string
    /**
     * Report path
     */
    readonly reportPath: string
}
//--------------------------------------------------------------------------------------------------
/**
 * ExecCallback
 * @desc Type representing executable callback
 */
export type ExecCallback = (error: Optional<ExecException>, stdout: string, stderr: string) => void
//--------------------------------------------------------------------------------------------------

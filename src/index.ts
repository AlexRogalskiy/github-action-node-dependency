import * as core from '@actions/core'

import { ConfigOptions } from '../typings/domain-types'
import { OperationMode, OperationStatus } from '../typings/enum-types'

import { getOperation } from './routes/routes'

import { valueError } from './errors/value.error'

import { getProperty, getRequiredProperty } from './utils/properties'
import { profile } from './utils/profiles'

const buildConfigOptions = (): ConfigOptions => {
    const sourceFile = getRequiredProperty('sourceFile')
    const targetFile = getProperty('targetFile') || profile.reportOptions.reportFile
    const targetPath = getProperty('targetPath') || profile.reportOptions.reportPath

    const commandOptions = profile.commandOptions
    const resourceOptions = { sourceFile, targetFile, targetPath }
    const mode = OperationMode[getRequiredProperty('mode')]

    return {
        commandOptions,
        resourceOptions,
        mode,
    }
}

const executeOperation = async (): Promise<OperationStatus> => {
    const options = buildConfigOptions()
    const operation = getOperation(options.mode)

    if (!operation) {
        throw valueError(`Invalid operation mode: ${options.mode}`)
    }

    return await operation(options)
}

export default async function run(): Promise<void> {
    try {
        const status = await executeOperation()

        core.setOutput('reportStatus', status)
    } catch (error) {
        core.setFailed(`Cannot process operation, message: ${error.message}`)
    }
}

run()

import * as core from '@actions/core'

import { ConfigOptions } from '../typings/domain-types'
import { OperationMode, OperationStatus } from '../typings/enum-types'

import { getOperator } from './routes/routes'

import { valueError } from './errors/value.error'

import { getProperty, getRequiredProperty } from './utils/properties'
import { profile } from './utils/profiles'
import { coreError } from './utils/loggers'

const buildConfigOptions = (): ConfigOptions => {
    const mode = getRequiredProperty('mode')

    const targetFile = getProperty('targetFile') || profile.reportOptions.reportFile
    const targetPath = getProperty('targetPath') || profile.reportOptions.reportPath

    const commandOptions = profile.commandOptions
    const resourceOptions = { targetFile, targetPath }
    const operation = OperationMode[mode]

    return {
        commandOptions,
        resourceOptions,
        operation,
    }
}

const executeOperation = async (): Promise<OperationStatus> => {
    const options = buildConfigOptions()
    const operator = getOperator(options.operation)

    if (!operator) {
        throw valueError(`Invalid operation mode: ${options.operation}`)
    }

    return await operator(options)
}

export default async function run(): Promise<void> {
    try {
        const status = await executeOperation()

        core.setOutput('reportStatus', status)
    } catch (error) {
        coreError(`Cannot process operation, message: ${error.message}`)
    }
}

run()

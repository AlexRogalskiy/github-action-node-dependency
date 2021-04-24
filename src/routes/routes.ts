import { OperationFunction } from '../../typings/service-types'
import { OperationMode } from '../../typings/enum-types'
import { Optional } from '../../typings/standard-types'
import { ConfigOptions } from '../../typings/domain-types'

import packageVersionsOperation from '../operations/package-versions.operation'
import multiPackageVersionsOperation from '../operations/multi-package-versions.operation'

/**
 * OperationType
 * @desc Type representing supported operations
 */
export type OperationType = Record<OperationMode, OperationFunction>

/**
 * Wraps input {@link OperationFunction} with supplied array of {@link string} arguments
 * @param operator initial input {@link OperationFunction} to operate by
 * @param values initial input array of {@link string} arguments
 */
const wrap = (operator: OperationFunction, ...values: string[]): OperationFunction => {
    return async (options: ConfigOptions) => {
        const { operation, resourceOptions } = options
        const args = [...options.commandOptions.args, ...values]
        const commandOptions = { command: options.commandOptions.command, args }

        return operator({ operation, commandOptions, resourceOptions })
    }
}

/**
 * Route mappings
 * @desc Type representing supported route mappings
 */
const routes: Readonly<OperationType> = {
    [OperationMode.package_versions]: wrap(packageVersionsOperation, 'ls', '--json'),
    [OperationMode.multi_package_versions]: wrap(multiPackageVersionsOperation, 'ls', '--json'),
}

/**
 * Returns {@link OperationFunction} by input {@link OperationMode} value
 * @param value initial input {@link OperationMode} to fetch by
 */
export const getOperator = (value: Optional<OperationMode>): Optional<OperationFunction> => {
    return value ? routes[value] : null
}

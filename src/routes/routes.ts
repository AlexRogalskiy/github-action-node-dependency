import { OperationFunction } from '../../typings/service-types'
import { OperationMode } from '../../typings/enum-types'
import { Optional } from '../../typings/standard-types'
import { ConfigOptions } from '../../typings/domain-types'

import getPackageVersionsOperation from '../operations/package-versions.operation'

/**
 * OperationType
 * @desc Type representing supported operations
 */
export type OperationType = Record<OperationMode, OperationFunction>

/**
 * Wraps input {@link OperationFunction} with supplied array of {@link string} arguments
 * @param operation initial input {@link OperationFunction} to operate by
 * @param args initial input array of {@link string} arguments
 */
const wrap = (operation: OperationFunction, args: string[]): OperationFunction => {
    return (options: ConfigOptions) => {
        options.commandOptions.args.concat(args)
        return operation(options)
    }
}

/**
 * Route mappings
 * @desc Type representing supported route mappings
 */
const routes: Readonly<OperationType> = {
    [OperationMode.package_versions]: wrap(getPackageVersionsOperation, ['ls', '--json']),
}

/**
 * Returns {@link OperationFunction} by input {@link OperationMode} value
 * @param value initial input {@link OperationMode} to fetch by
 */
export const getOperation = (value: Optional<OperationMode>): Optional<OperationFunction> => {
    return value ? routes[value] : null
}

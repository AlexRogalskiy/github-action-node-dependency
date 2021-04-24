import { ConfigOptions } from './domain-types'
import { OperationStatus } from './enum-types'

/**
 * OperationFunction
 * @desc Type representing single unit of work per operation
 */
export type OperationFunction = (options: ConfigOptions) => Promise<OperationStatus>
//--------------------------------------------------------------------------------------------------

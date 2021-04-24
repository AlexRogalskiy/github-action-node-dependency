import { ErrorType } from '../../typings/enum-types'

import { ExtendableError } from './extendable.error'

/**
 * GeneralError
 * @desc Class representing general error
 */
export class GeneralError extends ExtendableError {
    /**
     * Error arguments
     */
    readonly args: any[] = []

    /**
     * General error constructor by input parameters
     * @param type initial input {@link ErrorType}
     * @param message initial input {@link string} message
     * @param args initial input {@link Array} of arguments
     */
    constructor(readonly type: ErrorType, readonly message: string, ...args: any[]) {
        super(type, message)
        this.args = args
    }

    /**
     * Updates current logging information
     * @protected
     */
    protected logMessage(): void {
        console.error(this.message, this.args)
    }
}

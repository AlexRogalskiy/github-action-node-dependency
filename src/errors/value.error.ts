import { ErrorType } from '../../typings/enum-types'

import { GeneralError } from './general.error'

/**
 * ValueError
 * @desc Class representing value error
 */
export class ValueError extends GeneralError {
    /**
     * Value error constructor by input parameters
     * @param message initial input {@link string} message
     * @param args initial input {@link Array} of arguments
     */
    constructor(readonly message: string, ...args: any[]) {
        super(ErrorType.value_error, message, args)
    }
}

export const valueError = (message: string, ...args: any[]): ValueError => {
    return new ValueError(message, args)
}

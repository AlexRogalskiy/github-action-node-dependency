import { ErrorType } from '../../typings/enum-types'

import { hasProperty } from '../utils/validators'

/**
 * ExtendableError
 * @desc Class representing extendable error
 */
export class ExtendableError extends Error {
    /**
     * Extendable error constructor by input parameters
     * @param type initial input {@link ErrorType}
     * @param message initial input {@link string} message
     */
    constructor(readonly type: ErrorType, readonly message: string) {
        super(message)

        Object.defineProperty(this, 'message', {
            configurable: true,
            enumerable: false,
            value: message,
            writable: true,
        })

        Object.defineProperty(this, 'type', {
            configurable: true,
            enumerable: false,
            value: type,
            writable: true,
        })

        Object.defineProperty(this, 'name', {
            configurable: true,
            enumerable: false,
            value: this.constructor.name,
            writable: true,
        })

        if (hasProperty(Error, 'captureStackTrace')) {
            Error.captureStackTrace(this, this.constructor)
            return
        }

        Object.defineProperty(this, 'stack', {
            configurable: true,
            enumerable: false,
            value: new Error(message).stack,
            writable: true,
        })

        if (typeof this.stack === 'string') {
            const indexOfMessage = this.stack.indexOf(this.message) + this.message.length
            const thisStackTrace = this.stack.slice(indexOfMessage).split('\n').reverse()

            this.stack = `${this.stack.slice(0, indexOfMessage)}${thisStackTrace.reverse().join('\n')}`
        }
    }
}

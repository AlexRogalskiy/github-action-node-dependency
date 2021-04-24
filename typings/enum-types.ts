/**
 * Profile
 * @desc Type representing supported profiles
 */
export enum Profile {
    dev = 'dev',
    prod = 'prod',
    test = 'test',
}

//--------------------------------------------------------------------------------------------------
/**
 * OperationMode
 * @desc Type representing supported operation modes
 */
export enum OperationMode {
    package_versions = 'dependency-versions',
}

//--------------------------------------------------------------------------------------------------
/**
 * OperationStatus
 * @desc Type representing supported operation statuses
 */
export enum OperationStatus {
    success = 'SUCCESS',
    fail = 'FAILED',
}

//--------------------------------------------------------------------------------------------------
/**
 * ErrorType
 * @desc Type representing supported errors
 */
export enum ErrorType {
    general_error = 'GeneralError',
    parser_error = 'ParserError',
    validation_error = 'ValidationError',
    request_error = 'RequestError',
    response_error = 'ResponseError',
    parameter_error = 'ParameterError',
    type_error = 'TypeError',
    value_error = 'ValueError',
}

//--------------------------------------------------------------------------------------------------

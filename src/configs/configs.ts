import { Profile } from '../../typings/enum-types'
import { ProfileOptions } from '../../typings/domain-types'

import { COMMAND_OPTIONS, EXEC_OPTIONS, OUTPUT_OPTIONS, REPORT_OPTIONS } from '../constants/constants'

/**
 * ProfileRecord
 * @desc Type representing profiles configuration options
 */
export type ProfileRecord = Record<Profile, Partial<ProfileOptions>>

/**
 * Configuration options
 */
export const CONFIG: Readonly<ProfileRecord> = {
    dev: {
        commandOptions: COMMAND_OPTIONS,
        reportOptions: REPORT_OPTIONS,
        execOptions: EXEC_OPTIONS,
        outputOptions: OUTPUT_OPTIONS,
    },
    prod: {
        commandOptions: COMMAND_OPTIONS,
        reportOptions: REPORT_OPTIONS,
        execOptions: EXEC_OPTIONS,
        outputOptions: OUTPUT_OPTIONS,
    },
    test: {
        commandOptions: COMMAND_OPTIONS,
        reportOptions: REPORT_OPTIONS,
        execOptions: EXEC_OPTIONS,
        outputOptions: OUTPUT_OPTIONS,
    },
}

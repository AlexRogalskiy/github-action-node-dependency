import * as core from '@actions/core'

export const getRequiredProperty = (property: string): string => {
    return getProperty(property, { required: true })
}

export const getProperty = (property: string, options?: core.InputOptions): string => {
    return core.getInput(property, options)
}

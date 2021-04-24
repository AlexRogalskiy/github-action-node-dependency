import { Optional } from '../../typings/standard-types'
import { ProfileOptions } from '../../typings/domain-types'

import { hasProperty } from './validators'

import { CONFIG } from '../configs/configs'

const { NODE_ENV } = process && process.env

export const getProfileByEnv = (env: Optional<string> = NODE_ENV): ProfileOptions => {
    return env && hasProperty(CONFIG, env) ? CONFIG[env] : CONFIG.dev
}

export const profile = getProfileByEnv()

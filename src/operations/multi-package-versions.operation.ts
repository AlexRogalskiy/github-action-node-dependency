import * as jora from 'jora'
import { promisify } from 'util'
import { ChildProcess, ExecException, ExecOptions } from 'child_process'

import { Optional } from '../../typings/standard-types'
import { ConfigOptions, ExecCallback } from '../../typings/domain-types'
import { OperationStatus } from '../../typings/enum-types'

import { storeDataAsJson } from '../utils/files'
import { execCommand } from '../utils/processes'
import { deserialize, serialize } from '../utils/serializers'
import { toString } from '../utils/commons'

import { boxenLogs, errorLogs } from '../utils/loggers'
import { profile } from '../utils/profiles'

import { valueError } from '../errors/value.error'

const packageVersions = (pkg: any, level = '', skipSelf = true): any => {
    const result = {}
    const value = `${pkg.version.toString()}${
        pkg.otherVersions.length > 0 ? `[${pkg.otherVersions.join(', ')}]` : ''
    }`

    result[`${level + pkg.name}`] = skipSelf ? [] : [value]

    const nodeLevel = level.replace('└─ ', '').replace('├─ ', '')
    const deps = pkg.dependencies.map(value => packageVersions(value, nodeLevel, false))

    for (const item of deps) {
        result[`${level + pkg.name}`].push(item)
    }

    return result
}

const execCommandAsync = promisify<string, ExecOptions, ExecCallback, ChildProcess>(execCommand)

const execCallback = (options: ConfigOptions) => (
    error: Optional<ExecException>,
    stdout: string,
    stderr: string
) => {
    if (error) {
        throw valueError(stderr)
    }

    const tree = deserialize(stdout)

    const packages = jora(`
                $normalizedDeps: => dependencies.entries().({ name: key, ...value });
                $multiVersionPackages:
                    ..$normalizedDeps()
                    .group(=>name, =>version)
                    .({ name: key, versions: value.sort() })
                    .[versions.size() > 1];
                $pathToMultiVersionPackages: => .($name; {
                    name,
                    version,
                    otherVersions: $multiVersionPackages[=>name=$name].versions - version,
                    dependencies: $normalizedDeps()
                        .$pathToMultiVersionPackages()
                        .[name in $multiVersionPackages.name or dependencies]
                });
                $pathToMultiVersionPackages()
            `)(tree)

    const { targetFile, targetPath } = options.resourceOptions
    const versions = packageVersions(packages)

    storeDataAsJson(targetPath, targetFile, versions)
}

export default async function multiPackageVersionsOperation(
    options: ConfigOptions
): Promise<OperationStatus> {
    boxenLogs(`Executing multi package versions operation with options: ${serialize(options)}`)

    try {
        const { command, args } = options.commandOptions
        const expression = toString([command, ...args], ' ')

        await execCommandAsync(expression, profile.execOptions, execCallback(options))

        return Promise.resolve(OperationStatus.success)
    } catch (error) {
        errorLogs(error.message)

        return Promise.reject(OperationStatus.fail)
    }
}

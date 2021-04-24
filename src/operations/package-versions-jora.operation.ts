import * as jora from 'jora'
import { promisify } from 'util'
import { ChildProcess, ExecException, ExecOptions } from 'child_process'

import { Optional } from '../../typings/standard-types'
import { ConfigOptions, ExecCallback } from '../../typings/domain-types'
import { OperationStatus } from '../../typings/enum-types'

import { storeDataAsJson } from '../utils/files'
import { execCommand } from '../utils/processes'
import { deserialize } from '../utils/serializers'
import { toString } from '../utils/commons'

import { boxenLogs, errorLogs } from '../utils/loggers'
import { profile } from '../utils/profiles'

import { valueError } from '../errors/value.error'

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

    const versions = packageVersions(packages)

    storeDataAsJson(options.resourceOptions.targetPath, options.resourceOptions.targetFile, versions)
}

const packageVersions = (pkg: any, level = ''): string[] => {
    const value =
        level +
        pkg.name +
        '@' +
        pkg.version +
        (pkg.otherVersions.length ? ` [more versions: ${pkg.otherVersions.join(', ')}]` : '')
    const result = [value]

    level = level.replace('└─ ', '   ').replace('├─ ', '│  ')
    pkg.dependencies
        .map((dep, idx, arr) => packageVersions(dep, level + (idx === arr.length - 1 ? '└─ ' : '├─ ')))
        .forEach(v => result.push(v))

    return result
}

export default async function getPackageVersionsOperation(options: ConfigOptions): Promise<OperationStatus> {
    boxenLogs(`Executing dependency versions operation with options: ${options}`)

    try {
        const { command, args } = options.commandOptions
        const expression = toString([command, ...args], ' ')

        await execCommandAsync(expression, profile.execOptions, execCallback(options))

        return Promise.reject(OperationStatus.success)
    } catch (error) {
        errorLogs(error.message)

        return Promise.reject(OperationStatus.fail)
    }
}

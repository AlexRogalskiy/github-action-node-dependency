import { ExecException } from 'child_process'

import { Optional } from '../../typings/standard-types'
import { ConfigOptions } from '../../typings/domain-types'
import { OperationStatus } from '../../typings/enum-types'

import { toString } from '../utils/commons'
import { storeDataAsJson } from '../utils/files'
import { execCommand } from '../utils/processes'
import { deserialize } from '../utils/serializers'

import { boxenLogs, errorLogs } from '../utils/loggers'
import { profile } from '../utils/profiles'

import { valueError } from '../errors/value.error'

type PackageInfo = {
    name: string
    version: string
    otherVersions: string[]
    dependencies: any[]
}

const execCallback = (options: ConfigOptions) => (
    error: Optional<ExecException>,
    stdout: string,
    stderr: string
) => {
    if (error) {
        throw valueError(stderr)
    }

    const tree = deserialize(stdout)
    const multipleVersionPackages = collectVersions(tree)

    for (const key in multipleVersionPackages) {
        if (Object.prototype.hasOwnProperty.call(multipleVersionPackages, key)) {
            if (multipleVersionPackages[key].size === 1) {
                delete multipleVersionPackages[key]
            } else {
                multipleVersionPackages[key] = [...multipleVersionPackages[key]].sort()
            }
        }
    }

    const depsPathsToMultipleVersionPackages = processTree(tree, '', multipleVersionPackages)

    const versions = packageVersions(depsPathsToMultipleVersionPackages)

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

const collectVersions = (pkg: any, map = {}): any => {
    for (const key in pkg.dependencies) {
        if (Object.prototype.hasOwnProperty.call(pkg.dependencies, key)) {
            if (!map[key]) {
                map[key] = new Set()
            }

            map[key].add(pkg.dependencies[key].version)

            collectVersions(pkg.dependencies[key], map)
        }
    }

    return map
}

const processTree = (pkg: any, name: string, map: any = {}): Optional<PackageInfo> => {
    const deps: PackageInfo[] = []
    const pkgName = pkg.name || name

    for (const key in pkg.dependencies) {
        if (Object.prototype.hasOwnProperty.call(pkg.dependencies, key)) {
            const dep = processTree(pkg.dependencies[key], key, map)

            if (dep) {
                deps.push(dep)
            }
        }
    }

    if (pkgName in map || deps.length) {
        return {
            name: pkgName,
            version: pkg.version,
            otherVersions: pkgName in map ? map[pkgName].filter(version => version !== pkg.version) : [],
            dependencies: deps,
        }
    }

    return null
}

export default async function getPackageVersionsOperation(options: ConfigOptions): Promise<OperationStatus> {
    boxenLogs(`Executing dependency versions operation with options: ${options}`)

    try {
        const { command, args } = options.commandOptions
        const expression = toString([command, ...args], ' ')

        execCommand(expression, profile.execOptions, execCallback(options))

        return Promise.reject(OperationStatus.success)
    } catch (error) {
        errorLogs(error.message)

        return Promise.reject(OperationStatus.fail)
    }
}

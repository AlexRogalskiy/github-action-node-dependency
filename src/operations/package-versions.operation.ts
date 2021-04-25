import { ExecException } from 'child_process'

import { Optional } from '../../typings/standard-types'
import { ConfigOptions } from '../../typings/domain-types'
import { OperationStatus } from '../../typings/enum-types'

import { toString } from '../utils/commons'
import { storeDataAsJson } from '../utils/files'
import { execCommand } from '../utils/processes'
import { deserialize, serialize } from '../utils/serializers'

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
            multipleVersionPackages[key] = [...multipleVersionPackages[key]].sort((a, b) => a - b)
        }
    }

    const { targetFile, targetPath } = options.resourceOptions
    const packages = processTree(tree, '', multipleVersionPackages)
    const versions = packageVersions(packages)

    storeDataAsJson(targetPath, targetFile, versions)
}

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

    if (pkgName in map || deps.length > 0) {
        return {
            name: pkgName,
            version: pkg.version,
            otherVersions: pkgName in map ? map[pkgName].filter(version => version !== pkg.version) : [],
            dependencies: deps,
        }
    }

    return null
}

export default async function packageVersionsOperation(options: ConfigOptions): Promise<OperationStatus> {
    boxenLogs(`Executing package versions operation with options: ${serialize(options)}`)

    try {
        const { command, args } = options.commandOptions
        const expression = toString([command, ...args], ' ')

        execCommand(expression, profile.execOptions, execCallback(options))

        return Promise.resolve(OperationStatus.success)
    } catch (error) {
        errorLogs(error.message)

        return Promise.reject(OperationStatus.fail)
    }
}

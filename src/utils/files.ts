import { join } from 'path'
import {
    accessSync,
    closeSync,
    constants,
    createWriteStream,
    existsSync,
    MakeDirectoryOptions,
    mkdirSync,
    openSync,
    promises,
    readFileSync,
    statSync,
    writeFile,
    WriteStream,
} from 'fs'

import { ConfigOptions } from '../../typings/domain-types'

import { coreInfo } from './loggers'
import { deserialize, serialize } from './serializers'

export const ensureDirExists = (dir: string, options: MakeDirectoryOptions = { recursive: true }): void => {
    existsSync(dir) || mkdirSync(dir, options)
}

export const getFilesizeInBytes = (filename: string): number => {
    //return await fs.promises.stat(file)).size
    return statSync(filename).size
}

export const getConfigOptions = (fileName: string): Partial<ConfigOptions>[] => {
    const fileData = readFileSync(fileName)

    return deserialize(fileData.toString())
}

export const storeDataAsJson = (filePath: string, fileName: string, data: any): void => {
    ensureDirExists(filePath)

    const targetPath = join(filePath, fileName)

    coreInfo(`Storing JSON data to target file: ${targetPath}`)

    writeFile(targetPath, serialize(data), err => {
        if (err) {
            throw err
        }
    })
}

export const isFileExists = (fileName: string, mode = constants.F_OK | constants.R_OK): boolean => {
    try {
        accessSync(fileName, mode)

        return true
    } catch (error) {
        return false
    }
}

export const getSizeInBytesAsync = async (filename: string): Promise<number> => {
    return (await promises.stat(filename)).size
}

export const getSizeInBytes = (filename: string): number => {
    return statSync(filename).size
}

export const createWritableStream = (filename: string): WriteStream => {
    closeSync(openSync(filename, 'w'))

    return createWriteStream(filename, { flags: 'w' })
}

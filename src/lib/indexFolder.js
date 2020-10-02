import { readdirSync, lstatSync } from 'fs'
import { dirname, basename, normalize, sep } from 'path'
import { getSync } from 'winattr'

const ISWIN = process.platform.startsWith('win')

export default Object.assign(indexFolder, {
    indexFolderGen,
    fileObject,
})

function indexFolder(in_path) {
    return Array.from(indexFolderGen(in_path))
}

function* indexFolderGen(in_path) {
    const root = typeof (in_path) === 'string' ? fileObject(dirname(in_path), basename(in_path)) : in_path
    Object.assign(root, { numFiles: 0, numFolders: 0, folderSizeBytes: 0, })

    for (let name of readdirSync(in_path)) {
        const child = fileObject(in_path, name)
        if (child.isFolder) {
            for (let descendant of indexFolderGen(child.fullName)) {
                root.folderSizeBytes += descendant.sizeBytes
                descendant.isFolder ? root.numFolders++ : root.numFiles++
                yield descendant
            }
            // No yield obj here, since folders yield themselves (as root)
        } else {
            root.numFiles++
            yield child
        }
        root.folderSizeBytes += child.sizeBytes
    }
    yield root
}

function fileObject(inLocation, name) {
    const location = normalize(inLocation)
    const fullName = name ? (location + sep + name) : location
    const stat = lstatSync(fullName)
    const attributes = ISWIN ? getSync(fullName) : { hidden: name.startsWith('.') }
    return {
        name,
        location,
        fullName,
        isFolder: stat.isDirectory(),
        sizeBytes: stat.size,
        atime: stat.atime,
        ctime: stat.ctime,
        mtime: stat.mtime,
        ...attributes
    }
}

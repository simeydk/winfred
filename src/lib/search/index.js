import fs from 'fs'
import path from 'path'
import { Op } from 'sequelize'
import indexFolder from '../indexFolder'
import setupSequelize from './sequelize'


let models

async function init() {
    const sequelize = await setupSequelize()
    models = sequelize.models
    console.log('done setting up sequelize', sequelize.models)
}

async function update(sources) {
    const where = sources ? {location: sources} : {} 
    for (const source of await models.Source.findAll({where})) {
        await source.removeDirEntries({where:{}, truncate:true})
        const dirEntries = await models.DirEntry.bulkCreate(indexFolder(source.location))
        await source.addDirEntries(dirEntries)
    }
}

function all() {
    return models.DirEntry.findAll().then(extractDataValues)
}

function extractDataValues(results) {
    return results.map(result => result.dataValues)
}

async function search(queryString, filesOnly = true) {
    const words = queryString.split(' ')
    const filesOnlyFilter = filesOnly ? { isFolder: false } : {}
    const results = await models.DirEntry.findAll({
        where: {
            [Op.and]: words.map(word => ({ name: { [Op.substring]: word } })),
            ...filesOnlyFilter,
        }
    }).then(extractDataValues)
    return results
}

function browse(location) {
    return models.DirEntry.findAll({ where: { location } }).then(extractDataValues)
}

function addSources(sources) {
    const missingSources = sources.filter(source => !fs.existsSync(source))
    if (missingSources.length > 0) throw new Error('The following sources do not exist:\n' + missingSources.join('\n'))
    models.Source.bulkCreate(sources.map(path.normalize).map(source => ({ location: source })))
}

function setSources(sources) {
    console.log(models)
    models.Source.destroy({ where: {}, truncate: true })
    addSources(sources)
}

function getSources() {
    return models.Source.findAll().then(extractDataValues)
}

export default {
    init,
    all,
    search,
    browse,
    update,
    getSources,
    setSources,
}

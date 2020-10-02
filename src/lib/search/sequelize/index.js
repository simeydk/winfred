const { Sequelize, DataTypes, Model } = require('sequelize');
const addDirEntry = require('./models/DirEntry.model')
const addSource = require('./models/Source.model')
const DEFAULT_OPTIONS = {
    dialect: 'sqlite',
    logging: false,
    storage: 'db.sqlite',
}

module.exports = async (options = {}) => {
    const sequelize = new Sequelize({...DEFAULT_OPTIONS, ...options})
    
    addDirEntry(sequelize)
    addSource(sequelize)
    
    
    const {DirEntry, Source} = sequelize.models
    
    Source.hasMany(DirEntry)
    DirEntry.belongsTo(Source)
    await sequelize.sync({force:true})

    return sequelize
    }

const { DataTypes } = require('sequelize');

const NULLABLE_BOOL = {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: null,
}

const NULLABLE_DOUBLE = {
    type: DataTypes.DOUBLE,
    allowNull: true,
    defaultValue: null,
}

module.exports = (sequelize) => {
    const DirEntry = sequelize.define('DirEntry', {       
        // Model attributes are defined here
        name: {type: DataTypes.TEXT, unique: 'name+location'},
        location: {type: DataTypes.TEXT, unique: 'name+location'},
        fullName: {type: DataTypes.TEXT, unique: 'fullName'},
        isFolder: DataTypes.BOOLEAN,
        sizeBytes: DataTypes.DOUBLE,
        atime: DataTypes.DATE,
        ctime: DataTypes.DATE,
        mtime: DataTypes.DATE,
        archive:{...NULLABLE_BOOL},
        hidden:{...NULLABLE_BOOL},
        readonly:{...NULLABLE_BOOL},
        system:{...NULLABLE_BOOL},
        numFiles: {...NULLABLE_DOUBLE},
        numFolders: {...NULLABLE_DOUBLE},
        folderSizeBytes: {...NULLABLE_DOUBLE},
    },{timestamps: false});
    return DirEntry
}


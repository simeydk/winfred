const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Source = sequelize.define('Source', {
        // Model attributes are defined here
        location: { type: DataTypes.TEXT, primaryKey: true },
    }, 
    { 
        timestamps: false 
    });
    return Source
}


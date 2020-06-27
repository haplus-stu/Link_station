'use strict';
const loader = require('./sequelize-loader');
const Sequelize = loader.Sequelize;

const Link = loader.database.define('link',{
    name:{
        type: Sequelize.STRING,
        primaryKey:true,
        allowNull:false
    },
    url:{
        type:Sequelize.STRING,
        allowNull:false
    },
    userId:{
        type: Sequelize.STRING,
        allowNull:false
    }
},{
    freezeTableName:true,
    timestamps:false
});

module.exports = Link;
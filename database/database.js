const Sequelize = require('sequelize');

const connection = new Sequelize('pergunteinvestidor','root','M4theus$$',{
    host:'localhost',
    dialect:'mysql'
});

module.exports=connection;

const {Sequelize} = require('sequelize'); 

const sequelize = new Sequelize('node-complete', 'root', 'IHAvmu18!', {dialect: 'mysql', host:'localHost'} );

module.exports = sequelize;
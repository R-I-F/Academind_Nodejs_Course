const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../util/database');

const OrderItem = sequelize.define('orderItem', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    qty: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

module.exports = OrderItem;
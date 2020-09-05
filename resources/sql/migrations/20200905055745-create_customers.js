'use strict';

module.exports = {
  up: async (qi, { DataTypes }) => qi.createTable('customers', {
    customerId: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    customerName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    contactPhoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    customerIdNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    customerBirthdate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    latestStatus: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdTime: DataTypes.DATE,
    normalTime: DataTypes.DATE,
    blockedTime: DataTypes.DATE,
  }),

  down: async (qi, Sequelize) => qi.dropTable('customers'),
};

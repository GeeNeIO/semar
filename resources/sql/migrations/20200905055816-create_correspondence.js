'use strict';

module.exports = {
  up: async (qi, { DataTypes }) => qi.createTable('correspondence', {
    correspondentId: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    customerId: {
      type: DataTypes.STRING,
      onDelete: 'CASCADE',
      references: {
        model: 'customers',
        key: 'customerId',
        as: 'customerData'
      },
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    createdTime: DataTypes.DATE,
    lastUpdatedTime: DataTypes.DATE,
  }),

  down: async (qi, Sequelize) => qi.dropTable('correspondence'),
};

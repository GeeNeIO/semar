'use strict';

const Promise = require('bluebird');

module.exports = {
  up: async (qi, { DataTypes }) => qi.createTable('BankAccounts', {
    bankId: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    fkTableName: {
      type: DataTypes.STRING,
      alowNull: false,
    },
    fkTableId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    accountName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    accountNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bankName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdTime: DataTypes.DATE,
    updatedTime: DataTypes.DATE,
  }).then(() => Promise.all([
    qi.addIndex('BankAccounts', [
      'fkTableName',
      'fkTableId',
    ], {
      fields: [
        'fkTableName',
        'fkTableId',
      ],
    }),
    qi.addIndex('BankAccounts', [
      'bankName',
      'accountNumber'
    ], {
      fields: [
        'bankName',
        'accountNumber',
      ]
    }),
  ])),

  down: async (qi, Sequelize) => qi.dropTable('BankAccounts')
};

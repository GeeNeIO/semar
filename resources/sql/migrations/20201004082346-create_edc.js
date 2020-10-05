'use strict';

const Promise = require('bluebird');

module.exports = {
  up: async (qi, { DataTypes }) => qi.createTable('Edcs', {
    edcId: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    agentId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    serialNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    merchantName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    issuer: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    feeOnUs: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 200,
    },
    feeOffUs: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 200,
    },
    limitPerMonth: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: '1000000000',
    },
    bankAccountId: {
      type: DataTypes.STRING,
    },
    createdTime: DataTypes.DATE,
    lastUpdatedTime: DataTypes.DATE,
  }).then(() => Promise.all([
    qi.addIndex('Edcs', [
      'issuer',
      'serialNumber',
    ], {
      fields: [
        'issuer',
        'serialNumber',
      ],
      unique: true,
    }),
    qi.addIndex('Edcs', [
      'agentId',
    ], {
      fields: [
        'agentId',
      ],
    })
  ])),

  down: async (qi, { DataTypes }) => qi.dropTable('Edcs'),
};

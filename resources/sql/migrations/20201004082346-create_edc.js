'use strict';

const Promise = require('bluebird');

module.exports = {
  up: async (qi, { DataTypes }) => qi.createTable('Edcs', {
    edcId: {
      type: DataTypes.STRING,
      primaryKey: true,
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
    fee: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 200,
    },
    feeDecimalPoint: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 2,
    },
    limitPerMonth: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: '1000000000',
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
  ])),

  down: async (qi, { DataTypes }) => qi.dropTable('Edcs'),
};

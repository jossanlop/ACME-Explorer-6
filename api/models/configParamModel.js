'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var ConfigParamSchema = new Schema({
  finderTimeCache: {
    type: Number,
    default: 1,
    min: 1,
    max: 24
  },
  finderMaxNum: {
    type: Number,
    default: 10,
    min: 1,
    max: 100
  },
  sponsorshipFlatRate: {
    type: Number,
    default: 0.2,
    min: 0
  }
});

module.exports = mongoose.model('ConfigParam', ConfigParamSchema);
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
    min: 1
  },
  finderMinNum: {
    type: Number,
    default: 1,
    min: 1
  }
}, {
  strict: false
});

module.exports = mongoose.model('ConfigParams', ConfigParamSchema);
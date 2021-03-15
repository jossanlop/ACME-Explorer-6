'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var finderCollectionSchema = new Schema({
    keyWord: {
        type: String,
        default: null
    },
    priceRange: {
        type: Array[String](2),
        default: null
    },
    dateRange:{
        type: Array[Date](2),
        default: null
    }
});

module.exports = mongoose.model('finders', finderCollectionSchema);
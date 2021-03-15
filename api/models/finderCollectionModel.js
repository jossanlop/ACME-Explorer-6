'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var finderSchema =  new Schema({ //Cada búsqueda tendrá: usuario, query de filtro o filtro, resultados y timestamp
    user: {
        type: String,
    },
    keyWord: {
        type: String,
        default: null
    },
    priceRange: {
        type: [Number],
        default: null
    },
    dateRange:{
        type: [Date],
        default: null
    },
    results:{
        type: [String]
    },
    timestamp: {
        type: Date,
        default: Date.now()
    }
});
var finderCollectionSchema = new Schema({
    finders: [finderSchema]
});

module.exports = mongoose.model('FinderCollection', finderCollectionSchema);
'use strict';
var mongoose = require('mongoose');
// Trip = mongoose.model('Trips');

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
        type: [String],
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

// finderSchema.pre('save', function(callback) {
//     var new_finder = this;
//     console.log(new_finder);
//     //compute price
//     if(!isNaN(req.query.minPrice) && !isNaN(req.query.maxPrice)){ //Si tenemos date
//         new_finder.priceRange.push(req.query.minPrice, req.query.maxPrice);
//     }
//     //compute date
//     if(!isNaN(req.query.minDate) && !isNaN(req.query.maxDate)){ //Si tenemos date
//         new_finder.priceDate.push(req.query.minDate, req.query.maxDate);
//     }
//     callback();
//   });

module.exports = mongoose.model('finderSchema', finderSchema);
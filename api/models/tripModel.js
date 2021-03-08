
'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TripSchema = new Schema({
    ticker: {
      type: String,
     unique: true,
     //This validation does not run after middleware pre-save
     validate: {
        validator: function(v) {
            return /\d{4}-\w{4}/.test(v);
        },
        message: 'ticker is not valid!, Pattern("\d(4)-\w(4)")'
      }
    },
    title: {
      type: String,
      required: 'Kindly enter the title of the Trip'
    },
    description: {
      type: String,
      required:'Kindly enter the description of the Trip'
    },
    price: {
        type: Number,
        required: 'Kindly enter the item Trip',
        min: 0
      },
    reuirements: 
    [String],
    start_date: {
        type: Date
    },
    end_date: {
      type: Date
    }
    ,
    picture: {
        data: Buffer,
        contentType: String
    }
  });
  
  module.exports = mongoose.model('Trips', TripSchema);
  

'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema

var TripSchema = new Schema({
    ticker: {
      type: String,
     unique: true,
     //This validation does not run after middleware pre-save
     validate: {
        validator: function(v) {
            return /\d{6}-\w{6}/.test(v);
        },
        message: 'ticker is not valid!, Pattern("\d(6)-\w(6)")'
      }
    },
    title: {
      type: String
    },
    description: {
      type: String
    },
    price: {
      type: String
    },
    reuirements: 
    [String],
    start_date: {
      type: String
    },
    end_date: {
      type: String
    }
    ,
    picture_url: {
      type: String
    }
  });
  
  module.exports = mongoose.model('Trip', TripSchema);
  
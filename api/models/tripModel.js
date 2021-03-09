
'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const dateFormat = require('dateformat');
var en = require("nanoid-good/locale/en"); // you should add locale of your preferred language
var customAlphabet  = require("nanoid-good").customAlphabet(en);

var TripSchema = new Schema({
    ticker: {
      type: String,
     unique: true,
     //This validation does not run after middleware pre-save
     validate: {
        validator: function(v) {
            return /\d{6}-\w{4}/.test(v);
        },
        message: 'ticker is not valid!, Pattern("\d(6)-\w(4)")'
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
        type: Date,
        required: 'Kindly enter the start date of the Trip'
    },
    end_date: {
      type: Date,
      required: 'Kindly enter the end date of the Trip'
    }
    ,
    picture: {
        data: Buffer,
        contentType: String
    }
  });
 
  
  TripSchema.pre('save', function(callback) {
    var new_trip = this;
    var date = new Date;
    var day=dateFormat(date, "yymmdd");
    var generator = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 4);
    var generatedTickerPart = generator();
    var generated_ticker = [day, generatedTickerPart].join('-');
    new_trip.ticker = generated_ticker;
    callback();
  });
  module.exports = mongoose.model('Trips', TripSchema);

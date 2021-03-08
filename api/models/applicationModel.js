'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const generate = require('nanoid/generate');
const dateFormat = require('dateformat');

var ApplicationSchema = new Schema({
  create_date: {
   type: Date,
   required: "Create date required"
/*    validate: {
    validator: function(v) {
        return ;
    },
    message: ''
    } */
  },
  explorer_id: {
    type: Number,
    required: "Explorer_id required"
  },
  trip_id: {
    type: Number,
    required: "Trip_id required"
  },
  Status: {
    type: String,
    required: 'Status required'
  },
  comments: {
    type: String
  }
}, { strict: false });


// Execute before each item.save() call
/* OrderSchema.pre('save', function(callback) {
  var new_order = this;
  var date = new Date;
  var day=dateFormat(new Date(), "yymmdd");

  var generated_ticker = [day, generate('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 6)].join('-')
  new_order.ticker = generated_ticker;
  callback();
}); */


module.exports = mongoose.model('Applications', ApplicationSchema);

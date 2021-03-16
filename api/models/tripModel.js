
'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const dateFormat = require('dateformat');
var en = require("nanoid-good/locale/en"); // you should add locale of your preferred language
var customAlphabet  = require("nanoid-good").customAlphabet(en);


var StageSchema = new Schema({
  title: {
    type: String,
    required: "Stage title required"
  },
  description: [String],
  price:{
    type: Number,
    required: "Stage price required"
  }
})

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
    requirements: 
    [String],
    start_date: {
        type: Date,
        required: 'Kindly enter the start date of the Trip'
    },
    end_date: {
      type: Date,
      required: 'Kindly enter the end date of the Trip',
      validate: [datesValidation, "End-date should be after start date"]
    },  
    stages: [StageSchema],
    picture: {
        data: Buffer,
        contentType: String
    },
    canceled: {
      type: Boolean,
      default: false,
      validate: [cancelValidation, "Should especify the reason why is being cancelled"]
    },
    cancelReason:
    {
      type: String,
      validate: [cancelValidation2, "Reason only required when the trip is canceled"]
    }
  });
 
  function datesValidation(value)
  {
    return this.start_date <= value;
  }

  function datesValidation4Update(end, start)
  {
    if(end <= start)
      return new Error('End-date should be after start date');
  }

  function cancelValidation(value)
  {
    if(value)
      if(!!this.cancelReason)
        return true;

    return false;
  }

  function cancelValidationUpd(value, cancelReason)
  {
    if(value)
      if(!(!!cancelReason))
      {
        return new Error("Should especify the reason why is being cancelled");
      }
    
      if(!value)
      if(!!cancelReason)
      {
        return new Error("Should especify the reason why is being cancelled");
      }
  }
 

  function cancelValidation2(value)
  {
    if(!!value)
      if(!this.canceled)
        return true;

    return false;
  }

  //pre update
  TripSchema.pre('findOneAndUpdate', function(callback) {

    var err=cancelValidationUpd(this.getUpdate().canceled, this.getUpdate().cancelReason);
    if(err)
    {
        err.name='ValidationError';
        return callback(err);
    }
    err=datesValidation4Update(this.getUpdate().end_date, this.getUpdate().start_date);
    if(err){
        err.name='ValidationError';
        return callback(err);
    }
    
    
    
    callback();
    
  });


  TripSchema.pre('save', function(callback) {
    var new_trip = this;
    
    //generate ticker
    var date = new Date;
    var day=dateFormat(date, "yymmdd");
    var generator = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 4);
    var generatedTickerPart = generator();
    var generated_ticker = [day, generatedTickerPart].join('-');
    new_trip.ticker = generated_ticker;
    
    //compute price
    var aux=0;
    new_trip.stages.forEach(stgs => aux+=stgs.price )
    new_trip.price=aux;

    callback();
  });

  module.exports = mongoose.model('Trips', TripSchema);

 


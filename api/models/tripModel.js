
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

var SponsorshipSchema = new Schema({
  sponsor_id: {
    type: Schema.Types.ObjectId,
    required: "Sponsor_id required"
  },
  banner:{
      type:String,
      required: "Banner is required"
  },
  link:{
    type:String,
    required: "Link is required"
  },
  payed:{
    type:String,
    default:false,
    required: "payed is required"
}
}, { strict: false });

module.exports = mongoose.model('Sponsorships', SponsorshipSchema);


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
        min: 0
      },
    requirements: 
    [String],
    start_date: {
        type: Date,
        required: 'Kindly enter the start date of the Trip'
    },
    publish: {
      type: Boolean,
      required: 'Kindly enter if this trip is published'
    },
    end_date: {
      type: Date,
      required: 'Kindly enter the end date of the Trip'
    },  
    stages: [StageSchema],
    sponsorship: [SponsorshipSchema],
    picture: {
        data: Buffer,
        contentType: String
    },
    canceled: {
      type: Boolean,
      default: false    
    },
    cancelReason:
    {
      type: String}
  });
 
  TripSchema.index({title : 'text', description: 'text', ticker: 'text'});

  function datesValidation(end, start)
  {
    if(end <= start)
      return ValidationError('End-date should be after start date');
  }

  function cancelValidation(value, cancelReason)
  {
    if(value)
      if(!(!!cancelReason))
      {
        return new Error("Should especify the reason why is being cancelled");
      }
  
    if(!value)
      if(!!cancelReason)
      {
        return ValidationError("Should especify the reason why is being cancelled");
      }
  }

  function ValidationError(msg)
  {
    var err = new Error();
    err.name='ValidationError';
    err.message=msg;
    return err;
  }

  //pre update
  TripSchema.pre('findOneAndUpdate', function(callback) {
    var err=cancelValidation(this.getUpdate().canceled, this.getUpdate().cancelReason);
    if(err)
    {
        return callback(err);
    }
    err=datesValidation(this.getUpdate().end_date, this.getUpdate().start_date);
    if(err){
        return callback(err);
    }
    
    callback();
    
  });


  TripSchema.pre('save', function(callback) {
    var new_trip = this;
    //generate ticker
    var date = new Date;
    var day=dateFormat(date, "yymmdd");
    var generator = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ', 4);
    var generatedTickerPart = generator();
    var generated_ticker = [day, generatedTickerPart].join('-');
    new_trip.ticker = generated_ticker;
    
    //compute price
    var aux=0;
    new_trip.stages.forEach(stgs => aux+=stgs.price )
    new_trip.price=aux;
    
    var err=cancelValidation(new_trip.canceled, new_trip.cancelReason);
    if(err)
    {
      return callback(err);
    }
    err=datesValidation(new_trip.end_date, new_trip.start_date);
    if(err){
      return callback(err);
    }

    callback();
  });

  module.exports = mongoose.model('Trips', TripSchema);

 


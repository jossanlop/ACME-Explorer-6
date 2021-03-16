'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ApplicationSchema = new Schema({
  create_date: {
   type: Date,
   required: "Create date required",
   default: Date.now
  },
  explorer_id: {
    type: Schema.Types.ObjectId,
    required: "Explorer_id required"
  },
  trip_id: {
    type: Schema.Types.ObjectId,
    required: "Trip_id required"
  },
  manager_id: {
    type: Schema.Types.ObjectId,
    required: "Trip_id required"
  },
  status: {
    type: String,
    required: 'Status required',
    default: 'PENDING',
    enum: ['PENDING','DUE','REJECTED','EXPLORER', 'ACCEPTED', 'CANCELLED']
  },
  comments: [String],
  rejectReason:
  {
    type: String,
    validate: [rejectValidation, 'Should especify the reason of rejection']
  }
}, { strict: false });

function rejectValidation(value)
{
    if(this.status == 'REJECTED')
      return !!value; 

    return true;
}

function rejectValidationUpd(value)
{
    if(this.status == 'REJECTED')
      if(!(!!value)) 
        return new Error("Should especify the reason of rejection");
}

//pre update
ApplicationSchema.pre('findOneAndUpdate', function(callback) {

  var err=rejectValidationUpd(this.getUpdate().rejectReason);
  if(err)
  {
      err.name='ValidationError';
      return callback(err);
  }

  callback();
});


module.exports = mongoose.model('Applications', ApplicationSchema);


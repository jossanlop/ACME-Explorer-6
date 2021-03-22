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
    required: "manager_id required"
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
      if(!(!!value)) 
        return ValidationError("Should especify the reason of rejection");
}

function ValidationError(msg)
  {
    var err = new Error();
    err.name='ValidationError';
    err.message=msg;
    return err;
  }

//pre update
ApplicationSchema.pre('save', function(callback) {
  //Añadir cofigo para asignar un manager 
  var err=rejectValidation(this.rejectReason);
  if(err)
  {
      return callback(err);
  }

  callback();
});


ApplicationSchema.pre('findOneAndUpdate', function(callback) {

  var err=rejectValidation(this.getUpdate().rejectReason);
  if(err)
  {
      return callback(err);
  }

  callback();
});

module.exports = mongoose.model('Applications', ApplicationSchema);


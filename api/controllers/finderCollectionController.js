'use strict';

/*---------------finderCollection----------------------*/
var mongoose = require('mongoose'),
  finderCollection = mongoose.model('finderSchema');

exports.list_all_finders = function(req, res) {
    finderCollection.find({},function(err, list_all_finders) {
        if (err){
          res.status(500).send(err);
        }
        else{
          res.json(list_all_finders);
        }
      });
}

exports.create_a_finder = function(req, res) {
    var new_finder= new finderCollection(req.body);
    new_finder.save(function(err, finder) {
      if (err){
        if(err.name=='ValidationError') {
            res.status(422).send(err);
        }
        else{
          console.log(finder);
          res.status(500).send(err);
        }
      }
      else{
        res.status(200).json(finder);
      }
    });
  };

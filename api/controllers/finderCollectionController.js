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

exports.delete_a_finder = function(req, res) {
  //Check if the user is an MANAGER and if not: res.status(403); "an access token is valid, but requires more privileges"
  finderCollection.deleteOne({keyword: req.params.keyword}, function(err, Finder) {
        if (err){
            res.status(500).send(err);
        }
        else{
            res.json({ message: 'Finder successfully deleted'});
        }
    });
  };

  exports.delete_all_finders = function(req, res) {
    //Check if the user is an MANAGER and if not: res.status(403); "an access token is valid, but requires more privileges"
    finderCollection.deleteMany({}, function(err, Finder) {
          if (err){
              res.status(500).send(err);
          }
          else{
              res.json({ message: 'Finders successfully deleted'});
          }
      });
  };

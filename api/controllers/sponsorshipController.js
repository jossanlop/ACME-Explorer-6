'use strict';

var mongoose = require('mongoose'),
  Sponsorship = mongoose.model('Sponsorships');

//manager/administrator pueden acceder a todas las sponsorships
exports.list_all_sponsorships = function(req, res) {
    Sponsorship.find({}, function(err, sponsorship) {
    if (err){
      res.status(500).send(err);
    }
    else{
      res.json(sponsorship);
    }
  });
};


//mostrar a un explorer todas sus sponsorships
//falta añadir ownership para el explorer
exports.list_my_sponsorships = function(req, res) {
  Sponsorship.find(function(err, sponsorships) {
    if (err){
      res.status(500).send(err);
    }
    else{
      res.json(sponsorships);
    }
  });
};


/* 
exports.search_sponsorships = function(req, res) {
  //check if clerkId param exists
  //check if assigned param exists
  //check if delivered param exists
  //Search depending on params
  console.log('Searching sponsorships depending on params');
  res.send('sponsorships returned from the sponsorships search');
}; */


exports.create_an_sponsorship = function(req, res) {
  //Check that user is a Customer and if not: res.status(403); "an access token is valid, but requires more privileges"
  var new_sponsorship = new Sponsorship(req.body);

  new_sponsorship.save(function(err, sponsorship) {
    if (err){
      if(err.name=='ValidationError') {
          res.status(422).send(err);
      }
      else{
        res.status(500).send(err);
      }
    }
    else{
      res.json(sponsorship);
    }
  });
};


 exports.read_an_sponsorship = function(req, res) {
  Sponsorship.findOne({_id: req.params.sponsorshipId}, function(err, sponsorship) {
    if (err){
      res.status(500).send(err);
    }
    else{
      res.json(sponsorship);
    }
  });
}; 


exports.update_an_sponsorship = function(req, res) {
  //Check if the sponsorship has been previously assigned or not
  //Assign the sponsorship to the proper clerk that is requesting the assigment
  //when updating delivery moment it must be checked the clerk assignment and to check if it is the proper clerk and if not: res.status(403); "an access token is valid, but requires more privileges"
    Sponsorship.findOneAndUpdate({_id: req.params.sponsorshipId}, req.body, {new: true}, function(err, sponsorship) {
          if (err){
            res.status(500).send(err);
          }
          else{
            res.json(sponsorship);
          }
        });
};


exports.delete_an_sponsorship = function(req, res) {
  //Check if the sponsorship were delivered or not and delete it or not accordingly
  //Check if the user is the proper customer that posted the sponsorship and if not: res.status(403); "an access token is valid, but requires more privileges"
  Sponsorship.deleteOne({
    _id: req.params.sponsorshipId
  }, function(err, sponsorship) {
    if (err){
      res.status(500).send(err);
    }
    else{
      res.json({ message: 'Sponsorship successfully deleted' });
    }
  });
};



'use strict';
/*---------------ACTOR----------------------*/
var mongoose = require('mongoose'),
  Actor = mongoose.model('Actors'),
  Trip = mongoose.model('Trips');


exports.list_all_actors = function(req, res) {
    //Check if the role param exist
    var roleName;
    if(req.query.role){
        roleName=req.query.role;
      }
    //Adapt to find the actors with the specified role
    Actor.find({}, function(err, actors) {
        if (err){
          res.status(500).send(err);
        }
        else{
            res.json(actors);
        }
    });
};

/*
 UNAUTHENTICATED: as explorer
 ADMINISTRATOR: create managers
*/
exports.create_an_actor = function(req, res) {
  var new_actor = new Actor(req.body);
  //Check the user for role  
  new_actor.save(function(err, actor) {
    if (err){
      if(err.name=='ValidationError') {
          res.status(422).send(err);
      }
      else{
        res.status(500).send(err);
      }
    }
    else{
      res.json(actor);
    }
  });
};

exports.read_an_actor = function(req, res) {
  Actor.findById(req.params.actorId, function(err, actor) {
    if (err){
      res.status(500).send(err);
    }
    else{
      res.json(actor);
    }
  });
};

/*
  EVERYONE: edit data
*/
exports.update_an_actor = function(req, res) {
    //Check that the user is the proper actor and if not: res.status(403); "an access token is valid, but requires more privileges"
    Actor.findOneAndUpdate({_id: req.params.actorId}, req.body, {new: true}, function(err, actor) {
      if (err){
        if(err.name=='ValidationError') {
            res.status(422).send(err);
        }
        else{
          res.status(500).send(err);
        }
      }
      else{
          res.json(actor);
      }
    });
};

exports.validate_an_actor = function(req, res) {
    //Check that the user is an Administrator and if not: res.status(403); "an access token is valid, but requires more privileges"
    console.log("Validating an actor with id: "+req.params.actorId)
    Actor.findOneAndUpdate({_id: req.params.actorId},  { $set: {"validated": "true" }}, {new: true}, function(err, actor) {
      if (err){
        res.status(500).send(err);
      }
      else{
        res.json(actor);
      }
    });
  };

exports.delete_an_actor = function(req, res) {
    Actor.deleteOne({_id: req.params.actorId}, function(err, actor) {
        if (err){
            res.status(500).send(err);
        }
        else{
            res.json({ message: 'Actor successfully deleted' });
        }
    });
};

exports.finder = function(req, res) {
  // todos los trips son mostrados en caso de que sea null
  if(req.params.tripKey == null){
    res.json(tripController.list_all_trips());
  }
  Trip.findOne({key: req.params.tripKey} , function(err, actor) {
    if (err){
      res.status(500).send(err);
    }
    else{
      res.status(200).json(actor,{ message: 'Actor successfully found' });
    }
  });
};
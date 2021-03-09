'use strict';

var mongoose = require('mongoose'),
  Application = mongoose.model('Applications');

//manager/administrator pueden acceder a todas las applications
exports.list_all_applications = function(req, res) {
    Application.find({}, function(err, application) {
    if (err){
      res.status(500).send(err);
    }
    else{
      res.json(application);
    }
  });
};


//mostrar a un explorer todas sus applications
//falta añadir ownership para el explorer
exports.list_my_applications = function(req, res) {
  Applications.find(function(err, applications) {
    if (err){
      res.status(500).send(err);
    }
    else{
      res.json(applications);
    }
  });
};


/* 
exports.search_applications = function(req, res) {
  //check if clerkId param exists
  //check if assigned param exists
  //check if delivered param exists
  //Search depending on params
  console.log('Searching applications depending on params');
  res.send('applications returned from the applications search');
}; */


exports.create_an_application = function(req, res) {
  //Check that user is a Customer and if not: res.status(403); "an access token is valid, but requires more privileges"
  var new_application = new Application(req.body);

  new_application.save(function(err, application) {
    if (err){
      if(err.name=='ValidationError') {
          res.status(422).send(err);
      }
      else{
        res.status(500).send(err);
      }
    }
    else{
      res.json(application);
    }
  });
};


 exports.read_an_application = function(req, res) {
  Application.findById(req.params.applicationId, function(err, application) {
    if (err){
      res.status(500).send(err);
    }
    else{
      res.json(application);
    }
  });
}; 


exports.update_an_application = function(req, res) {
  //Check if the application has been previously assigned or not
  //Assign the application to the proper clerk that is requesting the assigment
  //when updating delivery moment it must be checked the clerk assignment and to check if it is the proper clerk and if not: res.status(403); "an access token is valid, but requires more privileges"
  Application.findById(req.params.applicationId, function(err, application) {
    if (err){
      if(err.name=='ValidationError') {
          res.status(422).send(err);
      }
      else{
        res.status(500).send(err);
      }
    }
    else{
      Application.findOneAndUpdate({_id: req.params.applicationId}, req.body, {new: true}, function(err, application) {
          if (err){
            res.status(500).send(err);
          }
          else{
            res.json(application);
          }
        });
      }
  });
};


exports.delete_an_application = function(req, res) {
  //Check if the application were delivered or not and delete it or not accordingly
  //Check if the user is the proper customer that posted the application and if not: res.status(403); "an access token is valid, but requires more privileges"
  Application.deleteOne({
    _id: req.params.applicationId
  }, function(err, application) {
    if (err){
      res.status(500).send(err);
    }
    else{
      res.json({ message: 'Application successfully deleted' });
    }
  });
};



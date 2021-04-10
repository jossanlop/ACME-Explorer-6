'use strict';
/*---------------ACTOR----------------------*/
var mongoose = require('mongoose'),
  Actor = mongoose.model('Actors'),
  Trip = mongoose.model('Trips');

var authController = require('../controllers/authController');


const { auth } = require('firebase-admin');
var admin = require('firebase-admin');

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

exports.create_an_actor_v2 = function(req, res) {
  //No se pueden crear administradores
  if(req.body.role=='ADMINISTRATOR'){
    return res.status(422).json({ reason: "Can't create an admin user" });
  }
  //Primero comprobamos si existe un token de un actor ADMINISTRADOR
  const headerToken = req.headers.idtoken;
  console.log('starting verifying idToken');
  var idToken = req.headers['idtoken'];
  console.log('idToken: '+idToken);

  console.log(headerToken);

  if(!headerToken){
    if(req.body.role=="MANAGER"){
      return res.status(403).send("Only admins can create managers");
    }
    var new_actor = new Actor(req.body);
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
  }else {
    admin.auth().verifyIdToken(idToken).then(function(decodedToken) {
      console.log('entra en el then de verifyIdToken: ');

      var uid = decodedToken.uid;
      var auth_time = decodedToken.auth_time;
      var exp =  decodedToken.exp;
      console.log('idToken verificado para el uid: '+uid);
      console.log('auth_time: '+auth_time);
      console.log('exp: '+exp);

      Actor.findOne({ email: uid }, function (err, actor) {
        if (err) {
          res.send(err); 
        }
        else if(!actor.role=='ADMINISTRATOR'){
          return res.status(403).json({reason: "You must be an administrator"});
        }
        else if(!req.body.role=='MANAGER') {
          return res.status(422).json({reason: "New user has to be a Manager"});
        }
        // No actor found with that email as username
        else if (!actor) {
            res.status(401); //an access token isn’t provided, or is invalid
            res.json({message: 'No actor found with the provided email as username' ,error: err});
          }
        else {
            console.log('The actor exists in our DB');
            console.log('actor: '+actor);
            // res.status(200).json(req.body);
          }
        const new_actor = new Actor(req.body);
        new_actor.save(function(err, actor){
          if(err){ 
            res.status(500).json({ reason: "Database error", err: err });
          } 
          else {
            res.status(200).json(actor);
          }
        });
      });
    }).catch(function(err) {
      // Handle error
      console.log ("Error en autenticación: "+err);
      res.status(403); //an access token is valid, but requires more privileges
      res.json({message: 'The actor has not the required roles',error: err});
    });
  }
};

exports.login_an_actor = async function(req, res) {
  console.log('starting login an actor');
  var emailParam = req.body.email;
  var password = req.body.password;
  console.log(req.body);
  Actor.findOne({ email: emailParam }, function (err, actor) {
      if (err) { res.send(err); }

      // No actor found with that email as username
      else if (!actor) {
        res.status(401);
        res.json({message: 'forbidden',error: err});
      }

      else if ((actor.role.includes( 'CLERK' )) && (actor.validated == false)) {
        res.status(403); //an access token is valid, but requires more privileges
        res.json({message: 'forbidden',error: err});
      }
      else{
        // Make sure the password is correct
        //console.log('En actor Controller pass: '+password);
        actor.verifyPassword(password, async function(err, isMatch) {
          if (err) {
            res.send(err);
          }

          // Password did not match
          else if (!isMatch) {
            //res.send(err);
            res.status(401); //an access token isn’t provided, or is invalid
            res.json({message: 'forbidden',error: err});
          }

          else {
              try{
                var customToken = await admin.auth().createCustomToken(actor.email);
              } catch (error){
                console.log("Error creating custom token:", error);
              }
              actor.customToken = customToken;
              console.log('Login Success... sending JSON with custom token');
              res.json(actor);
          }
      });
    }
  });
};

exports.read_an_actor = function(req, res) {
  console.log('Starting to read the actor...');
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
  console.log('Starting to update the actor...');
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

exports.update_a_verified_actor = function(req, res) {
  //Customer and Clerks can update theirselves, administrators can update any actor
  console.log('Starting to update the actor v2...');
  Actor.findById(req.params.actorId, async function(err, actor) {
    if (err){
      res.send(err);
    }
    else{
      console.log(req.headers);
      console.log(actor);
      var idToken = req.headers['idtoken'];//WE NEED the FireBase custom token in the req.header['idToken']... it is created by FireBase!!
      if (actor.role.includes('EXPLORER') || actor.role.includes('MANAGER') || actor.role.includes('SPONSORS')){
        var authenticatedUserId = await authController.getUserId(idToken);
        if (authenticatedUserId == req.params.actorId){
          Actor.findOneAndUpdate({_id: req.params.actorId}, req.body, {new: true}, function(err, actor) {
            if (err){
              res.send(err);
            }
            else{
              console.log(req.headers);
              res.json(actor);
            }
          });
        } else{
          res.status(403); //Auth error
          res.send('The Actor is trying to update an Actor that is not himself!');
        }    
      } else if (actor.role.includes('ADMINISTRATOR')){
          Actor.findOneAndUpdate({_id: req.params.actorId}, req.body, {new: true}, function(err, actor) {
            if (err){
              res.send(err);
            }
            else{
              res.json(actor);
            }
          });
      } else {
        res.status(405); //Not allowed
        res.send('The Actor has unidentified roles');
      }
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
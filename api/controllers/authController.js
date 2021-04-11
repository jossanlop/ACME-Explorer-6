'use strict';
/*---------------ACTOR Auth----------------------*/
var mongoose = require('mongoose'),
  Actor = mongoose.model('Actors');
var admin = require('firebase-admin');

const rp = require('request-promise');


exports.getUserId = async function (idToken) {
  // console.log('idToken: '+idToken);
  var id = null;
  var actorFromFB = await admin.auth().verifyIdToken(idToken);

  var uid = actorFromFB.uid;
  var auth_time = actorFromFB.auth_time;
  var exp = actorFromFB.exp;
  // console.log('idToken verificado para el uid: '+uid);
  // console.log('auth_time: '+auth_time);
  // console.log('exp: '+exp);

  var mongoActor = await Actor.findOne({ email: uid });
  if (!mongoActor) { return null; }

  else {
    // console.log('The actor exists in our DB');
    // console.log('actor: '+mongoActor);
    id = mongoActor._id;
    return id;
  }
}


exports.verifyUser = function (requiredRoles) {
  return function (req, res, callback) {
    // console.log('starting verifying idToken');
    // console.log('requiredRoles: '+requiredRoles);
    var idToken = req.headers['idtoken'];
    // console.log('idToken: '+idToken);

    admin.auth().verifyIdToken(idToken).then(function (decodedToken) {
      var uid = decodedToken.uid;
      var auth_time = decodedToken.auth_time;
      var exp = decodedToken.exp;
      // console.log('idToken verificado para el uid: '+uid);
      // console.log('auth_time: '+auth_time);
      // console.log('exp: '+exp);

      Actor.findOne({ email: uid }, function (err, actor) {
        if (err) { res.send(err); }

        // No actor found with that email as username
        else if (!actor) {
          res.status(401); //an access token isn’t provided, or is invalid
          res.json({ message: 'No actor found with the provided email as username', error: err });
        }

        else {
          // console.log('The actor exists in our DB');
          // console.log('actor: '+actor);

          var isAuth = false;
          for (var i = 0; i < requiredRoles.length; i++) {
            for (var j = 0; j < actor.role.length; j++) {
              if (requiredRoles[i] == actor.role[j]) {
                if (requiredRoles[i] == "CLERK") {
                  if (actor.validated == true) isAuth = true;
                }
                else isAuth = true;
              }
            }
          }
          if (isAuth) return callback(null, actor);
          else {
            res.status(403); //an access token is valid, but requires more privileges
            res.json({ message: 'The actor has not the required roles', error: err });
          }
        }
      });
    }).catch(function (err) {
      // Handle error
      console.log("Error en autenticación: " + err);
      res.status(403); //an access token is valid, but requires more privileges
      res.json({ message: 'The actor has not the required roles', error: err });
    });
  }
}

exports.getIdTokenByCustomToken = async (req, res) => {
  var customToken = req.params.customToken;
  if (!customToken) {
    return res.status(401).json({ "err": "No custom token found" });
  }
  try {
    var idToken = await this.getIdToken(customToken);
    if (!idToken) {
      return res.status(401).json({ "err": "No token found" });
    }
    res.status(200).json({ "idToken": idToken });
  } catch (err) {
    res.status(401).json({ err: err });
  }
}

exports.getIdToken = async customToken => {
  const res = await rp({
    url: `https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyCustomToken?key=AIzaSyB8CbDi9cBW-8O2UNakQ-Wg_HV4-9gN_Z8`,
    method: 'POST',
    body: {
      token: customToken,
      returnSecureToken: true
    },
    json: true,
  });
  return res.idToken;
};
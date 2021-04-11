'use strict';

/*---------------Trip----------------------*/
var mongoose = require('mongoose'),
  Trip = mongoose.model('Trips'),
  Application = mongoose.model('Applications'),
  ConfigParam = require('../models/configParamModel'),
  finderCollection = mongoose.model('finderSchema');
const { app } = require('firebase-admin');
var authController = require('../controllers/authController');

exports.search_list_all_trips = function (req, res) {

  if (JSON.stringify(req.query).length === 2) { //si query vacío
    Trip.find({ publish: true }, function (err, list_all_trips) {
      if (err) {
        res.status(500).send(err);
      }
      else {
        res.json(list_all_trips);
      }
    });
    // Finder for explorers: generar coleccion extra que guarde registros (resultados+timestamps) de busquedas por usuarios (en una ed=coleccion)
    // Guardar query params + resultados 
    // Ventaja: no tener que llamar al find siempre
  } else { //si tienes query params
    if (!isNaN(req.query.minPrice)) {
      req.query.minPrice = parseInt(req.query.minPrice);
    }
    if (!isNaN(req.query.maxPrice)) {
      req.query.maxPrice = parseInt(req.query.maxPrice);
    }
    if (!isNaN(req.query.minDate)) {
      // req.query.minDate = new Date(req.query.minDate);
    }
    if (!isNaN(req.query.maxDate)) {
      // req.query.maxDate = new Date(req.query.maxDate);
    }

    //Guardamos un nuevo finder aquí con los query Params
    //guardar cacheado resultados d eun primera búsqeuda -> mirar requisitos 
    var new_finder = new finderCollection(req.query);
    // new_finder.dateRange.push(req.query.minDate, req.query.maxDate);
    if (!isNaN(req.query.minPrice) && !isNaN(req.query.maxPrice)) {
      new_finder.priceRange.push(req.query.minPrice, req.query.maxPrice);
    }

    if (req.query.minDate && req.query.maxDate) {
      new_finder.dateRange.push(String(req.query.minDate), String(req.query.maxDate));
    }

    Trip.find({
      $and: [
        { publish: true },
        {
          $or: [
            //Si el precio esta en su range
            {
              price:
              {
                $lte: req.query.maxPrice,
                $gte: req.query.minPrice
              }
            },
            //Si el date esta en su range
            {
              start_date:
              {
                $lte: req.query.maxDate,
                $gte: req.query.minDate
              }
            },
            //Si el keyWord está dentro de ticker, title o description
            {
              $or: [
                {
                  ticker:
                  {
                    $regex: `${req.query.keyWord}`,
                    $options: "i"
                  }
                },
                {
                  title:
                  {
                    $regex: `${req.query.keyWord}`,
                    $options: "i"
                  }
                },
                {
                  description:
                  {
                    $regex: `${req.query.keyWord}`,
                    $options: "i"
                  }
                }
              ]
            }
          ]
        }]
    }
      , async function (err, trips) {
        if (err) {
          // console.log("Params: " + JSON.stringify(req.query));
          console.error(err);
          res.status(500).send(err);
        }
        else {
          new_finder.results = trips;
          
          var aux_finderMaxNum = 10;
          const aggregationConfigParam = [
              {$project: {_id:0, finderMaxNum:'$finderMaxNum'}}
          ];
          // TODO: comparar el numero de resultados con el finderMaxNum, si es mayor, cortar los resultados en finderMaxNum
          var confParam = ConfigParam.aggregate(aggregationConfigParam, function (err, configParams) {
            if (err) {
              console.log(err);
            } else if (configParams[0] == null) {
                console.log("No config param stored");
            } else {
              aux_finderMaxNum = configParams[0].finderMaxNum
            }
          });

          if(trips.length > aux_finderMaxNum){
            trips = trips.slice(1,finderMaxNum);
          }
          var idToken = req.headers['idtoken'];
          var authenticatedUserId = await authController.getUserId(idToken);
          new_finder.user = authenticatedUserId;
          new_finder.save(function (err, finder) {
            if (err) {
              console.log("A new finder could not be added: 500");
              console.log(finder);
              // res.status(500).send(err);
              console.log(err);
            }
            else {
              // console.log("Added new finder correctly");
              // console.log(new_finder);
              // res.status(200).json(finder);
            }
          });
          res.status(200).send(trips);
        }
      });
  }
};

exports.create_an_trip = async function (req, res) {
  //Check if the user is a MANAGER and if not: res.status(403); "an access token is valid, but requires more privileges"
  var new_trip = new Trip(req.body);
  var idToken = req.headers['idtoken'];
  var authenticatedUserId = await authController.getUserId(idToken);
  new_trip.manager_id = authenticatedUserId;
  new_trip.save(function (err, trip) {
    if (err) {
      if (err.name == 'ValidationError') {
        res.status(422).send(err);
      }
      else {
        console.log(trip);
        res.status(500).send(err);
      }
    }
    else {
      res.status(200).json(trip);
    }
  });
};

exports.list_all_trips = function (req, res) {
  //Check if Application param exists (Application: req.query.Application)
  //Check if keyword param exists (keyword: `{req.query.keyword}`)
  //Search depending on params but only if deleted = false
    Trip.find({ publish: true }, function (err, list_all_trips) {
      if (err) {
        res.status(500).send(err);
      }
      else {
        res.status(200).json(list_all_trips);
      }
    });
  };

  exports.list_my_trips_v2 = async function (req, res) {
    console.log("d locs");
    var idToken = req.headers['idtoken'];
    var authenticatedUserId = await authController.getUserId(idToken);
    if (String(authenticatedUserId) === String(req.params.manager_id)) {
      Trip.find(req.params, function (err, trips) {
        if (err) {
          res.status(500).send(err);
        }
        else {
          res.send(trips);
        }
      });
    }
    else {
      res.status(405).send("Manager trying to list trips of other manager");
    }
  };

  exports.read_an_trip = function (req, res) {
    Trip.findOne({ ticker: req.params.ticker }, function (err, Trip) {
      if (err) {
        res.status(500).send(err);
      }
      else {
        res.status(200).json(Trip);
      }
    });
  };

  exports.update_an_trip = async function (req, res) {
    //Check that the user is MANAGER if it is updating more things than comments and if not: res.status(403); "an access token is valid, but requires more privileges"
    var idToken = req.headers['idtoken'];
    var authenticatedUserId = await authController.getUserId(idToken);

    Trip.findOne({ ticker: req.params.ticker }, function (err, trip) {
      if (String(authenticatedUserId) === String(trip.manager_id)) {
        if (!trip.publish) {
          Trip.findOneAndUpdate({ ticker: req.params.ticker }, req.body, { new: true, runValidators: true }, function (err, trip2) {
            if (err) {
              if (err.name == 'ValidationError') {
                res.status(422).send(err);
              }
              else {
                res.status(500).send(err);
              }
            }
            else {
              res.json(trip2);
            }
          });
        }
        else {
          res.status("Trying to modify a published trip");
          res.send(403);
        }

      }
      else {
        res.status(405); //Not allowed
        res.send('The user is trying to modify a trip from other manager');
      }
    });

  };

  exports.delete_an_trip = async function (req, res) {
    //Check if the user is an MANAGER and if not: res.status(403); "an access token is valid, but requires more privileges"
    var idToken = req.headers['idtoken'];
    var authenticatedUserId = await authController.getUserId(idToken);
    Trip.findOne({ ticker: req.params.ticker }, function (err, trip) {
      if (String(authenticatedUserId) === String(trip.manager_id)) {
        if (!trip.publish) {
          Trip.deleteOne({ ticker: req.params.ticker }, function (err, trip) {
            if (err) {
              res.status(500).send(err);
            }
            else {
              res.json({ message: 'Trip successfully deleted' });
            }
          });
        }
        else {
          res.status("Trying to delete a published trip")
          res.send(403);
        }
      }
      else {
        res.status(405); //Not allowed
        res.send('The user is trying to deleye a trip from other manager');
      }
    });
  };

  exports.cancel_trip = function (req, res) {
    Trip.findOne({ ticker: req.params.ticker }, async function (err, trip) {
      if (err) {
        res.status(500).send(err);
      }
      else {
        if (trip.publish) {
          if (trip.start_date < Date.now()) {
            var applications = await Application.find({ trip_id: trip._id }, async function (err, apps) {
              if (err) {
                res.status(500).send(err);
              }
              else {
                applications = apps;
              }
            });
            var trip;
            applications.forEach(application => {
              if (application.status == "ACCEPTED") {
                res.status(403).json({ message: "El trip tiene applicaciones aceptadas" });
              }
            });
            trip.cancelled = true;
            Trip.findOneAndUpdate({ _id: trip._id }, trip, function (err, trip) {
              if (err) {
                if (err.name == 'ValidationError') {
                  res.status(422).send(err);
                }
                else {
                  res.status(500).send(err);
                }
              }
              else {
                res.status(200).send(trip);
                console.log("Trip cancelled!");
              }
            });
          } else {
            res.status(403).json({ message: "El trip no ha comenzado" });
          }
        } else {
          res.status(403).json({ message: "El trip no ha sido publicado" });
        }
      }
    });
  };


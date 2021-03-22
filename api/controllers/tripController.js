'use strict';

/*---------------Trip----------------------*/
var mongoose = require('mongoose'),
  // finderCollection = mongoose.model('finderCollectionSchema'),
  Trip = mongoose.model('Trips');



exports.list_all_trips = function(req, res) {

  if (JSON.stringify(req.query).length===2){ //si query vacío
    Trip.find({},function(err, list_all_trips) {
      if (err){
        res.status(500).send(err);
      }
      else{
        res.json(list_all_trips);
      }
    });
  // Finder for explorers: generar coleccion extra que guarde registros (resultados+timestamps) de busquedas por usuarios (en una ed=coleccion)
  // Guardar query params + resultados 
  // Ventaja: no tener que llamar al find siempre
  }else{ //si tienes query params
    if(!isNaN(req.query.minPrice)){
     req.query.minPrice = parseInt(req.query.minPrice);
    }
    if(!isNaN(req.query.maxPrice)){
      req.query.maxPrice = parseInt(req.query.maxPrice);
     }
     if(!isNaN(req.query.minDate)){
      req.query.maxPrice = new Date(req.query.minDate);
     }
     if(!isNaN(req.query.maxDate)){
      req.query.maxPrice = new Date(req.query.maxDate);
     }
     Trip.find( {$or: [
      //Si el precio esta en su range
      {price:
        {
          $lte: req.query.maxPrice,
          $gte: req.query.minPrice
        }
      },
      //Si el date esta en su range
      {start_date:
        {
          $lte: req.query.maxDate,
          $gte: req.query.minDate
        }
      },
      //Si el keyWord está dentro de ticker, title o description
      {$or: [
        { ticker: 
          { 
            $regex: `${req.query.keyWord}`, 
            $options: "i" 
          }
        },
        { title:
          { 
            $regex: `${req.query.keyWord}`,
            $options: "i" 
          }
        },
        { description:
          { 
            $regex: `${req.query.keyWord}`, 
            $options: "i" 
          }
        }
      ]}
      ]
    }
  ,function(err, trip) {
    if (err){
      console.log("Params: "+JSON.stringify(req.query));
      console.error(err);
      res.status(500).send(err);
    }
    else{
      console.log("Trips successfully found");
      console.log(trip);
      res.status(200).send(trip);
    }
  });
  }
};

exports.create_an_trip = function(req, res) {
  //Check if the user is an administrator and if not: res.status(403); "an access token is valid, but requires more privileges"
  var new_trip = new Trip(req.body);
  new_trip.save(function(err, trip) {
    if (err){
      if(err.name=='ValidationError') {
          res.status(422).send(err);
      }
      else{
        console.log(trip);
        res.status(500).send(err);
      }
    }
    else{
      res.status(200).json(trip);
    }
  });
};

exports.search_list_all_trips = function(req, res) {
  //Check if Application param exists (Application: req.query.Application)
  //Check if keyword param exists (keyword: `{req.query.keyword}`)
  //Search depending on params but only if deleted = false
  console.log('Searching an Trip depending on params');
  res.send('Trip returned from the Trip search');
};

exports.read_an_trip = function(req, res) {
    console.log(req.params.tripId);
    Trip.findOne({ticker:req.params.tripId}, function(err, Trip) {
      if (err){
        res.status(500).send(err);
      }
      else{
        res.status(200).json(Trip);
      }
    });
};

exports.update_an_trip = function(req, res) {
  //Check that the user is administrator if it is updating more things than comments and if not: res.status(403); "an access token is valid, but requires more privileges"
    Trip.findOneAndUpdate({ticker: req.params.tripId}, req.body, {new: true, runValidators:true }, function(err, Trip) {
      if (err){
        if(err.name=='ValidationError') {
            res.status(422).send(err);
        }
        else{
          res.status(500).send(err);
        }
      }
      else{
        res.json(Trip);
      }
    });
};

exports.delete_an_trip = function(req, res) {
  //Check if the user is an administrator and if not: res.status(403); "an access token is valid, but requires more privileges"
  Trip.deleteOne({ticker: req.params.tripId}, function(err, Trip) {
        if (err){
            res.status(500).send(err);
        }
        else{
            res.json({ message: 'Trip successfully deleted'});
        }
    });
};


/*---------------Application----------------------*/
// var mongoose = require('mongoose'),
// Application = mongoose.model('Applications');

// exports.list_all_Applications = function(req, res) {
//   Application.find({}, function(err, apps) {
//     if (err){
//       res.status(500).send(err);
//     }
//     else{
//       res.json(apps);
//     }
//   });
// };

// exports.create_a_Application = function(req, res) {
//   var new_app = new Application(req.body);
//   new_app.save(function(err, app) {
//     if (err){
//       if(err.name=='ValidationError') {
//           res.status(422).send(err);
//       }
//       else{
//         res.status(500).send(err);
//       }
//     }
//     else{
//       res.json(categ);
//     }
//   });
// };


// exports.read_a_Application = function(req, res) {
//   Application.findById(req.params.categId, function(err, categ) {
//     if (err){
//       res.status(500).send(err);
//     }
//     else{
//       res.json(categ);
//     }
//   });
// };

// exports.update_a_Application = function(req, res) {
//   Application.findOneAndUpdate({_id: req.params.categId}, req.body, {new: true}, function(err, categ) {
//     if (err){
//       if(err.name=='ValidationError') {
//         res.status(422).send(err);
//       }
//       else{
//         res.status(500).send(err);
//       }
//     }
//     else{
//       res.json(categ);
//   }
//   });
// };

// exports.delete_a_Application = function(req, res) {
//   Application.deleteOne({_id: req.params.categId}, function(err, categ) {
//     if (err){
//       res.status(500).send(err);
//     }
//     else{
//       res.json({ message: 'Application successfully deleted' });
//     }
//   });
// };
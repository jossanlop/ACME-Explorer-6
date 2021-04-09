'use strict';

/*---------------Trip----------------------*/
var mongoose = require('mongoose'),
  Trip = mongoose.model('Trips'),
  finderCollection = mongoose.model('finderSchema');

var authController = require('../controllers/authController');

exports.list_all_trips = async function(req, res) {
  console.log("New search of trips!...");
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

    //guardar cacheado resultados d eun primera búsqeuda -> mirar requisitos
  var idToken = req.headers['idtoken'];
  var authenticatedUserId = await authController.getUserId(idToken);
  console.log("ID: "+authenticatedUserId);
  console.log(req.query);
  var new_finder= new finderCollection(req.query);

  // console.log("\nQuery:"+JSON.stringify(req.query)+"\n");

  if(!isNaN(req.query.minPrice)&&!isNaN(req.query.maxPrice)){
    new_finder.priceRange.push(req.query.minPrice, req.query.maxPrice);
  }
  if(req.query.minDate&&req.query.maxDate){
    new_finder.dateRange.push(String(req.query.minDate), String(req.query.maxDate));
  }
  new_finder.user=authenticatedUserId;
  console.log(new_finder);

  //Guardamos la búsqueda realizada por el actor
  new_finder.save(function(err, finder){
    if (err){
        console.log("A new finder could not be added: 500");
        console.log(finder);
        // res.status(500).send(err);
        console.log(err);
    }
    else{
      // console.log("Added new finder correctly");
      // console.log(new_finder);
      // res.status(200).json(finder);
    }
  });
    //Resultados de búsqueda:
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
      // console.log("Trips successfully found");
      // console.log(trip);
      res.status(200).send(trip);
    }
  });
  }
};

exports.create_an_trip = function(req, res) {
  //Check if the user is a MANAGER and if not: res.status(403); "an access token is valid, but requires more privileges"
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
  if (JSON.stringify(req.query).length===2){ //si query vacío
    if(!isNaN(req.query.minPrice)){
      req.query.minPrice = parseInt(req.query.minPrice);
     }
     if(!isNaN(req.query.maxPrice)){
       req.query.maxPrice = parseInt(req.query.maxPrice);
      }
      if(!isNaN(req.query.minDate)){
       // req.query.minDate = new Date(req.query.minDate);
      }
      if(!isNaN(req.query.maxDate)){
       // req.query.maxDate = new Date(req.query.maxDate);
      }
 
     //Guardamos un nuevo finder aquí con los query Params
     //guardar cacheado resultados d eun primera búsqeuda -> mirar requisitos 
   var new_finder= new finderCollection(req.query);
   if(!isNaN(req.query.minPrice)&&!isNaN(req.query.maxPrice)){
     new_finder.priceRange.push(req.query.minPrice, req.query.maxPrice);
   }

   if(req.query.minDate&&req.query.maxDate){
     new_finder.dateRange.push(String(req.query.minDate), String(req.query.maxDate));
   }
   new_finder.save(function(err, finder){
     if (err){
         console.log("A new finder could not be added: 500");
         console.log(finder);
         //res.status(500).send(err);
         console.log(err);
     }
     else{
       console.log("Added new finder correctly");
       console.log(new_finder);
       //res.status(200).json(finder);
     }
   });
 
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
       // console.log("Trips successfully found");
       // console.log(trip);
       res.status(200).send(trip);
     }
   });
   }else{
      console.log("No results found in the search");
      res.status(204);
   }
};

exports.read_an_trip = function(req, res) {
    // console.log(req.params.tripId);
    Trip.findOne({ticker:req.params.ticker}, function(err, Trip) {
      if (err){
        res.status(500).send(err);
      }
      else{
        res.status(200).json(Trip);
      }
    });
};

exports.update_an_trip = function(req, res) {
  //Check that the user is MANAGER if it is updating more things than comments and if not: res.status(403); "an access token is valid, but requires more privileges"
  console.log(req.params);
  Trip.findOneAndUpdate({ticker: req.params.ticker}, req.body, {new: true, runValidators:true }, function(err, Trip) {
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
  //Check if the user is an MANAGER and if not: res.status(403); "an access token is valid, but requires more privileges"
  Trip.deleteOne({ticker: req.params.ticker}, function(err, Trip) {
        if (err){
            res.status(500).send(err);
        }
        else{
            res.json({ message: 'Trip successfully deleted'});
        }
    });
};
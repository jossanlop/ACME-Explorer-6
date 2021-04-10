'use strict';

/*---------------Trip----------------------*/
var mongoose = require('mongoose'),
  Trip = mongoose.model('Trips'),
  finderCollection = mongoose.model('finderSchema');
  var authController = require('../controllers/authController');

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
      // req.query.minDate = new Date(req.query.minDate);
     }
     if(!isNaN(req.query.maxDate)){
      // req.query.maxDate = new Date(req.query.maxDate);
     }

    //Guardamos un nuevo finder aquí con los query Params
    //guardar cacheado resultados d eun primera búsqeuda -> mirar requisitos 
  var new_finder= new finderCollection(req.query);
  // console.log("\nQuery:"+JSON.stringify(req.query)+"\n");
  // new_finder.dateRange.push(req.query.minDate, req.query.maxDate);
  if(!isNaN(req.query.minPrice)&&!isNaN(req.query.maxPrice)){
    // console.log("hay prices");
    new_finder.priceRange.push(req.query.minPrice, req.query.maxPrice);
    // console.log(new_finder);
  }
  // console.log(req.query.minDate);
  // console.log(req.query.minDate);
  if(req.query.minDate&&req.query.maxDate){
    // console.log("hay dates");
    // new_finder.dateRange.push(4);
    new_finder.dateRange.push(String(req.query.minDate), String(req.query.maxDate));
    // console.log(new_finder);
  }
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

exports.create_an_trip = async function(req, res) {
  //Check if the user is a MANAGER and if not: res.status(403); "an access token is valid, but requires more privileges"
  var new_trip = new Trip(req.body);
  var idToken = req.headers['idtoken'];
  var authenticatedUserId = await authController.getUserId(idToken);
  new_trip.manager_id=authenticatedUserId;
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

exports.list_my_trips_v2 = async function(req, res)
{
  console.log('por qui');
  console.log(req.params.manager_id);
  var idToken = req.headers['idtoken'];
  var authenticatedUserId = await authController.getUserId(idToken);
  if(String(authenticatedUserId) === String(req.params.manager_id))
  {
    Trip.find(req.params, function(err, trips)
    {
      if(err)
      {
        res.status(500).send(err);
      }
      else
      {
        res.send(trips);
      }
    });
  }
  else{
    res.status(405).send("Manager trying to list trips of other manager");
  }
};

exports.read_an_trip = function(req, res) {
    // console.log(req.params.tripId);
    Trip.findOne({ticker:req.params.tripId}, function(err, Trip) {
      if (err){
        res.status(500).send(err);
      }
      else{
        res.status(200).json(Trip);
      }
    });
};

exports.update_an_trip =async function(req, res) {
  //Check that the user is MANAGER if it is updating more things than comments and if not: res.status(403); "an access token is valid, but requires more privileges"
  var idToken = req.headers['idtoken'];
  var authenticatedUserId = await authController.getUserId(idToken);
  
  Trip.findOne({ticker: req.params.ticker}, function(err, trip) {
    if(String(authenticatedUserId) === String(trip.manager_id) )
    {
      if(!trip.publish)
      {
        Trip.findOneAndUpdate({ticker: req.params.ticker}, req.body, {new: true, runValidators:true }, function(err, trip2) {
          if (err){
            if(err.name=='ValidationError') {
                res.status(422).send(err);
            }
            else{
              res.status(500).send(err);
            }
          }
          else{
                res.json(trip2);
          }
        });
      }
      else
      {
        res.status("Trying to modify a published trip");
        res.send(403); 
      }
      
    }
    else
    {
      res.status(405); //Not allowed
      res.send('The user is trying to modify a trip from other manager'); 
    }
  });
    
};

exports.delete_an_trip = async function(req, res) {
  //Check if the user is an MANAGER and if not: res.status(403); "an access token is valid, but requires more privileges"
  var idToken = req.headers['idtoken'];
  var authenticatedUserId = await authController.getUserId(idToken);
  console.log(req.params.ticker);
  Trip.findOne({ticker: req.params.ticker}, function(err, trip) {
    console.log(trip);
    if(String(authenticatedUserId) === String(trip.manager_id) )
    {
      if(!trip.publish)
      {
        Trip.deleteOne({ticker: req.params.ticker}, function(err, trip) {
        if (err){
            res.status(500).send(err);
        }
        else{
            res.json({ message: 'Trip successfully deleted'});
        }});}
        else
          {
            res.status("Trying to delete a published trip")
            res.send(403); 

          }}
          else
          {
            res.status(405); //Not allowed
            res.send('The user is trying to deleye a trip from other manager'); 
          }
    });
};

// Utils


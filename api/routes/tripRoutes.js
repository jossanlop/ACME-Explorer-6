'use strict';
module.exports = function(app) {
  var trips = require('../controllers/tripController');
  var authController = require('../controllers/authController');

  /**
   * Get an trip who is clerk (any role)
   *    Required role: Administrator
   * Post an trip 
   *    RequiredRoles: None
   *    validated if customer and not validated if clerk
	 *
	 * @section trips
	 * @type get post
	 * @url /v1/trips
  */
  app.route('/v1/trips')
	  .get(trips.list_all_trips)
    .get(trips.search_list_all_trips)
	  .post(trips.create_an_trip);

  /**
   * Get a trip
   * Post a trip 
   *    RequiredRoles: MANAGER
	 *
	 * @section trips
	 * @type get post
	 * @url /v2/trips
  */
  app.route('/v2/trips')
  .get(trips.list_all_trips)
  .post(authController.verifyUser(["MANAGER"]), trips.create_an_trip)
  .delete(authController.verifyUser(["MANAGER"]), trips.delete_an_trip)
  .put(authController.verifyUser(["MANAGER"]), trips.update_an_trip);

  /**
   * Put an trip
   *    RequiredRoles: to be the proper trip
   * Get an trip
   *    RequiredRoles: to be the proper trip or an Administrator
	 *
	 * @section trips
	 * @type get put delete
	 * @url /v1/trips/:tripId
  */  
  app.route('/v1/trips/:tripId')
    .get(trips.read_an_trip)
	  .put(trips.update_an_trip)
    .delete(trips.delete_an_trip);

  /**
   * Put an trip
   *    RequiredRoles: to be a MANAGER
   * Get a trip
   *    RequiredRoles: no required roles
	 * Delete a trip
   *    RequiredRoles: to be a MANAGER
	 * @section trips
	 * @type get put delete
	 * @url /v2/trips/:tripId
  */  
   app.route('/v2/trips/:ticker')
   .get(trips.read_an_trip)
   .put(authController.verifyUser(["MANAGER"]), trips.update_an_trip)
   .delete(authController.verifyUser(["MANAGER"]), trips.delete_an_trip);

}

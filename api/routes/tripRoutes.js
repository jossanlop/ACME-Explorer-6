'use strict';
module.exports = function (app) {
  var trips = require('../controllers/tripController');
  var authController = require('../controllers/authController');

  /**
   * @typedef Trip
    * @property {string} ticker               - Unique identifier for this configuration parameter
    * @property {string} title  - Period that the finder is kept in cache for all users
    * @property {string} description  - Period that the finder is kept in cache for all users
    * @property {integer} price  - Period that the finder is kept in cache for all users
    * @property {Array.<integer>} requirements  - Period that the finder is kept in cache for all users
    * @property {Date} start_date  - Period that the finder is kept in cache for all users
    * @property {Boolean} publish  - Period that the finder is kept in cache for all users
    * @property {Date} end_date  - Period that the finder is kept in cache for all users
    * @property {Stage.model} stages  - Period that the finder is kept in cache for all users
  
    * @property {Array.<integer>} priceRange  - Period that the finder is kept in cache for all users
    * @property {Array.<string>} dateRange  - Period that the finder is kept in cache for all users
    * @property {Array.<string>} results  - Period that the finder is kept in cache for all users
    * @property {Date} timestamp  - Period that the finder is kept in cache for all users
    */

  /**
   * @typedef Stage
   * @property {string} title               - Unique identifier for this configuration parameter
   * @property {Array.<string>} description - Unique identifier for this configuration parameter
   * @property {integer} price               - Unique identifier for this configuration parameter
   */

  /**
 * @typedef Sponsorship
 * @property {ObjectId} sponsor_id               - Unique identifier for this configuration parameter
 * @property {string} banner - Unique identifier for this configuration parameter
 * @property {string} link               - Unique identifier for this configuration parameter
 * @property {string} payed               - Unique identifier for this configuration parameter
  */

  /**
   * Get the Trips
   * @route GET /trips
   * @group Trip - System configuration parameters
   * @returns {string}                                  200 - Returns the configParam identifier
   * @returns {ValidationError}                         400 - Supplied parameters are invalid
   * @returns {UserAuthError}                           401 - User is not authorized to perform this operation
   * @returns {DatabaseError}                           500 - Database error
   */

    /**
   * Post a Trips
   * @route POST /trips
   * @group Trip - System configuration parameters
   * @returns {Trip.model}                                  200 - Returns the configParam identifier
   * @returns {ValidationError}                         400 - Supplied parameters are invalid
   * @returns {UserAuthError}                           401 - User is not authorized to perform this operation
   * @returns {DatabaseError}                           500 - Database error
   */
  app.route('/v2/trips')
    .get(trips.list_all_trips)
    .post(authController.verifyUser(["MANAGER"]), trips.create_an_trip);


  /**
   * Get a Trip
   * @route GET /trips/:ticker
   * @group Trip - System configuration parameters
   * @returns {Trip.model}                                  200 - Returns the configParam identifier
   * @returns {ValidationError}                         400 - Supplied parameters are invalid
   * @returns {UserAuthError}                           401 - User is not authorized to perform this operation
   * @returns {DatabaseError}                           500 - Database error
   */

  /**
   * Put a Trip
   * @route PUT /trips/:ticker
   * @group Trip - System configuration parameters
   * @param {string} ticker
   * @param {Trip.Model} trip.body.required 
   * @returns {Trip.model}                                  200 - Returns the configParam identifier
   * @returns {ValidationError}                         400 - Supplied parameters are invalid
   * @returns {UserAuthError}                           401 - User is not authorized to perform this operation
   * @returns {DatabaseError}                           500 - Database error
   */

    /**
   * Delete a Trip
   * @route DELETE /trips/:ticker
   * @group Trip - System configuration parameters
   * @param {string} ticker
   * @returns {ValidationError}                         400 - Supplied parameters are invalid
   * @returns {UserAuthError}                           401 - User is not authorized to perform this operation
   * @returns {DatabaseError}                           500 - Database error
   */
    app.route('/v2/trips/:ticker')
    .get(trips.read_an_trip) //SOLO EXPLORER Y MANAGER???
    .put(authController.verifyUser(["MANAGER"]), trips.update_an_trip)
    .delete(authController.verifyUser(["MANAGER"]), trips.delete_an_trip);

  /**
   * Get all Trips from Manager
   * @route GET /trips/:manager_id
   * @group Trip - System configuration parameters
   * @param {String} manager_id
   * @returns {string}                                  200 - Returns the configParam identifier
   * @returns {ValidationError}                         400 - Supplied parameters are invalid
   * @returns {UserAuthError}                           401 - User is not authorized to perform this operation
   * @returns {DatabaseError}                           500 - Database error
   */
  app.route('/v2/trips/manager/:manager_id')
    .get(authController.verifyUser(["MANAGER"]), trips.list_my_trips_v2);

  /**
   * Put an trip
   *    RequiredRoles: to be the proper trip
   * Get an tripey
   *    RequiredRoles: to be the proper trip or an Administrator
   *
   * @section trips
   * @type get put delete
   * @url /v1/trips/:tripId
  */
  // app.route('/v1/trips/:tripId')
  //   .get(trips.read_an_trip)
  //   .put(trips.update_an_trip)
  //   .delete(trips.delete_an_trip);


}

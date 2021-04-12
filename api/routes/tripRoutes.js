'use strict';
module.exports = function (app) {
  var trips = require('../controllers/tripController');
  var authController = require('../controllers/authController');

  /**
   * @typedef Trip
    * @property {string} ticker               - Unique identifier for this trip
    * @property {string} title  - Title of the trip
    * @property {string} description  - Description of the trip
    * @property {integer} price  - Price of the trip
    * @property {Array.<integer>} requirements  - List of the requirements that implies the trip
    * @property {string} start_date  - Date when trip starts
    * @property {Boolean} publish  - Boolean that indicates if the trip is published or not
    * @property {Boolean} cancelled  - Boolean that indicates if the trip is cancelled or not
    * @property {string} end_date  - Date when trip ends
    * @property {Array.<string>} picture  - List of pictures of the trip
    * @property {string} cancelReason  - Date when trip ends
    * @property {integer} manager_id  - Manager that organise the trip
    * @property {Stage.model} stages  - Stages that compounds the trip
    * @property {Array.<Sponsorship.model>} sponsorship  - Sponsorships associated with the trip
  */

  /**
   * @typedef Stage
   * @property {string} title               - Title of the stage
   * @property {string} description - Description of the stage
   * @property {integer} price               - Price of the stage
   */

  /**
 * @typedef Sponsorship
 * @property {ObjectId} sponsor_id               - Unique identifier for this sponsorship
 * @property {string} banner - String that corresponds with the sponsorship banner
 * @property {string} link               - Link to the page sponsored
 * @property {Boolean} payed               - Boolean that indicates if the sponsorship is payed
  */

  /**
   * Get the Trips
   * @route GET /trips
   * @group Trip - System trips
   * @returns {string}                                  200 - Returns the trip
   * @returns {ValidationError}                         400 - Supplied parameters are invalid
   * @returns {UserAuthError}                           401 - User is not authorized to perform this operation
   * @returns {DatabaseError}                           500 - Database error
   * @security bearerAuth
   */

  /**
 * Post a Trips
 * @route POST /trips
 * @group Trip - System trips
 * @returns {Trip.model}                                  200 - Returns the trip
 * @returns {ValidationError}                         400 - Supplied parameters are invalid
 * @returns {UserAuthError}                           401 - User is not authorized to perform this operation
 * @returns {DatabaseError}                           500 - Database error
 * @security bearerAuth
 */
  app.route('/v2/trips')
    .get(trips.list_all_trips)
    .post(authController.verifyUser(["MANAGER"]), trips.create_an_trip);

  /**
  * Search in trips
  * @route GET /trips/finder
  * @group Trip - System trips
  * @returns {string}                                  200 - Returns the trip
  * @returns {ValidationError}                         400 - Supplied parameters are invalid
  * @returns {UserAuthError}                           401 - User is not authorized to perform this operation
  * @returns {DatabaseError}                           500 - Database error
  * @security bearerAuth
  */
  app.route('/v2/trips/finder')
    .get(authController.verifyUser(["EXPLORER"]), trips.search_list_all_trips);


  /**
   * Get a Trip
   * @route GET /trips/:ticker
   * @group Trip - System trips
   * @returns {Trip.model}                                  200 - Returns the trip
   * @returns {ValidationError}                         400 - Supplied parameters are invalid
   * @returns {UserAuthError}                           401 - User is not authorized to perform this operation
   * @returns {DatabaseError}                           500 - Database error
   * @security bearerAuth
   */

  /**
   * Put a Trip
   * @route PUT /trips/:ticker
   * @group Trip - System trips
   * @param {string} ticker
   * @param {Trip.Model} trip.body.required 
   * @returns {Trip.model}                                  200 - Returns the trip
   * @returns {ValidationError}                         400 - Supplied parameters are invalid
   * @returns {UserAuthError}                           401 - User is not authorized to perform this operation
   * @returns {DatabaseError}                           500 - Database error
   * @security bearerAuth
   */

  /**
 * Delete a Trip
 * @route DELETE /trips/:ticker
 * @group Trip - System trips
 * @param {string} ticker
 * @returns {ValidationError}                         400 - Supplied parameters are invalid
 * @returns {UserAuthError}                           401 - User is not authorized to perform this operation
 * @returns {DatabaseError}                           500 - Database error
 * @security bearerAuth
 */
  app.route('/v2/trips/:ticker')
    .get(trips.read_an_trip) //SOLO EXPLORER Y MANAGER???
    .put(authController.verifyUser(["MANAGER"]), trips.update_an_trip)
    .delete(authController.verifyUser(["MANAGER"]), trips.delete_an_trip);

  /**
   * Get all Trips from Manager
   * @route GET /trips/:manager_id
   * @group Trip - System trips
   * @param {String} manager_id
   * @returns {string}                                  200 - Returns the trip
   * @returns {ValidationError}                         400 - Supplied parameters are invalid
   * @returns {UserAuthError}                           401 - User is not authorized to perform this operation
   * @returns {DatabaseError}                           500 - Database error
   * @security bearerAuth
   */
  app.route('/v2/trips/manager/:manager_id')
    .get(authController.verifyUser(["MANAGER"]), trips.list_my_trips_v2);

  /**
   * Cancel a Trips published but not started and without applications
   * @route PUT /trips/cancel/:ticker
   * @group Trip - System trips
   * @param {String} ticker
   * @returns {string}                                  200 - Returns the trip
   * @returns {ValidationError}                         400 - Supplied parameters are invalid
   * @returns {UserAuthError}                           401 - User is not authorized to perform this operation
   * @returns {DatabaseError}                           500 - Database error
   * @security bearerAuth
   */
  app.route('/v2/trips/cancel/:ticker')
    .put(authController.verifyUser(["MANAGER"]), trips.cancel_trip);

}

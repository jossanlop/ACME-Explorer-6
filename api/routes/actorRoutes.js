'use strict';
module.exports = function (app) {
	var trips = require('../controllers/tripController');
	var actors = require('../controllers/actorController');
	var authController = require('../controllers/authController');

	/**
	 * @typedef Actor
		* @property {string} name               - Unique identifier for this configuration parameter
		* @property {string} surname  - Period that the finder is kept in cache for all users
	  * @property {string} email  - Period that the finder is kept in cache for all users
	  * @property {string} password  - Period that the finder is kept in cache for all users
	  * @property {string} preferredLanguage  - Period that the finder is kept in cache for all users
		* @property {string} phone  - Period that the finder is kept in cache for all users
	  * @property {string} address  - Period that the finder is kept in cache for all users
	  * @property {Array.<string>} role  - Period that the finder is kept in cache for all users
	  */

	/**
	 * Get the Actors
	 * @route GET /actors
	 * @group Actor - System configuration parameters
	 * @returns {string}                                  200 - Returns the configParam identifier
	 * @returns {ValidationError}                         400 - Supplied parameters are invalid
	 * @returns {UserAuthError}                           401 - User is not authorized to perform this operation
	 * @returns {DatabaseError}                           500 - Database error
	 */

	app.route('/v2/actors')
		.get(actors.list_all_actors);

	/**
	 * Gets a trip defined by a key word, start & end date and min & max price
	 * If null => return all trips
	 */
	app.route('/v1/actors/search/')
		.get(trips.list_all_trips);

	/**
* Get an Actor from id
* @route GET /actor/:actorId
* @group Actor - System configuration parameters
* @returns {Actor}                                 200 - Returns the configParam identifier
* @returns {ValidationError}                         400 - Supplied parameters are invalid
* @returns {UserAuthError}                           401 - User is not authorized to perform this operation
* @returns {DatabaseError}                           500 - Database error
*/
	/**
	 * Put an Actor from id
	 * @route PUT /actor/:actorId
	 * @group Actor - System configuration parameters
     * @param {Actor.Model} actor.body.required 
     * @returns {Actor}                                 200 - Returns the configParam identifier
	 * @returns {ValidationError}                         400 - Supplied parameters are invalid
	 * @returns {UserAuthError}                           401 - User is not authorized to perform this operation
	 * @returns {DatabaseError}                           500 - Database error
	 */
	app.route('/v2/actors/:actorId')
		.get(actors.read_an_actor)
		.put(authController.verifyUser(["ADMINISTRATOR",
			"EXPLORER",
			"MANAGER", "SPONSOR"]), actors.update_a_verified_actor);

	app.route('/v2/actors-ban/:actorId')
	.put(authController.verifyUser(["ADMINISTRATOR"]), actors.ban_an_actor);	
	app.route('/v2/actors-unban/:actorId')
	.put(authController.verifyUser(["ADMINISTRATOR"]), actors.unban_an_actor);	
	/**
 * Post an Actor
 * @route POST /actor/
 * @group Actor - System configuration parameters
* @param {Actor.Model} actor.body.required 
* @returns {Actor}                                 200 - Returns the configParam identifier
 * @returns {ValidationError}                         400 - Supplied parameters are invalid
 * @returns {UserAuthError}                           401 - User is not authorized to perform this operation
 * @returns {DatabaseError}                           500 - Database error
 */
	app.route('/v2/actors/')
		.post(actors.create_an_actor_v2);


	/**
	   * Put an Actor validation
	   * @route PUT /actor/:actorId/validate
	   * @group Actor - System configuration parameters
	   * @param {Actor.Model} actor.body.required 
	   * @returns {Actor}                                 200 - Returns the configParam identifier
	   * @returns {ValidationError}                         400 - Supplied parameters are invalid
	   * @returns {UserAuthError}                           401 - User is not authorized to perform this operation
	   * @returns {DatabaseError}                           500 - Database error
	   */
	app.route('/v1/actors/:actorId/validate')
		.put(actors.validate_an_actor)
};
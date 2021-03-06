'use strict';
module.exports = function (app) {
	var trips = require('../controllers/tripController');
	var actors = require('../controllers/actorController');
	var authController = require('../controllers/authController');

	/**
	 * @typedef Actor
	 * @property {string} name               - Name of the actor
	 * @property {string} surname  - Surname of the actor
	 * @property {string} email  - Email of the actor
	 * @property {string} password  - Password of the actor
	 * @property {string} preferredLanguage  - Preferred language of the actor for the system
	 * @property {string} phone  - Phone of the actor (optional)
	 * @property {string} address  - Address of the actor (optional)
	 * @property {Array.<string>} role  - Role of the actor
	 */

	/**
	 * Get the Actors
	 * @route GET /actors
	 * @group Actor - System actors
	 * @returns {string}                                  200 - Returns the actor
	 * @returns {ValidationError}                         400 - Supplied parameters are invalid
	 * @returns {UserAuthError}                           401 - User is not authorized to perform this operation
	 * @returns {DatabaseError}                           500 - Database error
	 */

	app.route('/v2/actors')
		.get(authController.verifyUser(["ADMINISTRATOR"]), actors.list_all_actors);

	/**
	 * Gets a trip defined by a key word, start & end date and min & max price
	 * If null => return all trips
	 */
	app.route('/v1/actors/search/')
		.get(trips.list_all_trips);

	/**
	 * Get an Actor from id
	 * @route GET /actors/{actorId}
	 * @group Actor - System actors
	 * @param {String} actorId.path
	 * @returns {Actor.model}                         200 - Returns the actor
	 * @returns {ValidationError}                         400 - Supplied parameters are invalid
	 * @returns {UserAuthError}                           401 - User is not authorized to perform this operation
	 * @returns {DatabaseError}                           500 - Database error
	 */
	 app.route('/v2/actors/:actorId')
	 .get(actors.read_an_actor);
	/**
	 * Put an Actor from id
	 * @route PUT /actors/
	 * @group Actor - System actors
	 * @param {Actor.model} actor.body.required 
	 * @returns {Actor}                                 200 - Returns the actor
	 * @returns {ValidationError}                         400 - Supplied parameters are invalid
	 * @returns {UserAuthError}                           401 - User is not authorized to perform this operation
	 * @returns {DatabaseError}                           500 - Database error
	 */
	app.route('/v2/actors/')
		.put(authController.verifyUser(["ADMINISTRATOR",
			"EXPLORER",
			"MANAGER", "SPONSOR"
		]), actors.update_a_verified_actor);

	app.route('/v2/actors-ban/:actorId')
		.put(authController.verifyUser(["ADMINISTRATOR"]), actors.ban_an_actor);
	app.route('/v2/actors-unban/:actorId')
		.put(authController.verifyUser(["ADMINISTRATOR"]), actors.unban_an_actor);
	/**
	 * Post an Actor
	 * @route POST /actors/
	 * @group Actor - System actors
	 * @param {Actor.model} actor.body.required 
	 * @returns {Actor.model}                                 200 - Returns the actor
	 * @returns {ValidationError}                         400 - Supplied parameters are invalid
	 * @returns {UserAuthError}                           401 - User is not authorized to perform this operation
	 * @returns {DatabaseError}                           500 - Database error
	 */
	app.route('/v2/actors/')
		.post(actors.create_an_actor_v2);


};
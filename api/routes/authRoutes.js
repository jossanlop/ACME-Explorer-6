'use strict';
module.exports = function (app) {
	var Actor = require('../models/actorModel');

	var actors = require('../controllers/actorController');
	var auth = require('../controllers/authController');




	/**
	* @typedef Login
	* @property {string} email.required              - Unique identifier for this configuration parameter
	* @property {string} password.required  - Period that the finder is kept in cache for all users
	*/

	/**
	 * POST the Auth
	 * @route POST /login
	 * @group Auth - System configuration parameters
	 * @param {Login.model} login.body.required   - Updated configuration parameters
	 * @returns {object}                                  200 - Returns the configParam identifier
	 * @returns {ValidationError}                         400 - Supplied parameters are invalid
	 * @returns {UserAuthError}                           401 - User is not authorized to perform this operation
	 * @returns {DatabaseError}                           500 - Database error
	 */
	app.route('/v2/login/')
		.post(actors.login_an_actor);

	/**
	* GET tokenId of Actor
	* @route GET /custom/{customToken}
	* @group Auth - System configuration parameters
	* @param {string} customToken.path.required - Firebase custom token
	* @returns {object} 200 - Firebase Id token
	* @returns {Error}  401 - Error while checking token
	 */
	app.route('/v2/custom/:customToken')
		.get(auth.getIdTokenByCustomToken);
};

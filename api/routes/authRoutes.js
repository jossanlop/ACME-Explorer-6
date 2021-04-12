'use strict';
module.exports = function (app) {
	var Actor = require('../models/actorModel');
	var actors = require('../controllers/actorController');
	var auth = require('../controllers/authController');

	/**
	 * @typedef Login
	 * @property {string} email.required              - Email of the user
	 * @property {string} password.required  - Password of the user
	 */

	/**
	 * POST Authentication
	 * @route POST /login
	 * @group Auth - Authenticate to the system
	 * @param {Login.model} login.body.required   - Credentials to login
	 * @returns {object}                                  200 - Returns the information which contains the custom token
	 * @returns {ValidationError}                         400 - Supplied parameters are invalid
	 * @returns {UserAuthError}                           401 - User is not authorized to perform this operation
	 * @returns {DatabaseError}                           500 - Database error
	 */
	app.route('/v2/login/')
		.post(actors.login_an_actor);

	/**
	 * GET tokenId of Actor
	 * @route GET /custom/{customToken}
	 * @group Auth - Authenticate to the system
	 * @param {string} customToken.path.required - Firebase custom token
	 * @returns {object} 200 - Firebase Id token
	 * @returns {Error}  401 - Error while checking token
	 */
	app.route('/v2/custom/:customToken')
		.get(auth.getIdTokenByCustomToken);
};
'use strict';
module.exports = function (app) {
	var actors = require('../controllers/actorController');

	/**
	   * Get custom auth token, for an actor by providing email and password
	   *
	   * @section actors
	   * @type get
	   * @url /v1/actors/login/
	   * @param {string} email
	   * @param {string} password
	  */

	/**

	* @typedef ConfigParam

	* @property {string} _id               - Unique identifier for this configuration parameter

	* @property {integer} finderTimeCache  - Period that the finder is kept in cache for all users

	*/




	/**

	 * Update the configParam

	 * @route PUT /configParams

	 * @group configParam - System configuration parameters

	 * @param {string}  userToken.query.required          - User JWT token

	 * @param {ConfigParam.model} configParam.body.required   - Updated configuration parameters

	 * @returns {string}                                  200 - Returns the configParam identifier

	 * @returns {ValidationError}                         400 - Supplied parameters are invalid

	 * @returns {UserAuthError}                           401 - User is not authorized to perform this operation

	 * @returns {DatabaseError}                           500 - Database error

	 */
	app.route('/v1/login/')
		.get(actors.login_an_actor);
};

'use strict';

module.exports = function (app) {
	var finderCollection = require('../controllers/finderCollectionController');
	var authController = require('../controllers/authController');

	/**
	  * @typedef FinderCollection
	  * @property {string} user               - Unique identifier for this configuration parameter
	  * @property {string} keyWord  - Period that the finder is kept in cache for all users
	  * @property {Array.<integer>} priceRange  - Period that the finder is kept in cache for all users
	  * @property {Array.<string>} dateRange  - Period that the finder is kept in cache for all users
	  * @property {Array.<string>} results  - Period that the finder is kept in cache for all users
	  * @property {string} timestamp  - Period that the finder is kept in cache for all users
	*/

	/**
	 * Get the Finders
	 * @route GET /finderCollection
	 * @group Finder - System configuration parameters
	 * @returns {string}                                  200 - Returns the configParam identifier
	 * @returns {ValidationError}                         400 - Supplied parameters are invalid
	 * @returns {UserAuthError}                           401 - User is not authorized to perform this operation
	 * @returns {DatabaseError}                           500 - Database error
	 */

	/**
	 * Delete one Finder
	 * @route DELETE /finderCollection?keyword=keyword
	 * @group Finder - System configuration parameters
		 * @param {string} keyWord
	 * @returns {string}                                  200 - Every finder has been correctly removed
	 * @returns {ValidationError}                         400 - Supplied parameters are invalid
	 * @returns {UserAuthError}                           401 - User is not authorized to perform this operation
	 * @returns {DatabaseError}                           500 - Database error
	 * @security bearerAuth
	 */

	app.route('/v2/finderCollection')
		.get(authController.verifyUser(["EXPLORER"]), finderCollection.list_all_finders)
		.delete(authController.verifyUser(["EXPLORER"]), finderCollection.delete_a_finder);

	/**
 * Delete all Finders
 * @route DELETE /finderCollection
 * @group Finder - System configuration parameters
 * @returns {string}                                  200 - Every finder has been correctly removed
 * @returns {ValidationError}                         400 - Supplied parameters are invalid
 * @returns {UserAuthError}                           401 - User is not authorized to perform this operation
 * @returns {DatabaseError}                           500 - Database error
 * @security bearerAuth
 */

	app.route('/v2/finderCollection')
		.delete(authController.verifyUser(["EXPLORER"]), finderCollection.delete_all_finders);
}

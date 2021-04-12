'use strict';

module.exports = function (app) {
	var finderCollection = require('../controllers/finderCollectionController');
	var authController = require('../controllers/authController');

	/**
	  * @typedef FinderCollection
	  * @property {string} user               	- User who has done the search
	  * @property {string} keyWord  			- Keyword specified in the search of trips
	  * @property {Array.<integer>} priceRange  - Price range filter for the trips
	  * @property {Array.<string>} dateRange 	- Date range filter for the trips
	  * @property {Array.<string>} results  	- Results obtained from the search
	  * @property {string} timestamp  			- Date of the search
	*/

	/**
	 * Get the Finders
	 * @route GET /finderCollection
	 * @group Finder - Finder Collection
	 * @returns {string}                                  200 - Returns the Finders
	 * @returns {UserAuthError}                           401 - User is not authorized to perform this operation
	 * @returns {DatabaseError}                           500 - Database error
	 * @security bearerAuth
	 */

	/**
	 * Delete one Finder
	 * @route DELETE /finderCollection?keyword=keyword
	 * @group Finder -  Finder Collection
	 * @param {string} keyWord
	 * @returns {string}                                  200 - The specified finder has been correctly removed
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
 * @group Finder - Finder Collection
 * @returns {string}                                  200 - Every finder has been correctly removed
 * @returns {UserAuthError}                           401 - User is not authorized to perform this operation
 * @returns {DatabaseError}                           500 - Database error
 * @security bearerAuth
 */

	app.route('/v2/finderCollection')
		.delete(authController.verifyUser(["EXPLORER"]), finderCollection.delete_all_finders);
}

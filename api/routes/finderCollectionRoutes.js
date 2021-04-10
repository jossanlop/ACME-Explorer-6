'use strict';

module.exports = function(app) {
    var finderCollection = require('../controllers/finderCollectionController');
    
 
/**
 * @typedef FinderCollection
	* @property {string} user               - Unique identifier for this configuration parameter
	* @property {string} keyWord  - Period that the finder is kept in cache for all users
	* @property {Array.<integer>} priceRange  - Period that the finder is kept in cache for all users
	* @property {Array.<string>} dateRange  - Period that the finder is kept in cache for all users
	* @property {Array.<string>} results  - Period that the finder is kept in cache for all users
	* @property {Date} timestamp  - Period that the finder is kept in cache for all users
  */

	/**
	 * Get the Finders
	 * @route GET /finderCollection
	 * @group Finder - System configuration parameters
   * @param {string} actorId
	 * @returns {string}                                  200 - Returns the configParam identifier
	 * @returns {ValidationError}                         400 - Supplied parameters are invalid
	 * @returns {UserAuthError}                           401 - User is not authorized to perform this operation
	 * @returns {DatabaseError}                           500 - Database error
	 */
app.route('/v2/finderCollection')
  .get(finderCollection.list_all_finders)
  .delete(finderCollection.delete_all_finders)
  .delete(finderCollection.delete_a_finder);
}

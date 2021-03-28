'use strict';

module.exports = function(app) {
    var finderCollection = require('../controllers/finderCollectionController');
    
  /**
   * Get finderCollection who is clerk (any role)
	 *
	 * @section finders
	 * @type get
	 * @url /v1/finderCollection
  */
app.route('/v1/finderCollection')
  .get(finderCollection.list_all_finders)
  .delete(finderCollection.delete_all_finders)
  .delete(finderCollection.delete_a_finder);
}

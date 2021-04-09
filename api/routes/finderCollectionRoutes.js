'use strict';

module.exports = function(app) {
    var finderCollection = require('../controllers/finderCollectionController');
    var authController = require('../controllers/authController');
  
  

  app.route('/v1/finderCollection')
  .get(finderCollection.list_all_finders)
  .put(authController.verifyUser(['EXPLORER']),finderCollection.update_a_finder);

  /**
   * Get finderCollection who is clerk (any role)
	 *
	 * @section finders
	 * @type get
	 * @url /v2/finderCollection
  */
app.route('/v2/finderCollection')
  .get(authController.verifyUser(['EXPLORER']),finderCollection.list_all_finders)
  .put(authController.verifyUser(['EXPLORER']),finderCollection.update_a_finder);
  // .delete(authController.verifyUser(['EXPLORER']),finderCollection.delete_a_finder);
}

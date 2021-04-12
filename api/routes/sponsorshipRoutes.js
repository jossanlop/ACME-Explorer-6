'use strict';
module.exports = function(app) {
  var sponsorships = require('../controllers/sponsorshipController');
  var authController = require('../controllers/authController');

  // app.route('/v1/sponsorships')
  //   .get(sponsorships.list_my_sponsorships)
	//   .post(sponsorships.create_an_sponsorship);


   /**
   * Get all sponsorships. Only available for administrators
   * @route GET /sponsorships
   * @group Sponsorship - System sponsorships
   * @returns {Array.<Sponsorship.model>}                     200 - Returns the system sponsorship list
   * @returns {ValidationError}                         400 - Supplied parameters are invalid
   * @returns {UserAuthError}                           401 - User is not authorized to perform this operation
   * @returns {DatabaseError}                           500 - Database error
   * @security bearerAuth
   */

  /**
   * Creates a new sponsorship
   * @route POST /sponsorships
   * @group Sponsorship - System sponsorships
   * @returns {Sponsorship.model}                       200 - Returns the sponsorship stored
   * @returns {ValidationError}                         400 - Supplied parameters are invalid
   * @returns {UserAuthError}                           401 - User is not authorized to perform this operation
   * @returns {DatabaseError}                           500 - Database error
   * @security bearerAuth
   */
   app.route('/v2/sponsorships')
    .get(authController.verifyUser(["ADMINISTRATOR"]),sponsorships.list_all_sponsorships)
    .post(authController.verifyUser(["ADMINISTRATOR"]),sponsorships.create_an_sponsorship);


  // app.route('/v1/sponsorships/:sponsorshipId')
  //   .get(sponsorships.read_an_sponsorship)
	//   .put(sponsorships.update_an_sponsorship)
  //   .delete(sponsorships.delete_an_sponsorship);



/**
   * Get sponsorships by ID. It is only valid for administrators, who can get any of the sponsorships registered of the system, and sponsors who can get only one of theirs sponsorships.
   * 
   * @route GET /sponsorships
   * @group Sponsorship - System sponsorships
   * @param {string} sponsorshipId - Sponsorship identifier
   * @returns {Sponsorship.model}                     200 - Returns the sponsorship list, if you are an explorer, it returns the sponsorships you have made on any trip, and if you are a manager, it returns the sponsorships on any of your trips.
   * @returns {ValidationError}                         400 - Supplied parameters are invalid
   * @returns {UserAuthError}                           401 - User is not authorized to perform this operation
   * @returns {DatabaseError}                           500 - Database error
   * @security bearerAuth
   */

  /**
   * Update an sponsorship. It is only valid for sponsors and they can update only theirs sponsorships.
   * @route PUT /sponsorships
   * @group Sponsorship - System sponsorships
   * @param {string} sponsorshipId - Sponsorship identifier
   * @returns {Sponsorship.model}                       200 - Returns the sponsorship stored
   * @returns {ValidationError}                         400 - Supplied parameters are invalid
   * @returns {UserAuthError}                           401 - User is not authorized to perform this operation
   * @returns {DatabaseError}                           500 - Database error
   * @security bearerAuth
   */
  /**
   * Delete an sponsorship. It is only valid for sponsors and they can delete only theirs sponsorships.
   * @route DELETE /sponsorships
   * @group Sponsorship - System sponsorships
   * @param {string} sponsorshipId - Sponsorship identifier
   * @returns {Sponsorship.model}                       200 - Returns the message: 'Sponsorship successfully deleted'
   * @returns {ValidationError}                         400 - Supplied parameters are invalid
   * @returns {UserAuthError}                           401 - User is not authorized to perform this operation
   * @returns {DatabaseError}                           500 - Database error
   * @security bearerAuth
   */
  app.route('/v2/sponsorships/:sponsorshipId')
    .get(authController.verifyUser(["SPONSOR","ADMINISTRATOR"]),sponsorships.read_an_sponsorship)
    .put(authController.verifyUser(["SPONSOR"]),sponsorships.update_an_sponsorship)
    .delete(authController.verifyUser(["SPONSOR"]),sponsorships.delete_an_sponsorship);

}

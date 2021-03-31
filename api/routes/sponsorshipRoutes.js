'use strict';
module.exports = function(app) {
  var sponsorships = require('../controllers/sponsorshipController');

  /**
   * Get a sponsorship 
   *    Required role: None
   * Post a sponsorship 
   *    RequiredRoles: None
	 *
	 * @section sponsorships
	 * @type get post
	 * @url /v1/sponsorships
  */
  app.route('/v1/sponsorships')
	  .get(sponsorships.list_all_sponsorships)
	  .post(sponsorships.create_an_sponsorship);

/**
   * Get all sponsorships
   *    Required role: Administrator
   * Post a sponsorship 
   *    RequiredRoles: Administrator, Sponsor
	 *
	 * @section sponsorships
	 * @type get post
	 * @url /v2/sponsorships
*/
   app.route('/v2/sponsorships')
    .get(authController.verifyUser(["ADMINISTRATOR"]),sponsorships.list_all_sponsorships)
    .post(authController.verifyUser(["ADMINISTRATOR"]),sponsorships.create_an_sponsorship);

  /**
   * Put a sponsorship
   *    RequiredRoles: none
   * Get a sponsorship
   *    RequiredRoles: none
	 *
	 * @section sponsorships
	 * @type get put delete
	 * @url /v1/sponsorships/:sponsorshipId
  */  
  app.route('/v1/sponsorships/:sponsorshipId')
    .get(sponsorships.read_an_sponsorship)
	  .put(sponsorships.update_an_sponsorship)
    .delete(sponsorships.delete_an_sponsorship);


    /**
   * Put a sponsorship
   *    RequiredRoles: to be the proper Sponsor
   * Get a sponsorship
   *    RequiredRoles: to be the proper Sponsor or an Administrator
   * Delete a sponsorship
   *    RequiredRoles: to be the proper Sponsor
	 *
	 * @section sponsorships
	 * @type get put delete
	 * @url /v2/sponsorships/:sponsorshipId
  */  
  app.route('/v2/sponsorships/:sponsorshipId')
    .get(authController.verifyUser(["SPONSORS","ADMINISTRATOR"]),sponsorships.read_an_sponsorship)
    .put(authController.verifyUser(["SPONSORS"]),sponsorships.update_an_sponsorship)
    .delete(authController.verifyUser(["SPONSORS"]),sponsorships.delete_an_sponsorship);

}

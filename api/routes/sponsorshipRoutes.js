'use strict';
module.exports = function(app) {
  var sponsorships = require('../controllers/sponsorshipController');

  /**
   * Get an sponsorship who is clerk (any role)
   *    Required role: Administrator
   * Post an sponsorship 
   *    RequiredRoles: None
   *    validated if customer and not validated if clerk
	 *
	 * @section sponsorships
	 * @type get post
	 * @url /v1/sponsorships
  */
  app.route('/v1/sponsorships')
	  .get(sponsorships.list_all_sponsorships)
	  .post(sponsorships.create_an_sponsorship);

  /**
   * Put an sponsorship
   *    RequiredRoles: to be the proper sponsorship
   * Get an sponsorship
   *    RequiredRoles: to be the proper sponsorship or an Administrator
	 *
	 * @section sponsorships
	 * @type get put
	 * @url /v1/sponsorships/:sponsorshipId
  */  
  app.route('/v1/sponsorships/:sponsorshipId')
    .get(sponsorships.read_an_sponsorship)
	.put(sponsorships.update_an_sponsorship)
    .delete(sponsorships.delete_an_sponsorship);

}

'use strict';
module.exports = function(app) {
  var trips = require('../controllers/tripController');

  /**
   * Get an trip who is clerk (any role)
   *    Required role: Administrator
   * Post an trip 
   *    RequiredRoles: None
   *    validated if customer and not validated if clerk
	 *
	 * @section trips
	 * @type get post
	 * @url /v1/trips
  */
  app.route('/v1/trips')
	  .get(trips.list_all_trips)
	  .post(trips.create_an_trip);

  /**
   * Put an trip
   *    RequiredRoles: to be the proper trip
   * Get an trip
   *    RequiredRoles: to be the proper trip or an Administrator
	 *
	 * @section trips
	 * @type get put
	 * @url /v1/trips/:tripId
  */  
  app.route('/v1/trips/:tripId')
    .get(trips.read_an_trip)
	.put(trips.update_an_trip)
    .delete(trips.delete_an_trip);

}

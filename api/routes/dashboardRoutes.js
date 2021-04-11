'use strict';

module.exports = function(app) {
    var dashboard = require('../controllers/dashboardController');

  /**
    * Get the average, the minimum, the maximum, and the standard deviation of the
    * number of trips managed per manager.
    *    Required role: ADMINISTRATOR
    *    
	* @section dashboard
	* @type get 
	* @url /v1/trips-managed-per-manager
  */
    app.route('/v1/trips-managed-per-manager')
    .get(dashboard.tripsManagedPerManager)
 
    /**
    * Get the average, the minimum, the maximum, and the standard deviation of the
    *    number of applications per trip.
    *    Required role: ADMINISTRATOR
    *    
	* @section dashboard
	* @type get 
	* @url /v1/applications-per-trip
    */

    app.route('/v1/applications-per-trip')
    .get(dashboard.applicationsPerTrip)

    /**
    * Get The average, the minimum, the maximum, and the standard deviation of the
    * price of the trips.
    *    Required role: ADMINISTRATOR
    *    
	* @section dashboard
	* @type get 
	* @url /v1/trips-managed-per-manager
    */

    app.route('/v1/price-per-trips')
    .get(dashboard.pricePerTrips)

    /**
    * Get the ratio of applications grouped by status.
    *    Required role: ADMINISTRATOR
    *    
	* @section dashboard
	* @type get 
	* @url /v1/applications-by-status
    */

    app.route('/v1/applications-by-status')
    .get(dashboard.applicationsByStatus)
 
    /**
    * Get the average price range that explorers indicate in their finders
    *    Required role: ADMINISTRATOR
    *    
	* @section dashboard
	* @type get 
	* @url /v1/average-price-finders
    */

    app.route('/v1/average-price-finders')
    .get(dashboard.averagePriceFinders)


    /**
    * Get the top 10 key words that the explorers indicate in their finders.
    *    Required role: ADMINISTRATOR
    *    
	* @section dashboard
	* @type get 
	* @url /v1/top-ten-keywords-finders
    */

    app.route('/v1/top-ten-keywords-finders')
    .get(dashboard.topTenKeywordsFinders) 
}
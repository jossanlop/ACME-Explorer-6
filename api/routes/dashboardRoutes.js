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
    .get(authController.verifyUser(["ADMINISTRATOR"]), dashboard.tripsManagedPerManager)
 
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
    .get(authController.verifyUser(["ADMINISTRATOR"]), dashboard.applicationsPerTrip)

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
    .get(authController.verifyUser(["ADMINISTRATOR"]), dashboard.pricePerTrips)

    /**
    * Get the ratio of applications grouped by status.
    *    Required role: ADMINISTRATOR
    *    
	* @section dashboard
	* @type get 
	* @url /v1/applications-by-status
    */

    app.route('/v1/applications-by-status')
    .get(authController.verifyUser(["ADMINISTRATOR"]), dashboard.applicationsByStatus)
 
    /**
    * Get the average price range that explorers indicate in their finders
    *    Required role: ADMINISTRATOR
    *    
	* @section dashboard
	* @type get 
	* @url /v1/average-price-finders
    */

    app.route('/v1/average-price-finders')
    .get(authController.verifyUser(["ADMINISTRATOR"]), dashboard.averagePriceFinders)


    /**
    * Get the top 10 key words that the explorers indicate in their finders.
    *    Required role: ADMINISTRATOR
    *    
	* @section dashboard
	* @type get 
	* @url /v1/top-ten-keywords-finders
    */

    app.route('/v1/top-ten-keywords-finders')
    .get(authController.verifyUser(["ADMINISTRATOR"]), dashboard.topTenKeywordsFinders) 
}

/**
    * Get the average, the minimum, the maximum, and the standard deviation of the
    * number of trips managed per manager.
   * @route GET /trips-managed-per-manager
   * @group Dashboard - Analytical Data
   * @returns {Array.<Application.model>}               200 - Returns the data
   * @returns {ValidationError}                         404 - There is no data
   * @returns {UserAuthError}                           401 - User is not authorized to perform this operation
   * @returns {DatabaseError}                           500 - Database error
   * @security bearerAuth
   */

/**
    * Get the average, the minimum, the maximum, and the standard deviation of the
    *    number of applications per trip.
   * @route GET /applications-per-trip
   * @group Dashboard - Analytical Data
   * @returns {Array.<Application.model>}               200 - Returns the data
   * @returns {ValidationError}                         404 - There is no data
   * @returns {UserAuthError}                           401 - User is not authorized to perform this operation
   * @returns {DatabaseError}                           500 - Database error
   * @security bearerAuth
   */

/**
    * Get The average, the minimum, the maximum, and the standard deviation of the
    * price of the trips.
   * @route GET /trips-managed-per-manager
   * @group Dashboard - Analytical Data
   * @returns {Array.<Application.model>}               200 - Returns the data
   * @returns {ValidationError}                         404 - There is no data
   * @returns {UserAuthError}                           401 - User is not authorized to perform this operation
   * @returns {DatabaseError}                           500 - Database error
   * @security bearerAuth
   */

/**
   * Get the ratio of applications grouped by status.
   * @route GET /applications-by-status
   * @group Dashboard - Analytical Data
   * @returns {Array.<Application.model>}               200 - Returns the data
   * @returns {ValidationError}                         404 - There is no data
   * @returns {UserAuthError}                           401 - User is not authorized to perform this operation
   * @returns {DatabaseError}                           500 - Database error
   * @security bearerAuth
   */

/**
   *  Get the average price range that explorers indicate in their finders
   * @route GET /average-price-finders
   * @group Dashboard - Analytical Data
   * @returns {Array.<Application.model>}               200 - Returns the data
   * @returns {ValidationError}                         404 - There is no data
   * @returns {UserAuthError}                           401 - User is not authorized to perform this operation
   * @returns {DatabaseError}                           500 - Database error
   * @security bearerAuth
   */

/**
   * Get the top 10 key words that the explorers indicate in their finders.
   * @route GET /top-ten-keywords-finders
   * @group Dashboard - Analytical Data
   * @returns {Array.<Application.model>}               200 - Returns the data
   * @returns {ValidationError}                         404 - There is no data
   * @returns {UserAuthError}                           401 - User is not authorized to perform this operation
   * @returns {DatabaseError}                           500 - Database error
   * @security bearerAuth
   */

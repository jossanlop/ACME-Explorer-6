'use strict';
module.exports = function (app) {
  var application = require('../controllers/applicationController');
  var authController = require('../controllers/authController');


  /**
   * @typedef Application
   * @property {string} create_date  - Creation date of the application
   * @property {integer} trip_id  - Trip which is applied
   * @property {integer} explorer_id  - Explorer that creates the application
   * @property {string} status  - Current status of the application, can be one of those ("PENDING", "DUE", "REJECTED", "ACCEPTED", "CANCELLED")
   * @property {Array.<string>} comments  - List of comments about the application
   * @property {string} rejectReason  - Reason why an application is rejected
   */

  // app.route('/v1/applications')
  //   .get(application.list_all_applications)
  //   .post(application.create_an_application);

  /**
   * Post an application 
   *    RequiredRoles: to be a customer
   *
   * @section applications
   * @type get post
   * @url /v2/applications
   */

  /**
   * Get your applications
   * @route GET /applications
   * @group Application - System trips applications
   * @returns {Array.<Application>}                     200 - Returns the application list, if you are an explorer, it returns the applications you have made on any trip, and if you are a manager, it returns the applications on any of your trips.
   * @returns {ValidationError}                         400 - Supplied parameters are invalid
   * @returns {UserAuthError}                           401 - User is not authorized to perform this operation
   * @returns {DatabaseError}                           500 - Database error
   * @security bearerAuth
   */

  /**
   * Post an application. It is only valid for explorers and creates an application on the trip indicated in the body of the request.
   * @route POST /applications
   * @group Application - System trips applications
   * @returns {Application.model}                       200 - Returns the application stored
   * @returns {ValidationError}                         400 - Supplied parameters are invalid
   * @returns {UserAuthError}                           401 - User is not authorized to perform this operation
   * @returns {DatabaseError}                           500 - Database error
   * @security bearerAuth
   */

  app.route('/v2/applications')
    .get(authController.verifyUser(["MANAGER", "EXPLORER"]), application.list_all_applications)
    .post(authController.verifyUser(["EXPLORER"]), application.create_an_application);


  // app.route('/v1/applications/search')
  //.get(application.search_applications);

  // app.route('/v2/applications/:applicationId')
  //   .get(application.read_an_application)
  //   .put(application.update_an_application) 
  //   .delete(application.delete_an_application);

  /**
   * Delete an application if it is not delivered
   *    RequiredRoles: to be the customer that posted the application
   * Put an application with the proper clerk assignment (only if the application has not previously assigned); 
   * also to update the delivery moment.
   *    RequiredRoles: clerk
   * Get an specific application.
   *    RequiredRoles: to be a proper customer
   * 
   * @section applications
   * @type put delete
   * @url /v1/applications/:applicationId
   */



  
  /**
   * Get an application by ID. It is only available for managers, and managers only can read their applications.
   * @route GET /applications
   * @group Application - System trips applications
   * @param {string} applicationId - Application identifier
   * @returns {Application.model}                       200 - Returns the application with the ID passed as parameter
   * @returns {ValidationError}                         400 - Supplied parameters are invalid
   * @returns {UserAuthError}                           401 - User is not authorized to perform this operation
   * @returns {DatabaseError}                           500 - Database error
   * @security bearerAuth
   */
  // /**
  //  * Update an application by ID. It is only available for managers, and managers only can update their applications.
  //  * @route PUT /applications
  //  * @group Application - System trips applications
  //  * @param {string} applicationId - Application identifier
  //  * @returns {Application.model}                       200 - Returns the application updated
  //  * @returns {ValidationError}                         400 - Supplied parameters are invalid
  //  * @returns {UserAuthError}                           401 - User is not authorized to perform this operation
  //  * @returns {DatabaseError}                           500 - Database error
  //  * @security bearerAuth
  //  */
  // /**
  //  * Delete an application by ID.
  //  * @route DELETE /applications
  //  * @group Application - System trips applications
  //  * @param {string} applicationId - Application identifier
  //  * @returns {string}                                  200 - Returns this message: 'Application successfully deleted'
  //  * @returns {ValidationError}                         400 - Supplied parameters are invalid
  //  * @returns {UserAuthError}                           401 - User is not authorized to perform this operation
  //  * @returns {DatabaseError}                           500 - Database error
  //  * @security bearerAuth
  //  */
  app.route('/v2/applications/:applicationId')
    .get(authController.verifyUser(["MANAGER"]), application.read_an_application);
    //.put(authController.verifyUser(["MANAGER"]), application.update_an_application)
    //.delete(authController.verifyUser(["MANAGER"]), application.delete_an_application);


  /**
   * Update an application status by ID to accept it. An explorer that has an application that has been accepted (in DUE status), pays for it and then the application goes from DUE to ACCEPTED status, so its status must be updated.
   * @route PUT /applications-pay
   * @group Application - System trips applications
   * @param {string} applicationId - Application identifier
   * @returns {Application.model}                       200 - Returns the application updated
   * @returns {ValidationError}                         400 - Supplied parameters are invalid
   * @returns {UserAuthError}                           401 - User is not authorized to perform this operation
   * @returns {DatabaseError}                           500 - Database error
   * @security bearerAuth
   */
  app.route('/v2/applications-pay/:applicationId')
  .put(authController.verifyUser(["EXPLORER"]), application.pay_an_application);
  
  /**
   * Update an application status by ID to cancel it. An explorer that has an application that has been rejected, can cancel it, so its status must be updated.
   * @route PUT /applications-cancel
   * @group Application - System trips applications
   * @param {string} applicationId - Application identifier
   * @returns {Application.model}                       200 - Returns the application updated
   * @returns {ValidationError}                         400 - Supplied parameters are invalid
   * @returns {UserAuthError}                           401 - User is not authorized to perform this operation
   * @returns {DatabaseError}                           500 - Database error
   * @security bearerAuth
   */
  app.route('/v2/applications-cancel/:applicationId')
    .put(authController.verifyUser(["EXPLORER"]), application.cancel_an_application);

  /**
   * Update an application status by ID to set it as due.
   * @route PUT /applications-due
   * @group Application - System trips applications
   * @param {string} applicationId - Application identifier
   * @returns {Application.model}                       200 - Returns the application updated
   * @returns {ValidationError}                         400 - Supplied parameters are invalid
   * @returns {UserAuthError}                           401 - User is not authorized to perform this operation
   * @returns {DatabaseError}                           500 - Database error
   * @security bearerAuth
   */
  app.route('/v2/applications-due/:applicationId')
  .put(authController.verifyUser(["MANAGER"]), application.due_an_application);

  /**
   * Update an application status by ID to reject it.
   * @route PUT /applications-reject
   * @group Application - System trips applications
   * @param {string} applicationId - Application identifier
   * @returns {Application.model}                       200 - Returns the application updated
   * @returns {ValidationError}                         400 - Supplied parameters are invalid
   * @returns {UserAuthError}                           401 - User is not authorized to perform this operation
   * @returns {DatabaseError}                           500 - Database error
   * @security bearerAuth
   */
  app.route('/v2/applications-reject/:applicationId')
  .put(authController.verifyUser(["MANAGER"]), application.reject_an_application);

  // app.route('/v1/myapplications')
  //.get(application.list_my_applications); //añadir ownership para el explorer


  // app.route('/v1/tripapplications')
  //.get(application.list_trip_applications); //añadir ownership para el trip
};
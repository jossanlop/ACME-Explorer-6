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
  /**
   * Get your applications
   * @route GET /applications
   * @group Application - System trips applications
   * @returns {Array.<Application.model>}                     200 - Returns the application list, if you are an explorer, it returns the applications you have made on any trip, and if you are a manager, it returns the applications on any of your trips.
   * @returns {ValidationError}                         400 - Supplied parameters are invalid
   * @returns {UserAuthError}                           401 - User is not authorized to perform this operation
   * @returns {DatabaseError}                           500 - Database error
   * @security bearerAuth
   */
  /**
   * Post an application. It is only valid for explorers and creates an application on the trip indicated in the body of the request.
   * @route POST /applications
   * @group Application - System trips applications
   * @param {Application.model} application.body.required 
   * @returns {Application.model}                       200 - Returns the application stored
   * @returns {ValidationError}                         400 - Supplied parameters are invalid
   * @returns {UserAuthError}                           401 - User is not authorized to perform this operation
   * @returns {DatabaseError}                           500 - Database error
   * @security bearerAuth
   */
  app.route('/v2/applications')
    .get(authController.verifyUser(["MANAGER", "EXPLORER"]), application.list_all_applications)
    .post(authController.verifyUser(["EXPLORER"]), application.create_an_application);
  /**
   * Get an application by ID. It is only available for managers, and managers only can read their applications.
   * @route GET /applications/{applicationId}
   * @group Application - System trips applications
   * @param {string} applicationId.path - Application identifier
   * @returns {Application.model}                       200 - Returns the application with the ID passed as parameter
   * @returns {ValidationError}                         400 - Supplied parameters are invalid
   * @returns {UserAuthError}                           401 - User is not authorized to perform this operation
   * @returns {DatabaseError}                           500 - Database error
   * @security bearerAuth
   */
  // /**
  //  * Update an application by ID. It is only available for managers, and managers only can update their applications.
  //  * @route PUT /applications/{applicationId}
  //  * @group Application - System trips applications
  //  * @param {string} applicationId.path - Application identifier
  //  * @returns {Application.model}                       200 - Returns the application updated
  //  * @returns {ValidationError}                         400 - Supplied parameters are invalid
  //  * @returns {UserAuthError}                           401 - User is not authorized to perform this operation
  //  * @returns {DatabaseError}                           500 - Database error
  //  * @security bearerAuth
  //  */
  // /**
  //  * Delete an application by ID.
  //  * @route DELETE /applications/{applicationId}
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
  /**
   * Update an application status by ID to accept it. An explorer that has an application that has been accepted (in DUE status), pays for it and then the application goes from DUE to ACCEPTED status, so its status must be updated.
   * @route PUT /applications-pay/{applicationId}
   * @group Application - System trips applications
   * @param {string} applicationId.path - Application identifier
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
   * @route PUT /applications-cancel/{applicationId}
   * @group Application - System trips applications
   * @param {string} applicationId.path - Application identifier
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
   * @route PUT /applications-due/{applicationId}
   * @group Application - System trips applications
   * @param {string} applicationId.path - Application identifier
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
   * @route PUT /applications-reject/{applicationId}
   * @group Application - System trips applications
   * @param {string} applicationId.path - Application identifier
   * @param {string} reject.path - reason of rejection
   * @returns {Application.model}                       200 - Returns the application updated
   * @returns {ValidationError}                         400 - Supplied parameters are invalid
   * @returns {UserAuthError}                           401 - User is not authorized to perform this operation
   * @returns {DatabaseError}                           500 - Database error
   * @security bearerAuth
   */
  app.route('/v2/applications-reject/:applicationId')
  .put(authController.verifyUser(["MANAGER"]), application.reject_an_application);
};
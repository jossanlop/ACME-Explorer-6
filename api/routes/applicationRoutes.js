'use strict';
module.exports = function(app) {
  var application = require('../controllers/applicationController');
  var authController = require('../controllers/authController');
  
  /**
   * Post an application 
   *    RequiredRoles: to be a customer
   *
   * @section applications
   * @type get post
   * @url /v1/applications
  */
  app.route('/v1/applications')
	  .get(application.list_all_applications)
	  .post(application.create_an_application);
  
  /**
   * Post an application 
   *    RequiredRoles: to be a customer
   *
   * @section applications
   * @type get post
   * @url /v2/applications
  */
     app.route('/v2/applications')
     .get(authController.verifyUser(["MANAGER", "EXPLORER"]), application.list_all_applications)
     .post(authController.verifyUser(["EXPLORER"]), application.create_an_application);

  /**
   * Search engine for applications
   * Get applications depending on params
   *    RequiredRoles: Clerk
   *
   * @section applications
   * @type get
   * @url /v1/applications/search
   * @param {string} clerkId
   * @param {string} asigned (true|false)
   * @param {string} delivered (true|false)
  */
  app.route('/v1/applications/search')
    //.get(application.search_applications);


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
  app.route('/v2/applications/:applicationId').get(application.read_an_application) 
  .put(application.update_an_application) 
  .delete(application.delete_an_application);

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
   app.route('/v2/applications/:applicationId')
   .get(authController.verifyUser(["MANAGER"]), application.read_an_application)
    .put(authController.verifyUser(["MANAGER"]), application.update_an_application);
//    .delete(application.delete_an_application);


  /**
   * Get my applications.
   *    RequiredRoles: to be a proper customer
   * 
   * @section myapplications
   * @type get
   * @url /v1/myapplications/:actorId
  */
  app.route('/v1/myapplications')
    //.get(application.list_my_applications); //añadir ownership para el explorer

      /**
   * Get my applications.
   *    RequiredRoles: to be a proper customer
   * 
   * @section myapplications
   * @type get
   * @url /v1/myapplications/:actorId
  */
  app.route('/v1/tripapplications')
    //.get(application.list_trip_applications); //añadir ownership para el trip
};

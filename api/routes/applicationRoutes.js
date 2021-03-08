'use strict';
module.exports = function(app) {
  var application = require('../controllers/applicationController');
  
  
  /**
   * Post an order 
   *    RequiredRoles: to be a customer
   *
   * @section orders
   * @type get post
   * @url /v1/applications
  */
  app.route('/v1/applications')
	  .get(order.list_all_applications)
	  .post(application.create_an_application);
  
  /**
   * Search engine for orders
   * Get orders depending on params
   *    RequiredRoles: Clerk
   *
   * @section orders
   * @type get
   * @url /v1/orders/search
   * @param {string} clerkId
   * @param {string} asigned (true|false)
   * @param {string} delivered (true|false)
  */
  app.route('/v1/applications/search')
    .get(application.search_applications);


  /**
   * Delete an order if it is not delivered
   *    RequiredRoles: to be the customer that posted the order
   * Put an order with the proper clerk assignment (only if the order has not previously assigned); 
   * also to update the delivery moment.
   *    RequiredRoles: clerk
   * Get an specific order.
   *    RequiredRoles: to be a proper customer
   * 
   * @section orders
   * @type put delete
   * @url /v1/orders/:orderId
  */
  app.route('/v1/applications/:applicationsId')
    .get(application.read_an_application) 
    .put(application.update_an_application) 
    .delete(application.delete_an_application);

  /**
   * Get my orders.
   *    RequiredRoles: to be a proper customer
   * 
   * @section myorders
   * @type get
   * @url /v1/myorders/:actorId
  */
  app.route('/v1/myapplications')
    .get(application.list_my_applications); //añadir ownership para el explorer

      /**
   * Get my orders.
   *    RequiredRoles: to be a proper customer
   * 
   * @section myorders
   * @type get
   * @url /v1/myorders/:actorId
  */
  app.route('/v1/tripapplications')
  .get(application.list_trip_applications); //añadir ownership para el trip
};

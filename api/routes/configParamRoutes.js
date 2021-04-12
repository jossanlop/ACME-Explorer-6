'use strict';
module.exports = function (app) {
    var configParams = require('../controllers/configParamController');
    var authController = require('../controllers/authController');


    /**
     * @typedef ConfigParam
     * @property {string} _id               - Unique identifier for this configuration parameter
     * @property {integer} finderTimeCache  - Period that the finder is kept in cache for all users
     */


    /**
     * Get the configParam
     * @route GET /configParams
     * @group configParam - System configuration parameters
     * @returns {ConfigParam.model}                                  200 - Returns system configuration parameters
     * @returns {ValidationError}                         400 - Supplied parameters are invalid
     * @returns {UserAuthError}                           401 - User is not authorized to perform this operation
     * @returns {DatabaseError}                           500 - Database error
     * @security bearerAuth
     */

    /**
     * Update the configParam. Only available for administrators
     * @route PUT /configParams
     * @group configParam - System configuration parameters
     * @param {ConfigParam.model} configParam.body.required   - Updated configuration parameters
     * @returns {string}                                  200 - Returns the configParam identifier
     * @returns {ValidationError}                         400 - Supplied parameters are invalid
     * @returns {UserAuthError}                           401 - User is not authorized to perform this operation
     * @returns {DatabaseError}                           500 - Database error
     * @security bearerAuth
     */
    /**
     * Create a configParam. Only available for administrators
     * @route POST /configParams
     * @group configParam - Create a system configuration parameters
     * @param {ConfigParam.model} configParam.body.required   - Create a configuration parameters
     * @returns {string}                                  200 - Returns the configParam identifier
     * @returns {ValidationError}                         400 - Supplied parameters are invalid
     * @returns {UserAuthError}                           401 - User is not authorized to perform this operation
     * @returns {DatabaseError}                           500 - Database error
     * @security bearerAuth
     */
    app.route('/v2/configParams')
        .get(configParams.read_an_configParam)
        .post(authController.verifyUser(["ADMINISTRATOR"]), configParams.create_an_configParam)
        .put(authController.verifyUser(["ADMINISTRATOR"]), configParams.update_an_configParam)

}
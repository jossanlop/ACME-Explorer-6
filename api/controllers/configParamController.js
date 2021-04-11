'use strict';
/*---------------ConfigParam----------------------*/
var mongoose = require('mongoose'),
  ConfigParam = mongoose.model('ConfigParam');
var authController = require('../controllers/authController');

exports.create_an_configParam = async function (req, res) {
  var new_configParam = new ConfigParam(req.body);
  ConfigParam.find({}, function (err, configParams) {
    if (err) {
      res.status(500).send(err);
    } else {
      if (configParams.length > 0) {
        res.status(500).send("Cannot create more than one config param");
      } else {
        new_configParam.save(function (err, configParam) {
          if (err) {
            if (err.name == 'ValidationError') {
              res.status(422).send(err);
            } else {
              console.log(configParam);
              res.status(500).send(err);
            }
          } else {
            res.status(200).json(configParam);
          }
        });
      }
    }
  });

};

exports.read_an_configParam = function (req, res) {
  ConfigParam.find({}, function (err, configParam) {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).json(configParam);
    }
  });
};

exports.update_an_configParam = function (req, res) {
  var configParamSystem = null;
  ConfigParam.find(function (err, configParam) {
    if (err) {
      res.status(500).send(err);
    } else {
      configParamSystem = configParam;
      if(configParam[0] != null){
      ConfigParam.findOneAndUpdate({
          _id: configParamSystem[0]._id
        }, req.body, {
          new: true,
          runValidators: true
        }, function (err, configParam) {
          if (err) {
            res.status(500).send(err);
          } else {
            res.json(configParam);
          }
        });
      } else {
        res.status(500).send("Configuration parameters are not initialized");
      }

    }
  });
};
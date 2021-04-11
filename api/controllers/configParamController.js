'use strict';
/*---------------ConfigParam----------------------*/
var mongoose = require('mongoose'),
  ConfigParam = mongoose.model('ConfigParams'),
  var authController = require('../controllers/authController');

exports.create_an_configParam = async function (req, res) {
  var new_configParam = new ConfigParam(req.body);
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
  ConfigParam.findOneAndUpdate({
    ticker: req.params.configParamId
  }, req.body, {
    new: true,
    runValidators: true
  }, function (err, configParam) {
    if (err) {
      if (err.name == 'ValidationError') {
        res.status(422).send(err);
      } else {
        res.status(500).send(err);
      }
    } else {
      if (!configParam.publish)
        res.json(configParam);
      else {
        res.status("Trying to delete a published configParam");
        res.send(403);
      }
    }
  });


  exports.create_an_configParam = async function (req, res) {
    var new_configParam = new ConfigParam(req.body);
    ConfigParam.exists({}, function (err, configParam) {
      if (err) {
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
      } else {
        res.status(500).send(err);
      }
    });
  };
};

// Utils
/* global require, module */
var updateSchema = require('../manage/updateSchema.js');
var Schema = require('mongoose').Schema;
var serverManager = require('../manage/serverManager.js');

//
var statusCodes = {
  ok: 200,
  created: 201,
  finished: 204,
  notFound: 404,
  error: 500
};

module.exports = function (db) {
  this.retrieveAll = function (collectionName, callback) {
    updateSchema(db, collectionName, {}, function(err){
      console.log('~~~~~~ list', collectionName);
      if (err){
        callback(err);
      }
      db.model(collectionName)
        .find({})
        .exec()
        .then(function(data){
          callback(null, data);
        }, function(err){
          callback(err);
        });
    });
  };

  this.updateAll = function (collectionName, where, set, callback) {
    updateSchema(db, collectionName, set, function(err){
      console.log('~~~~~~ update all');
      if (err){
        callback(err);
      }
      db.model(collectionName)
        .update(where, set)
        .exec()
        .then(function(data){
          callback(null, data);
        }, function(err){
          callback(err);
        });
    });
  };

  this.deleteAll = function (collectionName, callback) {
    updateSchema(db, collectionName, {}, function(err){
      console.log('~~~~~~ delete all');
      if (err){
        callback(err);
      }
      db.model(collectionName)
        .remove()
        .exec()
        .then(function(data){
          callback(null, collectionName);
        }, function(err){
          callback(err);
        });
    });
  };

  //create element
  this.create = function (collectionName, data, callback) {
    updateSchema(db, collectionName, data, function(err){
      console.log('~~~~~~ create');
      if (err){
        console.log(err);
        callback(err);
      }
      var Model = db.model(collectionName);
      var model = new Model(data);
      model.save(function(data){
        callback(null, model);
      }, function(err){
        callback(err);
      });
    });
  };

  //document
  this.retrieveOne = function (collectionName, id, callback) {
    updateSchema(db, collectionName, {}, function(err){
      console.log('~~~~~~ show');
      if (err){
        callback(err);
      }
      db.model(collectionName)
        .findById(id)
        .exec()
        .then(function(data){
          callback(null, data);
        }, function(err){
          callback(err);
        });
    });
  };

  //update single document
  this.updateOne = function (collectionName, id, set, callback) {
    updateSchema(db, collectionName, set, function(err){
      console.log('~~~~~~ update one');
      if (err){
        callback(err);
      }
      db.model(collectionName)
        .findByIdAndUpdate(id, set)
        .exec()
        .then(function(data){
          callback(null, data);
        }, function(err){
          callback(err);
        });
    });
  };

  //delete single document
  this.deleteOne = function (collectionName, id, callback) {
    updateSchema(db, collectionName, {}, function(err){
      console.log('~~~~~~ delete one');
      if (err){
         callback(err);
      }
      db.model(collectionName)
        .findByIdAndRemove(id)
        .exec()
          .then(function(data){
            callback(null, data);
          }, function(err){
            callback(err);
          });
    });
  };
};

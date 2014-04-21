var Schema = require('mongoose').Schema;
var serverManager = require('./upstreamManager.js');

var extractAttributes = function(data, names){
  console.log('^^^^^^ extracting from ', data);
  var attributes = {};
  for (var key in data){
    var type = Array.isArray(data[key])? 'array' : typeof data[key];
    if (type === 'object'){
      //if a field is non-array object,
      //see if it can be a reference field
      console.log('!!!!!! possible reference type', key, names);
      if (names.indexOf(key) !== -1){
        type = {
          type: Schema.Types.ObjectId,
          ref: key
        };
      } else {
        //otherwise give it a free-form type
        type = {};
      }
      attributes[key] = type;
    } else {
      //native type, capitalize the first letter
      attributes[key] = type.charAt(0).toUpperCase() + type.slice(1);
    }
  }
  console.log('^^^^^^ extracted results ', attributes);
  return attributes;
};

var updateAttributes = function(db, collectionName, attributes){
  var schema = db.model(collectionName).schema;
  var existingAttributes = Object.keys(schema.paths);
  console.log('>>>>>> updating ', collectionName, attributes, ' vs original ', existingAttributes);

  var newAttributes = {};
  for (var attribute in attributes){
    if (existingAttributes.indexOf(attributes[attribute]) === -1){
      newAttributes[attribute] = attributes[attribute];
    }
  }
  if (Object.keys(newAttributes).length){
    schema.add(newAttributes);
    serverManager.updateResource(collectionName, attributes);
  }
};

var createResource = function(db, collectionName, schema){
  console.log('>>>>>> creating ', collectionName, schema);
  db.model(collectionName, new Schema(schema));
  serverManager.createResource(collectionName, schema);
};

module.exports = function(db, collectionName, data, callback){
  var names = Object.keys(db.models);
  console.log('>>>>>> requesting ', collectionName, ' with ', data);

  for (var i = 0, length = names.length; i < length; i++) {
    if (names[i] === collectionName) {
      updateAttributes(db, collectionName, extractAttributes(data, names));
      return callback();
    }
  }

  createResource(db, collectionName, extractAttributes(data, names));
  return callback();
};
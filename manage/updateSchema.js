var extractAttributes = function(data, names){
  var attributes = {};
  for (var key in data){
    var type = Array.isArray(data[key])? 'array' : typeof data[key];
    if (type === 'object'){
      //if a field is non-array object,
      //see if it can be a reference field
      if (names.indexOf(key) !== -1){
        type = {
          type: Schema.Types.ObjectId,
          ref: key
        };
      } else {
        //otherwise give it a free-form type
        type = {};
      }
    } else {
      //native type, capitalize the first letter
      attributes[key] = type.charAt(0).toUpperCase() + type.slice(1);
    }
  }
  return attributes;
};

var updateAttributes = function(db, collectionName, resource){
  var schema = db.model(collectionName).schema;
  var existingAttributes = Object.keys(schema.paths);

  var newAttributes = {};
  for (var attribute in resource.attributes){
    if (existingAttributes.indexOf(resource.attributes[attribute]) === -1){
      newAttributes[attribute] = resource.attributes[attribute];
    }
  }
  schema.add(newAttributes);
}

var serverManager = require('./serverManager.js');

module.exports = function(db, collectionName, data){
  var names = Object.keys(db.models);

  for (var i = 0, length = names.length; i < length; i++) {
    if (names[i] === collectionName) {
      //the collection already exists
      //check if there are new attributes
      updateAttributes(db, collectionName, {
        attributes: extractAttributes(data, names)
      });
      return;
    }
  }

  var schema = extractAttributes(data, names)

  db.model(collectionName, new Schema(schema));

  serverManager.createResource(collectionName, {
    attributes: schema
  });

  return;
};
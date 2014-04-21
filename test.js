var mongoose = require('mongoose');

  var databaseUri = 'mongodb://heroku:s81a27pzuxux5d0qihs1@oceanic.mongohq.com:10010/app23669276'

  var databaseConnection = mongoose.createConnection(databaseUri, { 
    db: { safe:true } 
  });

  console.log(' oooooo waiting for database opening ', databaseUri);

  databaseConnection.on('error', function(err){
    console.log(' ------ database connection error ', err);
  });

  databaseConnection.once('open', function(){
    console.log(' ++++++ database connection opened ');
  });
}
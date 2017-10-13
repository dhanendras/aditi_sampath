var express = require('express');
var app = express();
var db = require('./db');

app.get('/save',function(req,res){
    console.log('db run...prepro');
    db.query('SELECT * FROM client_details', function(err, result) {
      if (err){
        var type = 'quick'; 
        throw err;
        return(type);
      }
      else{
          console.log(JSON.stringify(result));
          var type = result[0].type;
          return(type);
      }
    });
});


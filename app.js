'use strict';

var SwaggerExpress = require('swagger-express-mw');
var app = require('express')();
var db = require('./config/db');

var conf = {
  appRoot: __dirname // required config
};

SwaggerExpress.create(conf, function(err, swaggerExpress) {
  if (err) { throw err; }

  db.getInstance().then(instance => {
      // install middleware
      swaggerExpress.register(app);

      var port = process.env.PORT || 10010;
      app.listen(port);

      if (swaggerExpress.runner.swagger.paths['/hello']) {
        console.log('try this:\ncurl http://127.0.0.1:' + port + '/hello?name=Scott');
      }
  }).catch( err => {
    console.log(err);
  });
});

module.exports = app; // for testing

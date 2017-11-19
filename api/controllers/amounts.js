'use strict';
/*
 'use strict' is not required but helpful for turning syntactical errors into true errors in the program flow
 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
*/

/*
 Modules make it possible to import JavaScript files into your application.  Modules are imported
 using 'require' statements that give you a reference to the module.

  It is a good idea to list the modules that your application depends on in the package.json in the project root
 */
var util = require('util');
const db = require('../../config/db');

/*
 Once you 'require' a module you can reference the things that it exports.  These are defined in module.exports.

 For a controller in a127 (which this is) you should export the functions referenced in your Swagger document by name.

 Either:
  - The HTTP Verb of the corresponding operation (get, put, post, delete, etc)
  - Or the operationId associated with the operation in your Swagger document

  In the starter/skeleton project the 'get' operation on the '/hello' path has an operationId named 'hello'.  Here,
  we specify that in the exports of this module that 'hello' maps to the function named 'hello'
 */
module.exports = {
  index:index,
  insert: insert,
  find: find,
  update: update
};

/*
  Functions in a127 controllers used for operations should take two parameters:

  Param 1: a handle to the request object
  Param 2: a handle to the response object
 */
function index(req, res) {
  db.isReady();

  db.getInstance().then(instance => {
      instance.getAll('amounts').then(docs => {
        res.send(docs);
      }).catch(err => {
        res.json(err.message);
      });
  }).catch( err => {
    res.json(err.message);
  });
}

function insert(req, res) {
  const amount = req.swagger.params.amount.value;
  amount['inserted'] = new Date();

  db.getInstance().then(instance => {
    instance.save(amount, 'amounts').then(doc => {
      res.send(doc);
    }).catch(err => {
      res.json(err.message);
    });
  });
}

function find(req, res) {
  const id = req.swagger.params.id.value;
  db.getInstance().then(instance => {
    instance.find(id, 'amounts').then(doc => {
      res.send(doc);
    }).catch(err => {
      res.json(err.message);
    });
  });
}

function update(req, res) {
  const id = req.swagger.params.id.value;
  const amountData = req.swagger.params.amount.value;
  db.getInstance().then(instance => {
    instance.update(id, amountData, 'amounts').then(doc =>{      
      res.send(doc);
    }).catch(err => {
      res.json(err.message);
    });

  });
}

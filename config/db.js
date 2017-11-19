'use strict';

//Include crypto to generate the id
const Promise = require('promise'),
  MongoClient = require('mongodb').MongoClient,
  ObjectID = require('mongodb').ObjectID,
  appConfig = require('config');

// Hack to delete swagger object that's been added automatically
delete appConfig.swagger;

const host = appConfig.get('db.host');

module.exports = (function () {

  // Instance stores a reference to the Singleton
  var instance;

  // Set the instance by:
  // - connecting to the DB
  // - defining public methods that will use db object
  function init() {
    return new Promise((resolve, reject) => {
      console.log('DB instance not ready yet');
      MongoClient.connect(host, function(err, db) {
        if (err) reject(err);
        console.log('DB instance initialized');

        instance = {
          getAll(collectionName){
            return new Promise((resolve, reject) => {
              const collection = db.collection(collectionName);
              collection.find().toArray(function(err, docs) {
                if(err) reject(err);

                const response = {
                  "collection" : collectionName,
                  "data" : docs
                }

                resolve(response);
              });
            });
          },
          save(doc, collectionName){
            return new Promise((resolve, reject) => {
              docData['updated'] = new Date();
              const collection = db.collection(collectionName);
              collection.insertOne(doc, function(err, res) {
                if (err) reject(err);

                const response = {
                  "collection": collectionName,
                  "data": doc
                };
                resolve(response);
              });
            });;

            resolve(response);
          },
          find(id, collectionName){
            return new Promise((resolve, reject) => {
              const collection = db.collection(collectionName);
              collection.findOne({
                  _id: ObjectID(id)
              }, function(err, doc) {
                  if(err) reject(err);

                  const response = {
                    "collection": collectionName,
                    "data": doc
                  }
                  resolve(response);
              })
            });
          },
          remove(id){
            console.log(`remove ${id}`);
          },
          update(id, docData, collectionName){
            return new Promise((resolve, reject) => {
              const collection = db.collection(collectionName);
              docData['updated'] = new Date();
              console.log(docData);
              collection.findAndModify(
                {"_id":ObjectID(id)},
                [],
                { "$set": docData },
                {update: true},
                function (err, doc, lastErrorObject) {
                  if(err) reject(err);

                  const response = {
                    "collection": collectionName,
                    "data": doc.value,
                    "operationDetails": doc.lastErrorObject
                  };

                  resolve(response);
              });
            });
          },
          hi() {
            console.log('instance says hello!');
          }
        };
        // Return the instance once finalized
        resolve(instance);
      });
    });
  };

  return {
    // Get the Singleton instance if one exists
    // or create one if it doesn't
    getInstance: function () {
      return new Promise((resolve, reject) => {
        if(!instance){
          init().then( instance => {
              console.log('instance freshly created');
              resolve(instance);
          }).catch(err => {
            reject(err);
          });
        } else {
          console.log('instance already existing');
          resolve(instance);
        }
      });
    },
    hi: function() {
      console.log('outside says hello!');
    },
    isReady: function () {
      console.log(`DB is ready ? ${instance !== undefined}`);
      return instance !== undefined;
    }
  };
})();

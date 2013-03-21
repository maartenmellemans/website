var moment = require('moment');

// Module dependencies
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Pics = require('./models/pics');

var uristring = 
    process.env.MONGODB_URI || 
    process.env.MONGOLAB_URI || 
    'mongodb://localhost/ws2';

var mongoOptions = { db: { safe: true }};
   
mongoose.connect(uristring, mongoOptions, function (err, res) {
  if (err) { 
    console.log ('ERROR connecting to: ' + uristring + '. ' + err);
  } else {
    console.log ('Succeeded connected to: ' + uristring);
  }
});

// connect to database
module.exports = {

  getPictures: function (callback) {
    Pics.find({}, function (err, pictures) {
      console.log(err);
      callback(null,pictures);
    })
  },

  savePicture: function (data, callback) {
    var newPicture = new Pics ({
          "title":data.title,
          "filename":data.filename,
          "location":data.location,
          "numberOfPeople":data.numberOfPeople,
          "series":data.series,
          "cameraLook":data.cameraLook,
          "featured":data.featured,
          "gender":data.gender,
          "blackWhite":data.blackWhite
    });
    newPicture.save(function (err) {
      if(err) {
        throw err;
      } else {
        console.log("pictured saved succesfull")
        callback(null)
      }
    })
  },

  updatePicture: function (data, callback) {
    Pics.findById(data._id, function (err, picture) {
      picture.title = data.picture;
      picture.filename = data.filename;
      picture.location = data.location;
      picture.numberOfPeople = data.numberOfPeople;
      picture.series = data.series;
      picture.cameraLook = data.cameraLook;
      picture.featured = data.featured;
      picture.blackWhite = data.blackWhite;
      picture.gender = data.gender;
      picture.latestEdit = moment()._d;

      picture.save(function(err) {
          if (err) {
              console.log('error updating picture');
              console.log(err);
          } else {
              console.log('picture successfully updated');
          }
      });
    });
  }
}

//FOR EACH HELPER
function forEach(collection, callBack) {
        var
            i = 0, // Array and string iteration
            iMax = 0, // Collection length storage for loop initialisation
            key = '', // Object iteration
            collectionType = '';
 
        // Verify that callBack is a function
        if (typeof callBack !== 'function') {
            throw new TypeError("forEach: callBack should be function, " + typeof callBack + "given.");
        }
 
        // Find out whether collection is array, string or object
        switch (Object.prototype.toString.call(collection)) {
        case "[object Array]":
            collectionType = 'array';
            break;
 
        case "[object Object]":
            collectionType = 'object';
            break;
 
        case "[object String]":
            collectionType = 'string';
            break;
 
        default:
            collectionType = Object.prototype.toString.call(collection);
            throw new TypeError("forEach: collection should be array, object or string, " + collectionType + " given.");
        }
 
        switch (collectionType) {
        case "array":
            for (i = 0, iMax = collection.length; i < iMax; i += 1) {
                callBack(collection[i], i);
            }
            break;
 
        case "string":
            for (i = 0, iMax = collection.length; i < iMax; i += 1) {
                callBack(collection.charAt(i), i);
            }
            break;
 
        case "object":
            for (key in collection) {
                // Omit prototype chain properties and methods
                if (collection.hasOwnProperty(key)) {
                    callBack(collection[key], key);
                }
            }
            break;
 
        default:
            throw new Error("Continuity error in forEach, this should not be possible.");
        }
 
        return null;
    }

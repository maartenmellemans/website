var EMAIL = require('./email');
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

  // save a user
  saveUser: function(userInfo, callback) {
    checkUnique(userInfo, function(data) {
      if(data) {
        var newUser = new Users ({
          name : { first: userInfo.fname, last: userInfo.lname }
        , username: userInfo.username
        , usernameLowercase: userInfo.username.toLowerCase()
        , email: userInfo.email
        , password: userInfo.password
        , journal: []
        });

        newUser.save(function(err) {
          if (err) {throw err;}
          EMAIL.subscribeEmail(userInfo.email);
          EMAIL.sendMandrillSignup(userInfo.username, userInfo.email);
          callback(null, userInfo);
        });
      } else {
        callback(null, null);
      }
    });
  },

  // disconnect from database
  closeDB: function() {
    mongoose.disconnect();
  },

  getResetPass: function(username, callback) {
    Users.findOne({usernameLowercase:username.toLowerCase()}, function(err, user) {
      if(user == null) {
        callback("User not found. Please try again.",null)
      } else {
        user.resetKey = generateKey();
        user.save(function(err) {
            if (err) {
                console.log('error adding pass reset key');
                callback("Something went wrong. Please try again.", null);
            } else {
                console.log('resetkey successfully saved');
                EMAIL.sendMandrillResetPassword(user.username, user.email, user.resetKey);
                callback(null, user);
            }
        });
      }
    });
  },

  resetPass: function(resetKey, password, callback) {
    Users.findOne({resetKey:resetKey}, function(err, user) {
      if(user == null) {
        callback("Reset ID not correct. Please try again.",null);
      } else {
        user.password = password;
        user.resetKey = null;
        user.save(function(err) {
            if (err) {
                console.log('error password reset');
                callback("Something went wrong. Please try again.", null)
            } else {
                console.log('new password successfully saved');
                callback(null, null);
            }
        });
      }
    });
  },
 
  setLatestLogin: function(userid) {
    Users.findById(userid, function (err,user) {
      user.latestLogin = moment()._d;
      user.save(function(err) {
          if (err) {
              console.log('error adding latest login');
              console.log(err);
          } else {
              console.log('latest login successfully saved');
          }
      });
    });
  },

  saveJournalEntry: function(journalEntry, callback) {
    Users.findById(journalEntry.userid, function (err, user) {

      var time_passed = moment().diff(user.latestEntry, 'seconds');
      user.allowance += time_passed * (rate / per);
      if (user.allowance > rate) {
         user.allowance = rate;
      }
      if (user.allowance < 1.0) {
        console.log("rate reached");
        callback(true,null);
      } else {
        console.log("rate ok");
        user.allowance -= 1.0;
        user.journal.push(
          {content:journalEntry.text}
        );
        user.latestEntry = moment()._d;
        user.save(function(err) {
            if (err) {
                console.log('error adding new journalEntry');
                console.log(err);
            } else {
                console.log('journalEntry successfully saved');
                callback(false,user);
            }
        });
      }
    });
  },

  updateProfile: function(profile, callback) {
    Users.findById(profile._id, function (err, user) {
      if (profile.passwordNew != undefined) {
        user.password = profile.passwordNew;
      }
      user.name.first = profile.name.first;
      user.name.last = profile.name.last;
      user.email = profile.email;
      user.discoverableByEmail = profile.discoverableByEmail;
      user.isPrivate = profile.isPrivate;
      user.save(function(err) {
          if (err) {
              console.log('error updating profile');
              console.log(err);
              callback(false);
          } else {
              console.log('profile successfully updated');
              callback(true);
          }
      });
    });
  },

  getJournal: function(username, callback) {
    Users.findOne({usernameLowercase:username.toLowerCase()}, function(err, user) {
      var time_passed = moment().diff(user.latestEntry, 'seconds');
      user.allowance += time_passed * (rate / per);
      if (user.allowance > rate) {
         user.allowance = rate;
      }
      if (user.allowance < 1.0) {
        user.allowance = 0;
      }
      callback(user);
    })
  },

  getProfile: function(id, callback) {
    Users.findById(id, function(err, user) {
      callback(user);
    })
  },

  getUsernamesEmails: function(callback) {
    var usernamesEmails = {
      usernames:[],
      emails:[]
    }

    Users.find({}, 'usernameLowercase', function(err, usernames) {
      usernamesEmails.usernames = usernames;

      Users.find({}, 'email', function(err, emails) {
        usernamesEmails.emails = emails;
        callback(usernamesEmails);
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

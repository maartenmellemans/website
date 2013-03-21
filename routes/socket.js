/*
 * Serve content over a socket
 */
var DB = require('../accessDB');

// SOCKET LISTENERS
module.exports = function (socket) {

	socket.on('init:send', function() {
		DB.getPictures(function (err, data) {
			console.log(err);
			socket.emit('init:return', {
				pictures:data
			});
		});
	});

	socket.on('picture:save', function (data) {
		DB.savePicture(data.picture, function (err) {
			console.log(err);
		})
	})
};


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

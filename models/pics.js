
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Define schema
var PictureSchema = new Schema({
    title: { type: String }
  , filename: { type: String, required: true}
  , added: { type: Date, default: Date.now, required: true }
  , latestEdit: { type: Date }
  , tags: { type: Array }
  , gender: { type: String }
  , location: { type: String }
  , cameraLook: { type: Boolean }
  , numberOfPeople: { type: Number }
  , series: { type: String }
  , featured: { type: Boolean, default: false }
  , blackWhite: { type: Boolean }
});

module.exports = mongoose.model('Picture', PictureSchema);
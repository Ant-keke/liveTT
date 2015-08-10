'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PlayerSchema = new Schema({
  firstname: String,
  lastname: String,
  points: Number
});

module.exports = mongoose.model('Player', PlayerSchema);
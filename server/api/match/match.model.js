'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var MatchSchema = new Schema({
  name: String,
  body: String,
  score: {
  	dom: { type: Number, min: 0, max: 18 },
  	ext: { type: Number, min: 0, max: 18 }
  },
  active: Boolean
});

module.exports = mongoose.model('Match', MatchSchema);
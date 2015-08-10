'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TeamSchema = new Schema({
  match: {type: Schema.Types.ObjectId, ref:'Match'},
  name: String,
  score: { type: Number, min: 0, max: 18, default: 0 },
  players: [{type: Schema.Types.ObjectId, ref:'Player'}]
});

module.exports = mongoose.model('Team', TeamSchema);
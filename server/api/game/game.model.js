'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var GameSchema = new Schema({
  dom: [{type: Schema.Types.ObjectId, ref:'Player'}],
  ext: [{type: Schema.Types.ObjectId, ref:'Player'}],
  score: {},
  created: {type: Date, default: Date.now},
  author: {type: Schema.Types.ObjectId, ref: 'User'},
  winner: String
});

module.exports = mongoose.model('Game', GameSchema);
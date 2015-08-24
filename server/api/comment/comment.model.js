'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CommentSchema = new Schema({
  body: String,
  info: String,
  active: Boolean,
  match: {type: Schema.Types.ObjectId, ref:'Match'},
  author: {type: Schema.Types.ObjectId, ref: 'User'},
  created: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Comment', CommentSchema);
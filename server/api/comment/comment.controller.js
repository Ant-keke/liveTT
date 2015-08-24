'use strict';

var _ = require('lodash');
var Comment = require('./comment.model');
var User = require('../user/user.model');
var Match = require('../match/match.model');

// Get list of comments
exports.index = function(req, res) {
  Comment.find(function (err, comments) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(comments);
  });
};

// Get a single comment
exports.show = function(req, res) {
  Comment.findById(req.params.id, function (err, comment) {
    if(err) { return handleError(res, err); }
    if(!comment) { return res.status(404).send('Not Found'); }
    return res.json(comment);
  });
};

// Creates a new comment in the DB.
exports.create = function(req, res) {
  req.body.author = User.findById(req.body.author).then(function(author){
    req.body.author = author;
    Match.findById(req.body.match).then(function(match){
      req.body.match = match;
      Comment.create(req.body, function(err, comment) {
        comment.populate('author', function (err, comment) {
          if(err) { return handleError(res, err); }
          return res.status(201).json(comment);
        });      
      });
    });
  })
};

// Updates an existing comment in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Comment.findById(req.params.id, function (err, comment) {
    if (err) { return handleError(res, err); }
    if(!comment) { return res.status(404).send('Not Found'); }
    var updated = _.merge(comment, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(comment);
    });
  });
};

// Deletes a comment from the DB.
exports.destroy = function(req, res) {
  Comment.findById(req.params.id, function (err, comment) {
    if(err) { return handleError(res, err); }
    if(!comment) { return res.status(404).send('Not Found'); }
    comment.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}
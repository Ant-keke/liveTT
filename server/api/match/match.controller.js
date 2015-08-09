/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /matchs              ->  index
 * GET     /matchs/active       ->  active
 * POST    /matchs              ->  create
 * GET     /matchs/:id          ->  show
 * PUT     /matchs/:id          ->  update
 * DELETE  /matchs/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var Match = require('./match.model');
var User = require('../user/user.model');
var Team = require('../team/team.model');

// Get list of matchs
exports.index = function(req, res) {
  Match.find({}).populate('team.dom team.ext').populate('author','username').exec(function (err, matchs) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(matchs);
  });
};

// Get a single match
exports.show = function(req, res) {
  Match.findById(req.params.id).populate('team.dom team.ext').populate('author','username').exec(function (err, data) {
    if(err) { return handleError(res, err); }
    if(!data) { return res.status(404).send('Not Found'); }
    data.populate({path:'team.dom.players team.ext.players',model:'Player'}, function(err, match){
      if(err) { return handleError(res, err); }
      return res.json(match);
    })
  });
};

// Creates a new match in the DB.
exports.create = function(req, res) {
  //Init Teams
  User.findById(req.body.author, function (err, user) {
    if (err) { return handleError(res, err); }
    req.body.author = user;
  });
  req.body.team.dom = new Team({ name: req.body.team.dom.name});
  req.body.team.ext = new Team({ name: req.body.team.ext.name});
  req.body.team.dom.save();
  req.body.team.ext.save();
  Match.create(req.body, function(err, match) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(match);
  });
};

// Updates an existing match in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Match.findById(req.params.id, function (err, match) {
    if (err) { return handleError(res, err); }
    if(!match) { return res.status(404).send('Not Found'); }
    var updated = _.merge(match, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(match);
    });
  });
};

// Deletes a match from the DB.
exports.destroy = function(req, res) {
  Match.findById(req.params.id, function (err, match) {
    if(err) { return handleError(res, err); }
    if(!match) { return res.status(404).send('Not Found'); }
    match.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}
'use strict';

var _ = require('lodash');
var Player = require('./player.model');

// Get list of players
exports.index = function(req, res) {
  Player.find(function (err, players) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(players);
  });
};

// Get a single player
exports.show = function(req, res) {
  Player.findById(req.params.id, function (err, player) {
    if(err) { return handleError(res, err); }
    if(!player) { return res.status(404).send('Not Found'); }
    return res.json(player);
  });
};

// Creates a new player in the DB.
exports.create = function(req, res) {
  Player.create(req.body, function(err, player) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(player);
  });
};

// Updates an existing player in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Player.findById(req.params.id, function (err, player) {
    if (err) { return handleError(res, err); }
    if(!player) { return res.status(404).send('Not Found'); }
    var updated = _.merge(player, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(player);
    });
  });
};

// Deletes a player from the DB.
exports.destroy = function(req, res) {
  Player.findById(req.params.id, function (err, player) {
    if(err) { return handleError(res, err); }
    if(!player) { return res.status(404).send('Not Found'); }
    player.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}
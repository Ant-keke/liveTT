'use strict';

var _ = require('lodash');
var Team = require('./team.model');
var Player = require('../player/player.model');

// Get list of teams
exports.index = function(req, res) {
  Team.find(function (err, teams) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(teams);
  });
};

// Get a single team
exports.show = function(req, res) {
  Team.findById(req.params.id, function (err, team) {
    if(err) { return handleError(res, err); }
    if(!team) { return res.status(404).send('Not Found'); }
    return res.json(team);
  });
};

// Creates a new team in the DB.
exports.create = function(req, res) {
  Team.create(req.body, function(err, team) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(team);
  });
};

// Add a new player in team and in DB.
exports.addPlayer = function(req, res) {
  var player = new Player(req.body);
  player.save();
  Team.findById(req.params.id, function (err, team) {
    team.players.push(player);
    team.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(player);
    });
  });
};

// Remove player from team and DB.
exports.removePlayer = function(req, res) {
  Team.findById(req.params.id, function (err, team) {
    var index = team.players.indexOf(req.params.pid);
    // Player.findById(req.params.pid, function(err){
      
    // })
    team.players.splice(index,1);
    team.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(player);
    });
  });
};


// Updates an existing team in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Team.findById(req.params.id, function (err, team) {
    if (err) { return handleError(res, err); }
    if(!team) { return res.status(404).send('Not Found'); }
    var updated = _.merge(team, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(team);
    });
  });
};

// Deletes a team from the DB.
exports.destroy = function(req, res) {
  Team.findById(req.params.id, function (err, team) {
    if(err) { return handleError(res, err); }
    if(!team) { return res.status(404).send('Not Found'); }
    team.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}
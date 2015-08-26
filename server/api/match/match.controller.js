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
var Game = require('../game/game.model');
var Player = require('../player/player.model');
var Comment = require('../comment/comment.model');
var promise = require('promise');

// Get list of matchs
exports.index = function(req, res) {
  Match.find({}).sort([['created', 'ascending']]).populate('team.dom team.ext').populate('author','username').exec(function (err, matchs) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(matchs);
  });
};

// Get a single match
exports.show = function(req, res) {
  Match.findById(req.params.id).populate('games team.dom team.ext comments').populate('author','username').exec(function (err, data) {
    if(err) { return handleError(res, err); }
    if(!data) { return res.status(404).send('Not Found'); }
    data.populate({path:'team.dom.players team.ext.players',model:'Player'}).populate({path:'comments.author',model:'User'},function (err, match){
      if(err) { return handleError(res, err); }
      return res.json(match);
    });
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
    user.matchs = user.matchs || [];
    user.matchs.push(match);
    user.save( function (err, user) {
        if(err) { return handleError(res, err); }
        return res.status(201).json(match);
      });
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





// Addgame in a match in the DB.
exports.addGame = function(req, res) {
  Match.findById(req.params.id, function (err, match) {
    if (err) { return handleError(res, err); }
    if(!match) { return res.status(404).send('Not Found'); }
    var dom = [];
    var ext = [];
    for (var i = 0; i < req.body.dom.length; i++) {
      dom[i] = Player.findById(req.body.dom[i]);
    };
    for (var i = 0; i < req.body.ext.length; i++) {
      ext[i] = Player.findById(req.body.ext[i]);
    };
    promise.all(dom).then(function(res){
      dom = res;
      return true;
    }).then(function(){
      promise.all(ext).then(function(res){
        ext = res;
        return true;
      }).then(function(){
        Game({
          dom: dom,
          ext: ext,
          match: match,
          score: req.body.score
        }).save().then(function(game){
          match.games = match.games || [];
          match.games.push(game);
          match.save(function (err) {
            game.populate("dom ext", function(err,game){
              if (err) { return handleError(res, err); }
              return res.status(200).json(game);
            });
          })
        },function(err){
          return res.status(400).send('Game not added');
        });
      })
    })
  });
};

// Updates an existing match in the DB.
exports.deleteGame = function(req, res) {
  Match.findById(req.params.id, function (err, match) {
    if (err) { return handleError(res, err); }
    if(!match) { return res.status(404).send('Not Found'); }
    Game.findById(req.body._id,function( err, game) {
      game.remove();
      match.games.push(game);
      match.save(function (err) {
        if (err) { return handleError(res, err); }
        return res.status(200);
      });
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


// Deletes a match from the DB.
exports.deletePlayer = function(req, res) {
  Match.findById(req.params.id, function (err, match) {
    if(err) { return handleError(res, err); }
    if(!match) { return res.status(404).send('Not Found'); }
    var domId = match.team.dom.players.indexOf(req.params.pid);
    var extId = match.team.ext.players.indexOf(req.params.pid);
    if(domId != -1) {
      match.team.dom.players.splice(domId,1);
    } else if(extId != -1) {
      match.team.ext.players.splice(extId,1);
    }
    match.save().then(function() {
      Player.findById(req.body.pid, function (err, player) {
        player.remove(function(err) {
          if(err) { return handleError(res, err); }
          return res.status(204).send('No Content');
        });
      });
    })
  });
};


// Updates an existing match in the DB.
exports.updateActive = function(req, res) {
  Match.findById(req.params.id, function (err, match) {
    if (err) { return handleError(res, err); }
    if(!match) { return res.status(404).send('Not Found'); }
    match.active = req.body.active;
    match.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(match);
    });
  });
};


// Updates an existing match in the DB.
exports.followMatch = function(req, res) {
  Match.findById(req.params.id, function (err, match) {
    if (err) { return handleError(res, err); }
    if(!match) { return res.status(404).send('Not Found'); }
    User.findById(req.body.user, function (err, user) {
      user.follow = user.follow || [];
      user.follow.push(match);
      user.save(function (err) {
        if (err) { return handleError(res, err); }
        return res.status(200).send("Match correctement ajouté aux favoris");
      });
    })
  });
};

// Updates an existing match in the DB.
exports.unfollowMatch = function(req, res) {
  User.findById(req.body.user, function (err, user) {
    var id = user.follow.indexOf(req.params.id);
    if(id >= 0) {
      user.follow.splice(id,1);
      user.save(function (err) {
        if (err) { return handleError(res, err); }
        return res.status(200).send("Match correctement retiré des favoris");
      });
    } else {
        return res.status(301).send("Match non trouvé");
    }
  });
};

// Updates an existing match in the DB.
exports.followedMatch = function(req, res) {
  User.findById(req.params.userId).populate('followed', function (err, user) {
    if (err) { return handleError(res, err); }
    return res.status(200).json(user.followed);
  })
};



function handleError(res, err) {
  return res.status(500).send(err);
}
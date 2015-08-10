/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var Team = require('../api/team/team.model');
var Match = require('../api/match/match.model');
var User = require('../api/user/user.model');
var Player = require('../api/player/player.model');
var Game = require('../api/game/game.model');
var Promise = require('promise');


var dom,ext;
var admin, test;
var pdom = [] ;
var pext = [] ;


Player.find({}).remove(function() {
  var players = [
    new Player({
     lastname :"BEN YAHIA",
     firstname :"Kerem",
     points :2434
    }).save(),
    new Player({
     lastname :"DJAHANBINI",
     firstname :"Alexandre",
     points :2100
    }).save(),
    new Player({
     lastname :"HUBLI",
     firstname :"Rajat",
     points :2423
    }).save(),
    new Player({
     lastname :"PHAM",
     firstname :"Emmanuel",
     points :2199
    }).save(),
    new Player({
     lastname :"LI",
     firstname :"Yong",
     points :2519
    }).save(),
    new Player({
     lastname :"BRIGAULT",
     firstname :"Alexandre",
     points :2049
    }).save(),
    new Player({
     lastname :"ZHU",
     firstname :"Hong-Bin",
     points :2542
    }).save(),
    new Player({
     lastname :"LETARD",
     firstname :"Gilbert",
     points :2056
    }).save()];

    return Promise.all(players).then(function(res){
      pdom = res.slice(0,4);
      pext = res.slice(4,8);
    });
}).then(function(){
  Team.find({}).remove(function() {
    dom = new Team({
     name :"Roche Lez Beaupre",
     score :7,
     players: pdom
    });
    dom.save(); 
    ext = new Team({
     name :"Sochaux",
     score :4,
     players: pext
    });
    ext.save();
  }).then(function(){
    User.find({}).remove(function() {
      test = new User({
        provider: 'local',
        username: 'Test User',
        password: 'testtest'
      });
      admin = new User({
        provider: 'local',
        role: 'admin',
        username: 'Admin',
        password: 'admin1'
      })
      admin.save();
      test.save();
    }).then(function(){
      Match.find({}).remove(function() {
        Match.create({
          date : Date(2015, 09, 14),
          division : 'N1',
          name : 'Match Important a domicile',
          team: {
            dom: dom,
            ext: ext
          },
          author: admin,
          body : 'Integration with popular tools such as Bower, Grunt, Karma, Mocha, JSHint, Node Inspector, Livereload, Protractor, Jade, Stylus, Sass, CoffeeScript, and Less.'
        }, {
          date : Date(2015, 09, 15),
          division : 'PR',
          name : 'Server and Client integration',
          body : 'Built with a powerful and fun stack: MongoDB, Express, AngularJS, and Node.',
          author: test,
          team: {
            dom: dom,
            ext: ext
          }
        });
      });
    });
  });
});

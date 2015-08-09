/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var Team = require('../api/team/team.model');
var Match = require('../api/match/match.model');
var User = require('../api/user/user.model');


var dom,ext;

Team.find({}).remove(function() {
  dom = new Team({
   name :"Roche Lez Beaupre",
   score :7,
  });
  dom.save(); 
  ext = new Team({
   name :"Sochaux",
   score :4,
  });
  ext.save();
});

Match.find({}).remove(function() {
  Match.create({
    name : 'Match Important a domicile',
    team: {
      dom: dom,
      ext: ext
    },
    body : 'Integration with popular tools such as Bower, Grunt, Karma, Mocha, JSHint, Node Inspector, Livereload, Protractor, Jade, Stylus, Sass, CoffeeScript, and Less.'
  }, {
    name : 'Server and Client integration',
    body : 'Built with a powerful and fun stack: MongoDB, Express, AngularJS, and Node.',
    team: {
      dom: dom,
      ext: ext
    }
  });
});

User.find({}).remove(function() {
  User.create({
    provider: 'local',
    username: 'Test User',
    password: 'testtest'
  }, {
    provider: 'local',
    role: 'admin',
    username: 'Admin',
    password: 'admin1'
  }, function() {
      console.log('finished populating users');
    }
  );
});
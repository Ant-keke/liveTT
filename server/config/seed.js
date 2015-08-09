/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var Team = require('../api/team/team.model');
var Match = require('../api/match/match.model');
var User = require('../api/user/user.model');


var dom,ext;
var admin, test;


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
});

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

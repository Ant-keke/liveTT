/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var Match = require('../api/match/match.model');
var User = require('../api/user/user.model');

Match.find({}).remove(function() {
  Match.create({
    name : 'Development Tools',
    score: {
      dom: 7,
      ext: 7,
    },
    body : 'Integration with popular tools such as Bower, Grunt, Karma, Mocha, JSHint, Node Inspector, Livereload, Protractor, Jade, Stylus, Sass, CoffeeScript, and Less.'
  }, {
    name : 'Server and Client integration',
    score: {
      dom: 4,
      ext: 9,
    },
    body : 'Built with a powerful and fun stack: MongoDB, Express, AngularJS, and Node.'
  }, {
    name : 'Smart Build System',
    score: {
      dom: 3,
      ext: 1,
    },
    body : 'Build system ignores `spec` files, allowing you to keep tests alongside code. Automatic injection of scripts and styles into your index.html'
  },  {
    name : 'Modular Structure',
    score: {
      dom: 10,
      ext: 8,
    },
    body : 'Best practice client and server structures allow for more code reusability and maximum scalability'
  },  {
    name : 'Optimized Build',
    body : 'Build process packs up your templates as a single JavaScript payload, minifies your scripts/css/images, and rewrites asset names for caching.'
  },{
    name : 'Deployment Ready',
    body : 'Easily deploy your app to Heroku or Openshift with the heroku and openshift subgenerators'
  });
});

User.find({}).remove(function() {
  User.create({
    provider: 'local',
    username: 'Test User',
    password: 'test'
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
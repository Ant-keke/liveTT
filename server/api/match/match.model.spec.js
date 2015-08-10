'use strict';

var should = require('should');
var app = require('../../app');
var User = require('../user/user.model');
var Match = require('./match.model');

var user = new User({
  provider: 'local',
  username: 'Fake User',
  password: 'password'
});

var match = new Match({
  name: 'New match',
  body: 'Description of this new match',
  date: Date.now(),
  division: 'PR',
  author: user
});

describe.only('Match Model', function() {
  before(function(done) {
    // Clear matchs before testing
    Match.remove().exec().then(function() {
      done();
    });
  });

  afterEach(function(done) {
    Match.remove().exec().then(function() {
      done();
    });
  });

  it('should begin with no matchs', function(done) {
    Match.find({}, function(err, matchs) {
      matchs.should.have.length(0);
      done();
    });
  });

  it('should save one match', function(done) {
    match.save(function(err, match){
    	should.not.exist(err);
    }).then(function(){
	    Match.find({}, function(err, matchs) {
	      matchs.should.have.length(1);
	      done();
	    });
    })
  });

  it('should fail when saving without a name', function(done) {
    match.name = '';
    match.save(function(err) {
      should.exist(err);
      done();
    });
  });

});

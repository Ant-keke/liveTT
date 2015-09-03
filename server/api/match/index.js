'use strict';

var express = require('express');
var controller = require('./match.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', controller.index);
router.get('/me', auth.isAuthenticated(), controller.myMatchs);
router.get('/active', controller.activeMatchs);
router.get('/coming', controller.comingMatchs);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.put('/:id/active', controller.updateActive);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);
router.delete('/:id/player/:pid', controller.deletePlayer);
router.post('/:id/games', controller.addGame);

router.put('/:id/follow', controller.followMatch);
router.put('/:id/unfollow', controller.unfollowMatch);
router.get('/followed/:userId', controller.followedMatch);

module.exports = router;
'use strict';

var express = require('express');
var controller = require('./match.controller');

var router = express.Router();

router.get('/', controller.index);
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
router.put('/followed/:userId', controller.followedMatch);


module.exports = router;
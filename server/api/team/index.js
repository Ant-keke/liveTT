'use strict';

var express = require('express');
var controller = require('./team.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);
router.delete('/:id/player/:pid', controller.deletePlayer);
router.post('/:id/player', controller.addPlayer);

module.exports = router;
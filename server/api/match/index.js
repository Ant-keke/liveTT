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
router.post('/:id/games', controller.addGame);

module.exports = router;
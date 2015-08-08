/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var match = require('./match.model');

exports.register = function(socket) {
  match.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  match.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('match:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('match:remove', doc);
}
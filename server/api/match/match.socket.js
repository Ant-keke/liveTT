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
  doc.populate('games team.dom team.ext comments').populate('author','username', function (err, data) {
    data.populate({path:'team.dom.players team.ext.players',model:'Player'}).populate({path:'comments.author',model:'User'},function (err, match){
		socket.emit( match._id + ':save', match);
	});
});
}

function onRemove(socket, doc, cb) {
  socket.emit(match._id + ':remove', doc);
}
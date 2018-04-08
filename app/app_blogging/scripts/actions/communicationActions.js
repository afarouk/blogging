'use strict';

var gateway = require('../APIGateway/gateway'),
	sessionActions = require('./sessionActions');

var getUID = function () {
    return sessionActions.getCurrentUser().getUID();
};

module.exports = {
	getMessages: function(uuid) {
		return gateway.sendRequest('retrieveCommentsOnBloggingQuestion', {
			UID: getUID(),
			count: 5,
			threadUUID: uuid
		});
	},

	getNextMessages: function(options) {
		// TODO: change API
		return gateway.sendRequest('retrieveCommentsOnBloggingQuestion', {
			UID: getUID(),
			threadUUID: options.contestUUID,
			previousId: options.previousId
		});
	},

	postComment: function(options) {
		var payload = {
			postbody: options.messageBody,
			authorId: options.authorId,
			toServiceAccommodatorId: window.community.serviceAccommodatorId,
			toServiceLocationId: window.community.serviceLocationId,
			urgent: options.urgent,
			communicationId: options.communicationId,
			inReplyToMessageId: options.inReplyToMessageId
		};
		return gateway.sendRequest('sendMessageToSASL', {
			UID: getUID(),
			payload: payload
		});
	},

	deleteComment: function(options) {
		return gateway.sendRequest('deleteCommentOnPostFromSASL', {
			UID: getUID(),
			threadUUID: options.communicationId,
			messageId: options.messageId
		});
	},

	flagComment: function(options) {
		return gateway.sendRequest('flagCommentOnPostFromSASL', {
			UID: getUID(),
			threadUUID: options.communicationId,
			messageId: options.messageId
		});
	}
}

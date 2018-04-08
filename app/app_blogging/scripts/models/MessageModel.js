'use strict';

var MessageModel = Backbone.Model.extend({
	defaults: {
		showMessageInput: false,
		showReply: true,
		fromUser: false,
		messageId: 1,
		messageBody: '',
		authorId: '',
		userName: '',
		communicationId: '',
		inReplyToMessageId: 1,
		timeStamp: ''
	}
});

module.exports = MessageModel;

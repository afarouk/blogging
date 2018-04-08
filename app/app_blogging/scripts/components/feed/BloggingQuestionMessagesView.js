'use strict';

var moment = require('moment');

var template = require('ejs!./templates/messageItem.ejs');

var MessageModel = require('../../models/MessageModel');

var MessageItemView = Mn.ItemView.extend({

	template: template,

	tagName: 'li',

	attributes: function() {
		return {
			messageId: this.model.get('messageId'),
			threadUUID: this.model.get('communicationId')
		}
	},

	ui: {
		postComment: '.post_comment',
		messageBody: '.message_body',
		messageLength: '.reply_comment_field .message_length',
		reply: '.reply',
		replyCommentField: '.reply_comment_field',
		postReplyComment: '.reply_comment_field a',
		messageReplyBody: '.reply_comment_field textarea',
		flagComment: '.flag_comment',
		deleteComment: '.trash'
	},

	events: {
		'click @ui.postComment': 'postComment',
		'click @ui.reply': 'showReplyField',
		'click @ui.postReplyComment': 'postComment',
		'keyup @ui.messageReplyBody': 'calculateMessageLength',
		'click @ui.flagComment': 'flagComment',
		'click @ui.deleteComment': 'deleteComment'
	},

	initialize: function() {
		this.timeAgo = moment(this.model.get('timeStamp')).fromNow();
	},

	onShow: function() {
		var displayOffset = this.model.get('inReplyToMessageId');
		var marginLeft;
		displayOffset > 1 ? marginLeft = 20 : marginLeft = 0;

		// temporary decision to show deep replies
		if (this.$el.width() < 400 && marginLeft > 180) {
			marginLeft = 180;
		}
		this.ui.messageBody.css('margin-left', marginLeft + 'px');
	},

	serializeData: function() {
		return {
			user: this.options.user,
			message: this.model.toJSON(),
			timeAgo: this.timeAgo
		};
	},

	postComment: function() {
		var options = {
            messageBody: this.ui.messageReplyBody.val(),
            inReplyToMessageId: this.model.get('messageId'),
            authorId: this.options.user.UID,
            communicationId: this.model.get('communicationId'),
            urgent: false
        };
		this.trigger('postComment', options);
	},

	deleteComment: function() {
		var options = {
			communicationId: this.model.get('communicationId'),
			messageId: this.model.get('messageId')
		};
		this.trigger('deleteComment', options);
	},

	flagComment: function() {
		var options = {
			communicationId: this.model.get('communicationId'),
			messageId: this.model.get('messageId')
		};
		this.trigger('flagComment', options);
	},

	showReplyField: function() {
		if (this.expandedReply) {
			this.expandedReply = false;
			this.onHideReplyField();
			this.trigger('showRootCommentField');
			return;
		}
		this.trigger('hideRootCommentField');
		this.trigger('hideOpenedReply');
		this.ui.replyCommentField.slideDown();
		this.expandedReply = true;
	},

	onHideReplyField: function() {
		this.ui.replyCommentField.slideUp();
	},

	calculateMessageLength: function(e) {
        var message = this.ui.messageReplyBody.val(),
            counter = message.length,
            enters = message.match(/(\r\n|\n|\r)/g);
        if (enters) {
            counter += enters.length;
        }
        this.ui.messageLength.html(counter);

		this.ui.messageReplyBody.css('height', 0);
        var height = this.ui.messageReplyBody[0].scrollHeight + 2;
        this.ui.messageReplyBody.css({
            overflow: 'hidden',
            height: height + 'px'
        });
    }
});

var BloggingQuestionMessagesView = Mn.CollectionView.extend({

	tagName: 'ul',

	className: 'messages_list',

	childView: MessageItemView,

	childEvents: {
		'postComment': 'postComment',
		'hideRootCommentField': 'hideRootCommentField',
		'hideOpenedReply': 'hideOpenedReply',
		'showRootCommentField': 'showRootCommentField',
		'flagComment': 'flagComment',
		'deleteComment': 'deleteComment'
	},

	childViewOptions: function() {
		return {
			user: this.options.user,
			parent: this.options.parent
		};
	},

	hideRootCommentField: function() {
		this.trigger('hideRootCommentField');
	},

	showRootCommentField: function() {
		this.trigger('showRootCommentField');
	},

	hideOpenedReply: function(view) {
		if (this.viewWithExpandedReply) {
			this.viewWithExpandedReply.triggerMethod('hideReplyField');
		}
		this.viewWithExpandedReply = view;
	},

	postComment: function(view, options) {
		this.trigger('postComment', this.options.parent, options);
	},

	flagComment: function(view, options) {
		this.trigger('flagComment', this.options.parent, options);
	},

	deleteComment: function(view, options) {
		this.trigger('deleteComment', this.options.parent, options);
	}

});

module.exports = BloggingQuestionMessagesView;

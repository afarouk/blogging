'use strict';

var template = require('ejs!./templates/bloggingQuestion.ejs'),
    loader = require('../../loader'),
    moment = require('moment'),
    bloggingQuestionCategoriesView = require('./BloggingQuestionCategories'),
    bloggingQuestionTagsView = require('./BloggingQuestionTags'),
    communicationActions = require('../../actions/communicationActions'),
    jqPlotOptions = require('./jqPlotOptions'),
    answerCountView = require('./AnswerCountView');

var BloggingQuestionView = Mn.LayoutView.extend({

    template: template,

    regions: {
        blogging_question_expanded_menu: '.blogging_question_expanded_menu',
        blogging_question_answers: '.blogging_question_answers',
        popup_region: '.blogging_question_answer_details',
        messages_region: '.messages_region'
    },

    tagName: 'li',

    id: function() {
        return this.model.get('id');
    },

    moment: moment,

    ui: {
        bloggingQuestion: '.blogging_question',
        questionBody: '.questionBody',
        bloggingQuestionCategories: '.blogging_question_categories_button',
        bloggingQuestionTags: '.blogging_question_tags_button',
        bloggingQuestionDetailed: '.blogging_question_detailed',
        closeCategories: '.blogging_question_categories_close',
        closeTags: '.blogging_question_tags_close',
        answer: '.blogging_question_answer',
        answerInput: '.blogging_question_answer input',
        likesButton: '.blogging_question_likes_button',
        likesIcon: '.blogging_question_likes_icon',
        likeCount: '.blogging_question_likes_count',
        shareButton: '.blogging_question_share_button',
        answerBar: '#answerBar',
        answeredMask: '.blogging_question_answered_mask',
        infoIcon: '.show_hide_answer_info',
        messageIcon: '.blogging_question_comment_button',
        messages: '.blogging_question_messages',
        messagesCount: '.blogging_question_comment_count',
        rootCommentField: '.root_comment_field',
        postRootComment: '.root_comment_field a',
        messageBody: '.root_comment_field textarea',
        messageLength: '.message_length',
        nextMessagesButton: '.next_button a'
    },

    events: {
        'click @ui.bloggingQuestionCategories': 'expandCategories',
        'click @ui.bloggingQuestionTags': 'expandTags',
        'click @ui.likesButton': 'addLikeDislike',
        'click @ui.answer': 'checkIfUserCanAnswer',
        'click @ui.shareButton': 'openShareQuestionView',
        'click @ui.infoIcon': 'showAnswerInfo',
        'click @ui.messageIcon': 'getMessages',
        'click @ui.postRootComment': 'postRootComment',
        'keyup @ui.messageBody': 'calculateMessageLength',
        'click @ui.nextMessagesButton': 'showNextMessages'
    },

    initialize : function() {
        this.model.set('user', this.options.user);
        this.isLoggedin = this.options.user.getUID() === '' ? false : true;

        this.model.set('timeAgo', this.moment.utc(this.model.get('activationDate')).fromNow());
        /* AF: must use timezone */
        /*
        this.moment.tz.add("Etc/UTC|UTC|0|0|");
        var convertedActivationDate = moment.tz(this.model.get('activationDate'), 'Etc/UTC');
        this.model.set('timeAgo', convertedActivationDate.fromNow());
        */

        this.model.set('expMonthDayYear', this.moment.utc(this.model.get('expirationDate')).format('LL'));
        this.model.set('expTime', this.moment.utc(this.model.get('expirationDate')).format('LT'));
        this.id = this.model.get('id');
        this.listenTo(this.model, "change", this.modelEventHandler);
        this.isAnswered = this.model.isAnswered;
        this.isLiked = this.model.isLiked;
        this.currentLikes = this.model.get('likes');
        this.currentAnswerChecked=this.model.currentAnswerChecked;
        this.expandedMessages = false;
        //this.isAnswered = this.model.get('currentChoiceByUser') === -1 ? false : true;
        // this.isAnswered = true;

    },

    reinitialize: function(attrs, isCorrect) {
        this.model.set(attrs);
        this.model.set('timeAgo', this.moment.utc(this.model.get('activationDate')).fromNow());
        this.justAnswered = true;
        this.isAnswered = true;
        this.model.set('isAnswered',true);
        if (window.community.sharedblogging === true) {
            this.trigger('refreshPanels');
        }
        this.render();
    },

    // onBeforeRender: function() {
    //     this.model.attributes.choices[0].entryCountForThisChoice = 1;
    // },

    onRender: function() {
        // this.blogging_question_answers.show(new answerCountView({
        //     answers: this.model.get('totalAnswers')
        // }));

        if (this.model.get('activatedByUUID') === true) {
            this.ui.bloggingQuestion.addClass('activated_by_uuid');
        }
        if(this.model.highlighted===true){
            this.ui.bloggingQuestion.addClass('highlighted');
        }
        if (this.justAnswered===true) {
            this.ui.infoIcon.css('display', 'inline-block');
            this.ui.messages.show();
            setTimeout(_.bind(function() {
                this.showAnswerInfo();
            }, this), 500);
        }
        if(this.isAnswered===true){
          this.showMask();
          this.ui.infoIcon.css('display', 'inline-block');
          this.ui.messages.show();
        }
    },

    showMask:function() {
      this.ui.answeredMask.show();
    //   this.ui.answeredMask.click(function(e){
    //     /*absorb all clicks */
    //     e.preventDefault();
    //     e.stopPropagation();
      //
    //     return false;
    //   });
    },

    onUpdateCommentsCount: function(resp) {
        var count = resp.totalCommentCount || 0;
        this.ui.messagesCount.html(count);
        if (count === 0) {
            this.onHideMessages();
        }
    },

    onIsAnswered: function() {
        var choiceId = this.model.get('currentChoiceByUser'),
            answer = this.ui.answer.find('input[data-id="' + choiceId + '"]');
        answer.prop('checked', true);
        this.ui.answer.css('pointer-events', 'none');
        this.showMask();
    },

    modelEventHandler : function() {
        console.log(" Model event received");
        this.model.changedAttribute();
        this.render();
    },

    expandCategories: function() {
        this.blogging_question_expanded_menu.show(new bloggingQuestionCategoriesView({
            categories: this.model.get('categories')
        }));
    },

    expandTags: function() {
        this.blogging_question_expanded_menu.show(new bloggingQuestionTagsView({
            tags: this.model.get('tags')
        }));
    },

    openAnswerView: function(e) {
        var input = $(e.currentTarget).find('input'),
            choiceId = input.data('id'),
            isCorrect = (input.attr('cmtyx-answer-iscorrect') == 'true'),
            uuid = input.attr('name');

        //TODO bug with radio input !!!!!!
        input.prop('checked', true);
        input.addClass('checked');
        this.trigger('answerQuestion', choiceId, uuid, isCorrect, this);
        // this.showAnswerInfo();
        // loader.show('ANSWER');
    },

    showAnswerInfo: function() {
        this.ui.bloggingQuestion.addClass('active');
        this.trigger('collapseDetails');
        this.ui.bloggingQuestionDetailed.collapse('show');

        this.ui.bloggingQuestionDetailed.on('shown.bs.collapse', _.bind(function() {
            if (this.jqPlotCreated===true) return;

            var options = jqPlotOptions.options,
                colorChoices = jqPlotOptions.colorChoices;

            var array = [], a = [], b = [];
            _.each(this.model.get('choices'), function(choice) {
                a.push(choice.choiceId);
                b.push(choice.entryCountForThisChoice);
            });
            b.reverse();
            for (var i = 0; i < a.length; i++) {
                options.axes.yaxis.ticks[i] = a.length - i;
                array.push([b[i], a[i]]);
                options.seriesColors[i] = colorChoices[i];
            }
            var dataArray = [array];

            options.seriesDefaults.renderer = $.jqplot.BarRenderer;
            options.axes.yaxis.renderer = $.jqplot.CategoryAxisRenderer;
            options.axes.yaxis.rendererOptions.tickRenderer = $.jqplot.AxisTickRenderer;
            $.jqplot('answerBar' + this.model.get('uuid'), dataArray, options);
            this.jqPlotCreated = true;
        }, this));
        this.ui.answer.css('pointer-events', 'none');
    },

    checkIfUserCanAnswer: function(e) {
        // if (this.isAnswered) return;
        var input = $(e.currentTarget).find('input');
        input.prop('checked', false);
        this.trigger('checkIfUserLogged', _.bind(function(logged){
            if (logged || window.community.sharedblogging) {
                this.openAnswerView(e);
            } else {
                // this.model.set('isAnonymous', true);
                if (this.model.get('isAnonymous')) {
                    this.openAnswerView(e);
                } else {
                    this.onUserShouldLogin();
                }
            }
        }, this));
    },

    checkIfAnswered: function() {
        if (this.isAnswered) {
            this.showAnswerInfo();
        }
    },

    onUserShouldLogin: function() {
        loader.showFlashMessage('Please, sign in to answer.');
    },

    onCollapseDetailsInChild: function() {
        /* AF : adding fix, but I don't think I understand the
           actual problem. So, this is probably not going to work */
        $(this.ui.bloggingQuestion).removeClass('active');
        $(this.ui.bloggingQuestionDetailed).collapse('hide');
    },

    addLikeDislike: function() {
        if (this.isLoggedin===false) {
            var text = 'Please, login or create an account to like a question'
            this.trigger('showTextMessage', text);
            return;
        }
        if (this.isAnswered===true || this.justAnswered===true) {
            this.trigger('addLikeDislike', {
                uuid: this.model.get('uuid'),
                like: this.isLiked ? false : true
            }, this.model);
        } else {
            var text = 'Please, answer the question before liking';
            this.trigger('showTextMessage', text);
        }
    },

    onLikeStatusChanged: function() {
        if (this.isLiked) {
            this.ui.likesIcon.addClass('active');
        } else {
            this.ui.likesIcon.removeClass('active');
        }
        this.ui.likesIcon.prop('active', this.isLiked);
        this.ui.likeCount.html(this.model.get('likes'));
    },

    openShareQuestionView: function() {
        if (this.isLoggedin===false) {
            var text = 'Please, login or create an account to share question'
            this.trigger('showTextMessage', text);
            return;
        }
        if (this.isAnswered === true || this.justAnswered === true) {
            this.trigger('sharePopup:show', this.model);
        } else {
            var text = 'Please, answer the question before sharing';
            this.trigger('showTextMessage', text);
        }
    },

    getMessages: function() {
        if (this.isLoggedin===false) {
            var text = 'Please, login or create an account to leave a comment';
            this.trigger('showTextMessage', text);
            return;
        }
        if (this.isAnswered===true || this.justAnswered===true) {
            if (this.expandedMessages===false) {
                this.trigger('getMessages', this.model.get('uuid'));
            } else {
                this.onHideMessages();
            }
            // this.trigger('collapseMessages');
            this.onShowRootCommentField();
        } else {
            var text = 'Please, answer the question before commenting';
            this.trigger('showTextMessage', text);
        }
    },

    onShowMessages: function(view) {
        this.expandedMessages = true;
        this.messages_region.show(view);
        // var scrollTop = $('.blogging_feed_questions').scrollTop() - $('.blogging_feed_questions').offset().top + this.ui.messages.offset().top;
        // $('.blogging_feed_questions').animate({
        //     scrollTop: scrollTop
        // }, 600);
    },

    onShowNextButton: function(options) {
        this.ui.nextMessagesButton.show();
        this.ui.nextMessagesButton.attr({
            // 'nextid': options.nextId,
            'previousid': options.previousId
            // 'previousid': 3
        });
    },

    onSetNextButtonOptions: function(options) {
        if (options.hasNext) {
            this.ui.nextMessagesButton.attr({
                // 'nextid': options.nextId,
                'previousid': options.previousId
            });
        } else {
            // when last page
            this.ui.nextMessagesButton.hide();
        }
    },

    showNextMessages: function() {
        var options = {
            previousId: this.ui.nextMessagesButton.attr('previousid'),
            contestUUID: this.model.get('uuid')
        };
        this.trigger('showNextMessages', options);
    },

    onHideMessages: function() {
        this.expandedMessages = false;
        this.messages_region.empty();
    },

    postRootComment: function() {
        var options = {
            messageBody: this.ui.messageBody.val(),
            inReplyToMessageId: 1,
            authorId: this.model.get('user').UID,
            communicationId: this.model.get('uuid'),
            urgent: false
        };
        this.trigger('postComment', options);
    },

    onHideRootCommentField: function() {
        this.ui.rootCommentField.slideUp();
    },

    onShowRootCommentField: function() {
        this.ui.rootCommentField.slideDown();
    },

    calculateMessageLength: function(e) {
        var message = this.ui.messageBody.val(),
            counter = message.length,
            enters = message.match(/(\r\n|\n|\r)/g);
        if (enters) {
            counter += enters.length;
        }
        this.ui.messageLength.html(counter);

        this.ui.messageBody.css('height', 0);
        var height = this.ui.messageBody[0].scrollHeight + 2;
        this.ui.messageBody.css({
            overflow: 'hidden',
            height: height + 'px'
        });
    }
});

module.exports = BloggingQuestionView;

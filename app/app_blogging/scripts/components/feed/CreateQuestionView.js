'use strict';

var moment = require('moment'),
	gateway = require('../../APIGateway/gateway'),
	template = require('ejs!./templates/createQuestion.ejs'),
	AnswerItemView = require('./AnswerItemView'),
	TagsView = require('../autocomplete/NewQuestionTagsView');

var CreateQuestionView = Mn.LayoutView.extend({

	template: template,

	moment: moment, // temporary hack

	regions: {
		categoriesRegion: '#new-question-categories-region',
		tagsRegion: '#new-question-tags-region'
	},

	arrows: {
		down: 'images/arrow_down_grey.png',
		up: 'images/arrow_up_grey.png'
	},

	ui: {
		container: '.create-question-container',
		discard: '.discard-btn',
		close: '.close',
		save: '.save-btn',
		post: '.post-btn',
		typeBlock: '.blogging_question_edit_type',
		type: '.blogging_question_edit_type input',
		typeChecked: '.blogging_question_edit_type input:checked',
		anonymous: '.blogging_question_is_anonymous_item input',
		question: '.question-text',
		answerInfo: '.answer-info-text',
		answerInfoLength: '.counter .message_length',
		additionalLinks: '.additional-links-container',
		answerRadioButton: '.radioCreateAnswer',
		answerRadioButtonImg: '.inputRadioImg',
		answersContainer: '.blogging_question_edit_answers',
		answers: '.blogging_question_edit_answers li',
		answerChoice: '.blogging_question_edit_answers li .answer-choice',
		answerExample: '.blogging_question_edit_answers li .answer-example',
		atributionInput: '#atributionLinkInput',
		bonusPoints: '#bonusPointsInput',
		basePoints: '#basePointsInput',
		dateInput: '.datetimepicker',
		expirationDate: '#expirationDatePicker',
		expirationDay: '#expirationDay',
		expirationMonth: '#expirationMonth',
		expirationYear: '#expirationYear',
		expirationTime: '#expirationTime',
		expirationAMPM: '#expirationAMPM',
		fulfillmentTime: '#fulfillmentTime',
		fulfillmentAMPM: '#fulfillmentAMPM',
		fulfillmentContainer: '.fullfillment-date',
		fulfillmentDay: '#fulfillmentDay',
		fulfillmentMonth: '#fulfillmentMonth',
		fulfillmentYear: '#fulfillmentYear',
		ampmSelector: '.ampm_selector',
		notificationDate: '#notificationDatePicker',
		addSelectAnswers: '.blogging_question_add_select_answers',
		addAnswerBtn: '.addAnswerBtn',
		selectAnswerText: '.selectAnswerText',
		removeAnswerBtn: '.removeAnswerBtn',
		collapsiblePredictionDetails: '#collapseOne',
		collapsibleAnswerInfo: '#collapseTwo',
		predictionDetails: '.prediction-details',
		predictionArrow: '.prediction-arrow',
		answerArrow: '.answer-arrow',
		error: '.error',
		categories: '.blogging_question_edit_categories',
		tags: '.blogging_question_edit_tags',
		categoriesError: '.categories_error',
		choicesIsCorrectError: '.choices_iscorrect_error',
		choicesTextError: '.choices_text_error',
		questionError: '.question_error',
		typeError: '.type_error',
		hintsForPrediction: '.collapseBtn',
		predictionHelp: '.prediction_help',
		eventStartDate: '.event_start_date',

		addPicture: '.blogging_question_add_picture',
		uploadImage: '.blogging_question_upload_image .dropzone'
		// notifyAuthor: '.notify_author'
	},

	events: {
		'click @ui.discard': 'onDiscardQuestion',
		'click @ui.close': 'onDiscardQuestion',
		'click @ui.save': 'onQuestionSave',
		'click @ui.post': 'onQuestionPost',
		'change @ui.type': 'onTypeChanged',
		'change @ui.anonymous': 'onIsAnonymousChanged',
		'change @ui.answerChoice': 'onChoiceChanged',
		'change @ui.answerExample': 'onExampleChanged',
		'change @ui.question': 'onQuestionChanged',
		'change @ui.answerInfo': 'onAnswerInfoChanged',
		'keyup @ui.answerInfo': 'calculateAnswerInfoLength',
		'keypress @ui.atributionInput': 'onAddAtributionUrl',
		'keydown @ui.bonusPoints': 'onKeyDownBonusPoints',
		'keydown @ui.basePoints': 'onKeyDownBasePoints',
		'change @ui.bonusPoints': 'onChangeBonusPoints',
		'change @ui.basePoints': 'onChangeBasePoints',
		'click @ui.addAnswerBtn': 'onAddAnswer',
		'click @ui.removeAnswerBtn': 'onRemoveAnswer',
		'click @ui.ampmSelector': 'onSelectAMPM',
		'keydown @ui.dateInput': 'onDateTimeChange',
		'keyup @ui.dateInput': 'stopInputsFill',
		'keypress @ui.dateInput': 'stopInputsFill',
		'focusout @ui.dateInput': 'checkDateInput'
		// 'change @ui.notifyAuthor': 'onNotifyAuthorChanged'
	},

	initialize: function() {
		if (this.options.fulfill && typeof this.options.fulfill !== 'undefined') {
			this.fulfill = true;
			this.fulfillPredictionQuestion(this.options.fulfill);
		}
		var date = new Date();
		if (!this.fulfill) {
			this.model.set('expirationDate', this.moment(date));//.format('MM/DD/YYYY HH:mm:ss'));
			// this.model.set('expirationDate', this.moment(date).format('MM/DD/YYYY h:mm A'));
		}
		/* we do not initialize the model here. We initialize it
		   in the onShow method below */

	},

	serializeData: function() {
		//TODO moment
		// var activationDate = '',
		var	expirationDate = '',
			expirationDay = '',
			expirationMonth = '',
			expirationYear = '',
			expirationTime = '',
			expirationAMPM = '';

		try {
			expirationDate = this.moment(this.model.get('expirationDate'));
				//.format('MM/DD/YYYY h:mm:ss');
			expirationDay = this.moment(this.model.get('expirationDate')).format('DD');
			expirationMonth = this.moment(this.model.get('expirationDate')).format('MM');
			expirationYear = this.moment(this.model.get('expirationDate')).format('YYYY');
			expirationTime = this.moment(this.model.get('expirationDate')).format('h:mm');
			expirationAMPM = this.moment(this.model.get('expirationDate')).format('a')
		} catch (e) {
			//TODO
		}

		return {
			fulfill: this.fulfill, // fulfill has different title
			expirationDate: expirationDate,
			expirationDay: expirationDay,
			expirationMonth: expirationMonth,
			expirationYear: expirationYear,
			expirationTime: expirationTime,
			expirationAMPM: expirationAMPM,
			model: this.model.toJSON()
		};
	},

	onShow: function() {
		var self = this;

		this.ui.answerExample.val('');

		if (this.fulfill) {
			this.showPredictionDetails();
			this.hideFieldsOnFulFill();
			// remove required 'categories' field from validator
			this.model.idnoredField = 'categories';
			this.fillLinks();
		} else {
			this.model.idnoredField = null;
		}

		this.ui.answerRadioButton.prop('checked', false);
		this.ui.container.collapse('show');
		this.ui.container.on('shown.bs.collapse', _.bind(function() {
			this.ui.collapsibleAnswerInfo.collapse('show');
			this.$el.parent().css({
				'overflow-y': 'scroll',
				'height': '100%'
			});
		}, this));

		this.trigger('getTags', _.bind(this.showTags, this), true); // true means silent
		this.trigger('getCategories', _.bind(this.showCategories, this), true); // true means silent
		// this.onInitDatepickers();
		this.onMaskDateInputs();
		this.ui.collapsiblePredictionDetails.on('shown.bs.collapse', _.bind(function() {
			this.ui.predictionArrow.attr('src', this.arrows.up);
		}, this));
		this.ui.collapsiblePredictionDetails.on('hidden.bs.collapse', _.bind(function() {
			this.ui.predictionArrow.attr('src', this.arrows.down);
		}, this));
		this.ui.collapsibleAnswerInfo.on('shown.bs.collapse', _.bind(function() {
			this.ui.answerArrow.attr('src', this.arrows.up);
		}, this));
		this.ui.collapsibleAnswerInfo.on('hidden.bs.collapse', _.bind(function() {
			this.ui.answerArrow.attr('src', this.arrows.down);
		}, this));


		// temporary set dates for FACT and OPINION
		this.model.set('subType', parseInt(this.ui.typeChecked.attr('cmtyx-question-type')));

		this.ui.uploadImage.html5imageupload({
			save: false,  // use custom method
			canvas: true, // should be true for handle
			data: {},
			resize: false, // doesn't work correct when true, should be chacked
			onSave: this.onSaveImage.bind(this),
			onAfterSelectImage: function(){
				$(this.element).addClass('added');
			},
			onAfterCancel: function() {
				$(this.element).removeClass('added');
				self.onCancelImage();
			}
		});
	},

	hideFieldsOnFulFill: function() {
		this.ui.typeBlock.hide();
		this.ui.fulfillmentContainer.hide();
		this.ui.expirationDate.prop('disabled', true);
		this.ui.notificationDate.prop('disabled', true);
		// this.ui.notifyAuthor.prop('disabled', true);
		this.ui.addPicture.hide();
		this.ui.question.prop('disabled', true);
		this.ui.categories.hide();
		this.ui.tags.hide();
		this.ui.hintsForPrediction.hide();
		this.ui.predictionHelp.hide();
		this.ui.eventStartDate.hide();
	},

	fulfillPredictionQuestion: function(attrs) {
		this.model.set(attrs);
		// TODO: Change model validation
		// for 'isCorrect' for different subTypes
		var choices = this.model.get('choices');
		choices[0].isCorrect = null;
		choices[1].isCorrect = null;
		this.model.set('choices', choices);
		console.log(this.model.toJSON());
	},

	onSaveImage: function(imageData) {
		console.log(imageData);
		this.trigger('onNewQuestin:saveMedia', imageData);
	},

	onCancelImage: function() {
		this.trigger('onNewQuestin:removeMedia');
	},

	onMaskDateInputs: function() {
		this.ui.expirationDay.mask('00');
		this.ui.expirationMonth.mask('00');
		this.ui.expirationYear.mask('0000');
		this.ui.expirationTime.mask('00:00');
		this.ui.fulfillmentDay.mask('00');
		this.ui.fulfillmentMonth.mask('00');
		this.ui.fulfillmentYear.mask('0000');
		this.ui.fulfillmentTime.mask('00:00');
	},

	stopInputsFill: function(e) {
		e.preventDefault();
		e.stopPropagation();
		return;
	},

	checkDateInput: function(e) {
		var $target = $(e.currentTarget),
			val = $target.val(),
			name = $target.attr('name');
		switch (name) {
			case 'year':
				if (val.length < 4) {
					$target.val('');
				}
				break;
			case 'time':
				if (val.length < 5 || (val[0] + val[1] > 12) || (val[4] + val[5] > 59)) {
					$target.val('');
				}
				break;
			default:
		}
		return;
	},

	onDateTimeChange: function(e) {
		if (e.which < 48 || e.which > 57) return;
		var $target = $(e.currentTarget),
			val = $target.val(),
			name = $target.attr('name'),
			date = new Date();
		switch (name) {
			case 'day':
				if (val.length > 1) return;
				if (e.key > 3 && val.length === 0) {
					$target.val('0' + e.key);
				} else if (val > 3) {
					$target.val('0' + val);
				} else if (val + e.key > 31) {
					return;
				} else {
					$target.val(val + e.key);
				}
				break;
			case 'month':
				if (val.length > 1) return;
				if (e.key > 1 && val.length === 0) {
					$target.val('0' + e.key);
				} else if (val > 1) {
					$target.val('0' + val);
				} else if (val + e.key > 12) {
					return;
				} else {
					$target.val(val + e.key);
				}
				break;
			case 'year':
				if (val.length > 3) return;
				if (val.length === 0 && e.which === 50) {
					$target.val(e.key);
				} else if (val.length === 0 && e.which !== 50) {
					$target.val('');
				} else if (val.length === 1) {
					$target.val('20');
				} else if (val.length === 2) {
					$target.val('20' + e.key);
				} else if (val.length === 3 && (val + e.key < date.getFullYear())) {
					if (val[0] === '2' && val[1] === '0') return;
					$target.val('');
				} else if (val.length === 3 && (val[0] !== '2' || val[1] !== '0')) {
					$target.val('20');
				} else {
					$target.val(val + e.key);
				}
				break;
			case 'time':
				if (val.length > 4) return;
				if (val.length === 0 && e.key > 1) {
					$target.val('0' + e.key + ':');
				} else if (val.length === 0 && e.key === '1') {
					$target.val(e.key);
				} else if (val.length === 1) {
					if (val === '1' && e.key < 3) {
						$target.val(val + e.key + ':');
					} else {
						$target.val('0' + e.key + ':');
					}
				} else if (val.length === 2) {
					if (val > 12) {
						$target.val('');
					} else {
						$target.val(val + ':');
					}
				} else if (val.length === 3 && e.key < 6) {
					$target.val(val + e.key);
				} else if ((val[0] + val[1] > 12) || (val[4] + e.key) > 59){
					$target.val('');
				} else {
					$target.val(val + e.key);
				}
				break;
			default:
		}
	},

	onInitDatepickers: function() {
		this.ui.expirationDate.datetimepicker({
			format: 'MM/DD/YYYY h:mm:ss',
			widgetPositioning: {
				horizontal: 'auto',
				vertical: 'bottom'
			}
		});
		this.ui.notificationDate.datetimepicker({
			format: 'MM/DD/YYYY h:mm:ss',
			widgetPositioning: {
				horizontal: 'auto',
				vertical: 'bottom'
			}
		});
		this.ui.expirationDay.datetimepicker({
			format: 'DD',
			widgetPositioning: {
				horizontal: 'auto',
				vertical: 'bottom'
			}
		});
		this.ui.expirationMonth.datetimepicker({
			format: 'MM',
			widgetPositioning: {
				horizontal: 'auto',
				vertical: 'bottom'
			}
		});
		this.ui.expirationYear.datetimepicker({
			format: 'YYYY',
			widgetPositioning: {
				horizontal: 'auto',
				vertical: 'bottom'
			}
		});
		this.ui.expirationTime.datetimepicker({
			// it need to have 12 hour time without AM/PM selector
			withoutAm: true,
			format: 'h:mm',
			widgetPositioning: {
				horizontal: 'auto',
				vertical: 'bottom'
			}
		});
		this.ui.fulfillmentTime.datetimepicker({
			withoutAm: true,
			format: 'h:mm',
			widgetPositioning: {
				horizontal: 'auto',
				vertical: 'bottom'
			}
		});
		this.ui.fulfillmentDay.datetimepicker({
			format: 'DD',
			widgetPositioning: {
				horizontal: 'auto',
				vertical: 'bottom'
			}
		});
		this.ui.fulfillmentMonth.datetimepicker({
			format: 'MM',
			widgetPositioning: {
				horizontal: 'auto',
				vertical: 'bottom'
			}
		});
		this.ui.fulfillmentYear.datetimepicker({
			format: 'YYYY',
			widgetPositioning: {
				horizontal: 'auto',
				vertical: 'bottom'
			}
		});
	},

	onSelectAMPM: function(e) {
		var value = $(e.currentTarget).find('a').text(),
			input = $(e.currentTarget).parent().siblings('input');
		input.val(value);
	},

	showCategories: function(categories) {
		var categoriesView = new TagsView({
			type: 'categories',
			items: categories,
			allowNew: false, // do not allow create topics
			preselected: this.model.get('categories'),
			updateFilters: _.bind(this.setCategories, this)
		});
		this.getRegion('categoriesRegion').$el.show();
		this.getRegion('categoriesRegion').show(categoriesView);
	},

	showTags: function(tags) {
		// triggerMethod('tagsReset');
		var tagsView = new TagsView({
			type: 'tags',
			items: tags,
			allowEmpty: false,
			preselected: this.model.get('hashTags'),
			updateFilters: _.bind(this.setTags, this)
		});
		this.getRegion('tagsRegion').$el.show();
		this.getRegion('tagsRegion').show(tagsView);
	},

	setCategories: function(categories) {
		this.model.set('categories', categories);
	},

	setTags: function(tags) {
		this.model.set('hashTags', tags);
	},

	onDiscardQuestion: function() {
		this.ui.container.collapse('hide');
		this.ui.container.on('hidden.bs.collapse', _.bind(function() {
			this.$el.parent().css({
				'overflow': '',
				'height': ''
			});
			this.trigger('onNewQuestin:discarded');
			this.destroy();
		}, this));
	},

	// onNotifyAuthorChanged: function() {
	// 	console.log(this.ui.notifyAuthor.val());
	// 	var days = parseInt(this.ui.notifyAuthor.val());
	// 	this.model.set('notifyAuthorDaysAfterExpiration', days);
	// },

	onTypeChanged: function(e) {

		this.ui.error.slideUp();

		var answers = this.ui.answersContainer.find('li');
		_.each(answers, function(answer, index) {
			if (index > 1) {
				answer.remove();
			}
		});
		this.ui.removeAnswerBtn.hide();
		this.model.get('choices').length = 2;
		var choices = this.model.get('choices');
		choices[0].isCorrect = null;
		choices[1].isCorrect = null;
		this.model.set('choices', choices);

		this.model.set('infoURL1', '');
		this.model.set('infoURL2', '');

		this.ui.answerExample.val('');
		this.ui.answerInfo.val('');
		this.ui.atributionInput.val('');
		this.ui.additionalLinks.find('div').empty();
		this.$el.find('.autocomplete').val('');
		this.$el.find('.tag-item').remove();
		this.ui.answerChoice.removeAttr('disabled').prop('checked', false);

		var $target = $(e.currentTarget);

		console.log(" picking subtype as :"+ parseInt($target.attr('cmtyx-question-type')));
		this.model.set('subType', parseInt($target.attr('cmtyx-question-type')));
		var currentSubType=this.model.get('subType');
		console.log("Subtype from model :"+currentSubType);
		switch (currentSubType) {
			case 3:
				this.showPredictionDetails();
				break;
			case 2:
				this.hidePredictionDetails();
				break;
			case 1:
				this.hidePredictionDetails();
				this.hideAnswerRadioButtons();
				this.ui.selectAnswerText.hide();
				this.setFalseChoices();
				break;
			default:
			  console.log("onTypeChanged: unexpected subType in model:"+currentSubType);
		}
	},

	setFalseChoices: function() {
		var choices = this.model.get('choices');
		choices[0].isCorrect = false;
		choices[1].isCorrect = false;
		this.model.set('choices', choices);
	},

	showPredictionDetails: function() {
		this.ui.predictionDetails.slideDown();
		setTimeout(_.bind(function() {
			this.ui.collapsiblePredictionDetails.collapse('show');
		}, this), 10);
		this.ui.answerRadioButton.prop('checked', false);
		if (!this.fulfill) {
			this.hideAnswerRadioButtons();
			this.setFalseChoices();
		}
		/* prefil answers with AGREE/DISAGREE */
		$(this.ui.answerExample[0]).val('Agree').change().prop('disabled',true);
	   	$(this.ui.answerExample[1]).val('Disagree').change().prop('disabled',true);
		this.ui.addSelectAnswers.hide();
	    this.ui.addAnswerBtn.hide();
		this.ui.selectAnswerText.hide();
	},

	hidePredictionDetails: function() {
		this.ui.predictionDetails.slideUp();
		this.ui.collapsiblePredictionDetails.collapse('hide');
		// this.ui.collapsiblePredictionDetails.on('hidden.bs.collapse', _.bind(function() {
		// 	this.ui.predictionDetails.slideUp();
		// }, this));
		this.showAnswerRadioButtons();
		/* undo prefil answers */
		$(this.ui.answerExample[0]).val('').change().prop('disabled',false);
   		$(this.ui.answerExample[1]).val('').change().prop('disabled',false);
		var length = this.model.get('choices').length;
		if (length < 3) {
				this.ui.addAnswerBtn.show();
		}
		this.ui.addSelectAnswers.show();
  		this.ui.selectAnswerText.show();
	},

	showAnswerRadioButtons: function() {
		this.ui.answerRadioButtonImg.show();
		this.ui.answerRadioButton.show();
	},

	hideAnswerRadioButtons: function() {
		this.ui.answerRadioButtonImg.hide();
		this.ui.answerRadioButton.hide();
	},

	onIsAnonymousChanged: function(e) {
		var $target = $(e.currentTarget),
			checked = $target.is(':checked');
		this.model.set('isAnonymous', checked);
	},

	onChoiceChanged: function(e) {
		var $target = $(e.currentTarget),
			cIndex = $target.data('index'),
			choices = this.model.get('choices');

		_.each(choices, function(choice, index){
			if (index === cIndex) {
				choice.isCorrect = true;
			} else {
				choice.isCorrect = false;
			}
		});

		this.model.set('choices', choices);
		this.ui.choicesIsCorrectError.slideUp();
	},

	onExampleChanged: function(e) {
		var $target = $(e.currentTarget),
			cIndex = $target.data('index'),
			choices = this.model.get('choices');

		choices[cIndex].displayText = $target.val();

		this.model.set('choices', choices);
	},

	onQuestionChanged: function(e) {
		var $target = $(e.currentTarget),
			text = $target.val();

		this.model.set('displayText', text);
	},

	onAnswerInfoChanged: function(e) {
		var $target = $(e.currentTarget),
			text = $target.val();

		this.model.set('additionalInformation', text);
	},

	calculateAnswerInfoLength: function(e) {
        var info = this.ui.answerInfo.val(),
        	counter = info.length,
        	enters = info.match(/(\r\n|\n|\r)/g); // fix for enters length
        if (enters) {
        	counter += enters.length;
        }
        this.ui.answerInfoLength.html(counter);
	},

	onQuestionSave: function() {
		console.log('on save question');
		if (this.model.isValid()) {
			// save model
		} else {
			//on error
			this.onValidationError(this.model.validationError);
		}
		//I don't know where we save question on local storage or on backend
	},

	onValidationError: function(errors) {
		console.log('fields error: ', errors);
		for (var error in errors) {
			switch (errors[error]) {
				case 'subType':
					this.ui.typeError.slideDown();
					break;
				case 'categories':
					this.ui.categoriesError.slideDown();
					this.ui.categoriesError
						.siblings('div')
						.find('input')
						.on('focus',_.bind(function() {
							this.ui.categoriesError.slideUp();
						}, this));
					break;
				case 'choices':
					var choices = this.model.get('choices'),
						subType = this.model.get('subType'),
						// TODO make better validation in model
						emptyTexts = _.findWhere(choices, {displayText:''}),
						isCorrect = _.some(choices, {isCorrect: true}),
						ifNull = _.findWhere(choices, {isCorrect: null});
					if ((subType === 2 && !isCorrect) || ifNull) {
						this.ui.choicesIsCorrectError.slideDown();
					}
					if (emptyTexts) {
						this.ui.choicesTextError.slideDown();
					}
					this.ui.answerExample.on('focus', _.bind(function() {
						this.ui.choicesTextError.slideUp();
					}, this));
					break;
				case 'displayText':
					this.ui.questionError.slideDown();
					this.ui.question.on('focus', _.bind(function() {
						this.ui.questionError.slideUp();
					}, this));
					break;
				default:
					break;
			}
		}
	},

	onQuestionPost: function() {
		console.log('on post question');
		this.checkDatepickersDate();
		// this.trigger('onNewQuestin:post', this.model, _.bind(this.onDiscardQuestion, this));
		if (this.model.isValid()) {
			if (this.fulfill) {
				this.trigger('fulfillPrediction:put', this.model, _.bind(this.onDiscardQuestion, this));
			} else {
				// post model
				this.trigger('onNewQuestin:post', this.model, _.bind(this.onDiscardQuestion, this));
			}
		} else {
			//on error
			this.onValidationError(this.model.validationError);
		}
	},

	fillLinks: function() {
		var infoURL1 = this.model.get('infoURL1'),
			infoURL2 = this.model.get('infoURL2'),
			template,
			links = this.ui.additionalLinks.find('div');

		if (infoURL1) {
  			template = this.createTemplate(infoURL1);
  			links.eq(0).html(template)
  				.find('.remove-link').on('click', _.bind(this.removeLink, this));
  		}
  		if (infoURL2) {
  			template = this.createTemplate(infoURL2);
  			links.eq(1).html(template)
  				.find('.remove-link').on('click', _.bind(this.removeLink, this));
  		}
	},

	onAddAtributionUrl: function(e){
		if (e.which !== 13) return;
		var url = this.ui.atributionInput.val(),
			expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi,
  	 		regex = new RegExp(expression),
  	 		links = this.ui.additionalLinks.find('div'),
  	 		available,
  	 		template;

  		if (url.match(regex)) {
  			if (!this.model.get('infoURL1')) {
  				available = links.eq(0);
  				this.model.set('infoURL1', url);
  			} else if (!this.model.get('infoURL2')) {
  				available = links.eq(1);
  				this.model.set('infoURL2', url);
  			}

  			if (available) {
  				console.log('add url ', url);
  				template = this.createTemplate(url);
  				available.html(template);
  				available.find('.remove-link').on('click', _.bind(this.removeLink, this));
  				this.ui.atributionInput.val('');
  			} else {
  				//show message
  			}
  		}
	},

	createTemplate: function(url) {
		var expresion = /^(http:\/\/)|(https:\/\/)/g,
			link;

		if (!url.match(expresion)) {
			link = 'http://' + url;
		} else {
			link = url;
		}
		return '<a href="' + link + '">' + link
 			+ '</a><i class="remove-link fa fa-times remove-tag"></i>';
	},

	removeLink: function(e) {
		var $target = $(e.currentTarget),
			parent = $target.parent();

		parent.html('');
		if (parent.hasClass('first-link')) {
			this.model.set('infoURL1', '');
		} else {
			this.model.set('infoURL2', '');
		}
	},

	onKeyDownBonusPoints: function(e) {
		this.testKeyPressed(e);
	},

	onKeyDownBasePoints: function(e) {
		this.testKeyPressed(e);
	},

	testKeyPressed: function(e) {
		if (e.keyCode === 190) {
			e.preventDefault();
			e.stopPropagation();
			return false;
		}
	},

	onChangeBonusPoints: function(e) {
		var $target = $(e.currentTarget),
			value = this.checkCorrectValue($target);

		this.model.set('bonusPoints', value);
	},

	onChangeBasePoints: function(e) {
		var $target = $(e.currentTarget),
			value = this.checkCorrectValue($target);

		this.model.set('basePoints', value);
	},

	checkCorrectValue: function($target) {
		var value = $target.val(),
			min = $target.attr('min') || 0,
			max = $target.attr('max') || 1000,
			testValue = parseInt(value, 10);

		testValue = isNaN(testValue) ? 0 : testValue;
		value = testValue < min ? min : testValue > max ? max : testValue;
		$target.val(value);
		return value;
	},

	//TODO not completely working
	checkDatepickersDate: function() {
		//check datepickers
		var expirationDay = this.ui.expirationDay.val(),
			expirationMonth = this.ui.expirationMonth.val(),
			expirationYear = this.ui.expirationYear.val(),
			expirationAMPM = this.ui.expirationAMPM.val().toUpperCase() || 'AM',
			expirationTime = this.ui.expirationTime.val() + ' ' + expirationAMPM,
			expiration = expirationMonth + '/' + expirationDay + '/' + expirationYear + '/' + expirationTime,
			fulfillmentDay = this.ui.fulfillmentDay.val(),
			fulfillmentMonth = this.ui.fulfillmentMonth.val(),
			fulfillmentYear = this.ui.fulfillmentYear.val(),
			fulfillmentAMPM = this.ui.fulfillmentAMPM.val().toUpperCase() || 'AM',
			fulfillmentTime = this.ui.fulfillmentTime.val() + ' ' + fulfillmentAMPM,
			fulfillment = fulfillmentMonth + '/' + fulfillmentDay + '/' + fulfillmentYear + '/' + fulfillmentTime,
			convertedExpire,
			convertedFulfill;

		try {
			convertedExpire = this.moment(expiration).format();
			convertedFulfill = this.moment(fulfillment).format();
		} catch (e) {
			//error
		}
		if ((typeof convertedExpire !== 'undefined') && convertedExpire !=='Invalid date') {
			this.model.set('expirationDate', convertedExpire);
		}
		if ((typeof convertedFulfill !== 'undefined') && convertedFulfill !=='Invalid date' ) {
			this.model.set('eventEndDate', convertedFulfill);
		}
		// We can check if user enter fulfillDate after expirationDate
		// this.moment(convertedFulfill).isAfter(this.moment(convertedExpire));
	},

	onAddAnswer: function(e) {
		var length = this.model.get('choices').length;
		if (length < 5) {
			this.model.attributes.choices[length] = {
				choiceName: null,
				displayText: '',
				isCorrect: false
			};
			var answer = new AnswerItemView({
				choiceName: null,
				displayText: '',
				isCorrect: false,
				index: length,
				subType: this.model.get('subType')
			}).render().el;
			this.ui.answersContainer.append(answer);
			this.ui.removeAnswerBtn.show();
			var currentSubType=this.model.get('subType');
			console.log("Subtype from model :"+currentSubType);
			switch (currentSubType) {
				case 3:
				  /* PREDICTION */
				 	this.hideAnswerRadioButtons();
					break;
				case 2:
				 	/* FACT : do nothing */
					break;
				case 1:
					/* OPINION */
		 		  this.hideAnswerRadioButtons();
					break;
				default:
				  console.log("onAddAnswer: unexpected subType in model:"+currentSubType);
			}
			if (length === 4) {
				this.ui.addAnswerBtn.hide();
			}
		}
	},

	onRemoveAnswer: function() {
		var length = this.model.get('choices').length;
		if (length > 2) {
			this.model.get('choices').splice(length - 1);
			this.ui.answersContainer.find('li').last().remove();
			this.ui.addAnswerBtn.show();
			if (length === 3) {
				this.ui.removeAnswerBtn.hide();
			}
		}
	}

});

module.exports = CreateQuestionView;

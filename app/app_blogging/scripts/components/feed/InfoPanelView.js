'use strict';

var InfoPanelView = Mn.ItemView.extend({

    el: '.infoPanel',

    ui: {
        filterTab: '.filter_tab',
        expandedFilters: '.collapsed-filters',
        createQuestionBtn: '.create_question_btn'
    },

    events: {
        'click @ui.filterTab': 'onSelectFiltersTab',
        'click @ui.createQuestionBtn': 'triggerCreateQuestion'
    },

    initialize: function() {
        this.$el.show();
    },

    onSelectFiltersTab: function(e) {
        $(this.ui.filterTab).removeClass('selected');
        $(this.ui.expandedFilters).collapse('hide');
        var $target = $(e.currentTarget),
			filter = $target.data('filtertype');
        if (filter !== 'TYPE' && filter !== 'HIDEANSWERED') {
            $target.addClass('selected');
        }
		this.trigger('selectFilter', filter);
    },

    triggerCreateQuestion: function() {
        $('.js-select-tags-region').slideUp('slow', _.bind(function() {
            this.trigger('createQuestion');
        }, this));
    }
});

module.exports = InfoPanelView;

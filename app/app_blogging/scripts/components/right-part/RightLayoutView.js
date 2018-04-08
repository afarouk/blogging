'use strict';

var template = require('ejs!./templates/rightLayout.ejs');

var RightLayoutView = Mn.LayoutView.extend({

    template: template,

    el: '.rightPanel',

    regions: {
        userSummaryRegion: '.user-summary-region',
    },

    initialize: function() {
        this.render();
    },

    showView: function(view) {
        this.userSummaryRegion.show(view);
    }
});

module.exports = RightLayoutView;

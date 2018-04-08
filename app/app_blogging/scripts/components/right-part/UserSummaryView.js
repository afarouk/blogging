'use strict';

var template = require('ejs!./templates/userSummary.ejs');

var UserSummaryView = Mn.ItemView.extend({

    className: 'user_summary_container',

    template: template
});

module.exports = UserSummaryView;

'use strict';

var template = require('ejs!./userInfo.ejs');

var UserInfoView = Mn.ItemView.extend({

    template: template,

    className: 'user-info',

    serializeData: function() {
        return {
            user: this.options.user
        };
    }
});

module.exports = UserInfoView;

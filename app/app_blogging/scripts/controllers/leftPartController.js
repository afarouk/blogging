'use strict';

var App = require('../app'),
    Vent = require('../Vent'),
    sessionActions = require('../actions/sessionActions'),
    LeftLayoutView = require('../components/left-part/LeftLayoutView'),
    UserInfoView = require('../components/left-part/UserInfoView');

module.exports = {

    showLayout: function() {
        this.user = sessionActions.getCurrentUser();
        this.UID = this.user && this.user.UID ? this.user.UID : '';
        this.leftLayoutView = new LeftLayoutView();
        App.regions.getRegion('leftRegion').show(this.leftLayoutView);
        this.showViews();
        this.leftLayoutView.listenTo(Vent, 'login_success', _.bind(this.showUserInfo, this));
        this.leftLayoutView.listenTo(Vent, 'logout_success', _.bind(this.hideUserInfo, this));
    },

    showViews: function() {
        if (this.user.getUID()) {
            this.showUserInfo();
        };
    },

    showUserInfo: function() {
        this.userInfoView = new UserInfoView({
            user: this.user
        });
        this.leftLayoutView.showUserInfo(this.userInfoView);
    },

    hideUserInfo: function() {
        this.leftLayoutView.hideUserInfo(this.userInfoView);
    }
}

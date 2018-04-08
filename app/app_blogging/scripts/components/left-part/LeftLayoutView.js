'use strict';

var template = require('ejs!./leftLayout.ejs');

var LeftLayoutView = Mn.LayoutView.extend({

    template: template,

    className: 'left-panel',

    regions: {
        userInfoRegion: '#user-info-region'
    },

    showUserInfo: function(view){
        this.userInfoRegion.show(view);
    },

    hideUserInfo: function(view) {
        view.destroy();
    }
});

module.exports = LeftLayoutView;

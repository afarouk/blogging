'use strict';

var AppLayoutView = Mn.LayoutView.extend({

    template: require('ejs!../templates/appLayout.ejs'),

    el: '#app-container',

    regions: {
        centralRegion: '#central-region',
        popupRegion: '#popup-region'
    },

    initialize: function() {
        this.render();
    }
});

module.exports = AppLayoutView;

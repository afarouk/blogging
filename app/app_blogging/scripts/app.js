'use strict';

var sessionActions = require('./actions/sessionActions'),
    userController = require('./controllers/userController'),
    pageController = require('./pageController');

var App = new Mn.Application();

App.goToPage = function(viewName) {
    if (window.community.sharedblogging===true || window.community.type === 'prc') {
        viewName = 'feed'
    }

    pageController[viewName]();
};

App.on('viewChange', App.goToPage);

App.on('start',function() {
    $('#app-container').on('click', 'a[href]:not([data-bypass])', function(evt) {
        // Get the absolute anchor href.
        var href = { prop: $(this).prop('href'), attr: $(this).attr('href') };
        // Get the absolute root.
        var root = location.protocol + '//' + location.host;

        // Ensure the root is part of the anchor href, meaning it's relative.
        if (href.prop.slice(0, root.length) === root) {
            evt.preventDefault();
            // Backbone.history.navigate(href.attr, true);
        }
    });

    this.params = window.community;

    Backbone.history.start({pushState: true});

    if (window.community.sharedblogging===true) {
        $('.login_status').hide();
        $('.main_content').addClass('hidden_info_panel');
        $('.leftPanel').addClass('blogging_share_first_tile');
    }

    if (localStorage.cmxUID || window.community.sharedblogging===true) {
        sessionActions.getSessionFromLocalStorage().then(function () {
            pageController.auth();
            App.trigger('viewChange','feed');
        });
    } else {
        $('.main_content').addClass('hidden_info_panel');
        pageController.auth();
        App.trigger('viewChange','contactus');
    }
});

module.exports = App;

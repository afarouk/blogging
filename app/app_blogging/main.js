'use strict';

require('./styles/main.scss');
require('../vendor/styles/jquery.jqplot.min.css');

require('bootstrap-webpack');
require('./vendor/scripts/bootstrap-datetimepicker');
require('./vendor/codecanyon/assets/css/html5imageupload.css');
require('./vendor/codecanyon/assets/js/html5imageupload');
require('jquery-mask-plugin');
require('moment');
require('../vendor/scripts/jquery.jqplot.min');
require('../vendor/scripts/jqplot.barRenderer.min');
require('../vendor/scripts/jqplot.categoryAxisRenderer.min');
require('../vendor/scripts/jqplot.pointLabels.min');

var App = require('./scripts/app'),
    h = require('./scripts/globalHelpers');

// $(document).on('click', 'a[href]:not([data-bypass])', function(evt) {
//     // Get the absolute anchor href.
//     var href = { prop: $(this).prop('href'), attr: $(this).attr('href') };
//     // Get the absolute root.
//     var root = location.protocol + '//' + location.host;
//
//     // Ensure the root is part of the anchor href, meaning it's relative.
//     if (href.prop.slice(0, root.length) === root) {
//         evt.preventDefault();
//         // Backbone.history.navigate(href.attr, true);
//     }
// });

App.start();
h().startLogger();

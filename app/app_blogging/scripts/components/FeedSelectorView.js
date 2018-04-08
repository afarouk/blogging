'use strict';

var FeedSelectorView = Backbone.View.extend({

    initialize : function() {
        console.log("FeedSelectorView initialized");
        this.render();
    },

    events : {
        'click li' :  'handleClick'
    },

    handleClick : function(e) { 
        e.preventDefault();
        var filterType=$(e.currentTarget).attr('filterType');  
        this.model.feedSelectorClicked({selectorName:filterType});
    },
    
    render : function() {
        /*mark the selected tab*/
    }
    
 });

module.exports = FeedSelectorView;

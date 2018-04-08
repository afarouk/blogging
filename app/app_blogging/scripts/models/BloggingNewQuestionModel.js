'use strict';

var BloggingNewQuestionModel = Backbone.Model.extend({

    storedDefaults : {
        activationDate: null,  // 07/27/2016 12:00 AM
        expirationDate : null, // '2016-11-01T09:45:00.000+02',
        eventEndDate: null,
        // notifyAuthorDaysAfterExpiration: 0,
        contestName : 'N/A',
        displayText : '', //'What is the oldest tree in the world'
        hiddenText : '',
        contestCustomerId : null,
        isAnonymous : false,
        contestUUID: null,
        subType: null,
        url: '',
        infoURL1: '',
        infoURL2: '',
        categories: [], //['Nature']
        hashTags: [], //['SaveWhales']
        choices: [
            {
                choiceName: null,
                displayText: '', //'It is a Redwood somewhere in California'
                isCorrect: null
            },
            {
                choiceName: null,
                displayText: '', //'Its a Joshua Tree in Australia'
                isCorrect: null //true
            }
        ],
        additionalInformation: '',
        bonusPoints: 0,
        basePoints: 0
    },

    idnoredField: null,

    requiredFields: {
        displayText: {
            length: 1
        },
        subType: {
            type: 'number'
        },
        choices: {
            length: 2,
            fields: {
                displayText: {
                    length: 1
                },
                isCorrect: {
                    type: 'boolean'
                }
            }
        },
        expirationDate: { //TODO date validation
            length: 15
        },
        categories: {
            length: 1
        }
    },

    initialize: function(){
        this.fillDefaults(); // only way to reset model, because reference defaults
        this.set(this.defaults);
    },

    fillDefaults: function() {
        try {
            this.defaults = JSON.parse(JSON.stringify(this.storedDefaults));
        } catch(e) {
            this.defaults = this.storedDefaults;
        }
    },

    validate: function(attrs) {
        var required = _.omit(this.requiredFields, this.idnoredField),
            fails = [],
            validated = this._validator(attrs, required, fails);
        return validated ? false : fails;
    },

    _validator: function (attrs, fieldValidator, fails) {
        for (var field in fieldValidator) {
            var options = fieldValidator[field];
            for (var option in options) {
                var value = options[option];
                switch (option) {
                    case 'length':
                        if (!attrs[field] || attrs[field].length < value) {
                            fails.push(field);
                        }
                        break;
                    case 'type':
                        if (typeof attrs[field] === 'undefined' || attrs[field] === null || isNaN(attrs[field]) ||
                            typeof attrs[field] !== value) {
                            fails.push(field);
                        }
                        break;
                    case 'fields':
                        if (!attrs[field]) {
                            fails.push(field);
                        } else {
                            var filtered = _.filter(attrs[field], _.bind(function(field){
                                var fails = [];
                                return this._validator(field, value, fails);
                            }, this));
                            if (filtered.length !== attrs[field].length) {
                                fails.push(field);
                            }
                        }
                        break;
                    default:
                        break;
                }
            }
        }
        return fails.length === 0;
    }

});

module.exports = BloggingNewQuestionModel;

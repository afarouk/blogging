define([
  "jquery",
  "./autocomplete",
  "ejs!./templates/autocompleteTpl.ejs" ]
  , function(
  $,
  MarionetteAutocomplete,
  template) {
  'use strict';
  var KEY_ENTER = 13, KEY_DOWN = 40, KEY_UP = 38, KEY_ESC = 27;
  var AutocompleteView = Mn.ItemView.extend({
    template: template,

    ui: {
      autocomplete: 'input.autocomplete'
    },

    className: 'pos-rel',

    events: {
      'change @ui.autocomplete': 'onChange',
      'focus @ui.autocomplete': 'onClick',
      'keyup @ui.autocomplete': 'showDropdown',
      'click .js-dropdown-icon': 'onIconClick',
      'keydown @ui.autocomplete': 'onKeyDown',
      'keypress @ui.autocomplete': 'checkAllowedSymbol'
    },

    triggers: {
      'blur @ui.autocomplete': 'blur'
    },

    initialize: function() {
      this.listenTo(this, 'autocomplete:selected', _.bind(this.onSelect, this));
    },

    serializeData: function() {
      return {
        placeholder: this.options.placeholder || null,
        value: this.options.value || null,
        fieldName: this.options.name || null,
        inputType: this.options.inputType || null
      };
    },

    onBeforeAttach: function() {
      var that = this;
      this.ui.autocomplete.parent().on('show.bs.dropdown', function() {
        that.ui.autocomplete.parent().next('ul').show();
      });
      this.ui.autocomplete.parent().on('hide.bs.dropdown', function() {
        that.ui.autocomplete.parent().next('ul').hide();
      });
    },

    onCheckFillQuery: function() {
      return true;
    },

    onSelect: function(model) {
      var target = this.ui.autocomplete,
        fieldName = target.data('field-name'),
        callback = this.options.callback;

      if (callback) {
        callback(fieldName, model);
      }
      this.selected = true;
      this.selectTextInInput(target);
    },

    selectTextInInput: function(target) {
      setTimeout(function(){
        target.get(0).setSelectionRange(0, target.val().length);
      }, 10);
    },

    onChange: function() {
      this.changed = true;
    },

    showDropdown: function(e) {
      // We require this for the case when user navigates to autocomplete by tabbing
      if(e && (e.keyCode || e.which) &&
        e.which !== KEY_ESC && e.keyCode !== KEY_ESC &&
        e.which !== KEY_ENTER && e.keyCode !== KEY_ENTER) {
        if(!this.ui.autocomplete.parent().hasClass('open')) {
          this.ui.autocomplete.dropdown('toggle');
        }
      }
    },

    _valueInCollection: function(inputValue) {
      var that = this;

      if(!inputValue) return;

      return _.find(this.options.data, function(model) {
        return model[that.options.valueKey].toLowerCase() === inputValue.trim().toLocaleLowerCase();
      });
    },

    onClick: function($e) {
      var focusin = typeof $e.originalEvent === 'object' ? true : false;
      this.ui.autocomplete.trigger('keyup', focusin);
      this.trigger('focus');
    },

    onIconClick: function(e) {
      e.stopPropagation();
      this.ui.autocomplete.click();
    },

    onKeyDown: function(e) {
      var charCode = (e.which) ? e.which : event.keyCode;

      if (charCode === KEY_ENTER && !this.options.onPressKey) {
        return false;
      } else if(charCode === KEY_DOWN || charCode === KEY_UP) {
        return false;
      }
    },

    checkAllowedSymbol: function(e) {
      var reg = /^[A-Za-z0-9+_\s]+$/,  // match symbols
          value = String.fromCharCode(e.which);
      //create new tag when , pressed (earlier space)
      if (value === ',') { // || value === ' ') {
        this.createNewTag();
      }
      if (!value.match(reg)) {
        return false;
      }
      return true;
    },

    createNewTag: function() {
      var value = this.ui.autocomplete.val();
      if (value.length > 1) {
        var e = $.Event( 'keyup', { which: 13 } );
        setTimeout(_.bind(function(){
          this.ui.autocomplete.trigger(e);
        }, this), 1);
      }
    },

    behaviors: function() {
      var that = this,
        type = this.options.type || 'dataset',
        remote = this.options.remote || null,
        keys = this.options.keys || null,
        limit = this.options.limit || 10,
        rateLimit = this.options.lazyLoad ? 500 : 0;

      var behavior = {
        AutoComplete: {
          behaviorClass: MarionetteAutocomplete.Behavior,
          rateLimit: rateLimit,
          collection: {
            options: {
              minLength: -1,
              type: type,
              remote: remote,
              keys: keys,
              inputType: this.options.inputType,
              data: this.options.data,
              valueKey: this.options.valueKey,
              lazyLoad: this.options.lazyLoad,
              allowNew: this.options.allowNew === undefined ? true : this.options.allowNew,
              allowEmpty: this.options.allowEmpty === undefined ? true : this.options.allowEmpty,
              values: {
                apiKey: this.options.apiKey,
                limit: limit
              }
            }
          },
          getChangeDataSet: _.bind( function(changeDataSet) {
            this.onChangeDataSet = changeDataSet;
          }, this)
        }
      };

      return behavior;
    }
  });
  module.exports = AutocompleteView;
});

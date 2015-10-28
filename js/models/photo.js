/* global Backbone: true */

'use strict';

(function() {
  /**
   * @constructor
   * @extends {Backbone.Model}
   */
  var PhotoModel = Backbone.Model.extend({
    initialize: function() {
      this.set('liked', false);
    },

    like: function() {
      this.set('liked', true);
      var likes = this.get('likes');
      this.set('likes', ++likes);
    },

    dislike: function() {
      this.set('liked', false);
      var likes = this.get('likes');
      this.set('likes', --likes);
    }
  });

  window.PhotoModel = PhotoModel;
})();

'use strict';

define(function() {
  /**
   * Конструктор модели PhotosCollection
   * @constructor
   * @extends {Backbone.Model}
   */
  var PhotoModel = Backbone.Model.extend({
    initialize: function() {
      this.likeToggle = this.likeToggle.bind(this);
    },

    /**
     * Значение лайка по умолчанию
     * @type {boolean}
     */
    defaults: {
      liked: false
    },

    /**
     * Обработчик количества лайков при нажатии
     */
    likeToggle: function() {
      var likesCount = this.get('likes');
      if (!this.get('liked')) {
        likesCount++;
      } else {
        likesCount--;
      }
      this.set({
        likes: likesCount,
        liked: !this.get('liked')
      });
    }
  });

  return PhotoModel;
});

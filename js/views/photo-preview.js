/* global Backbone: true */

'use strict';

(function() {
  /**
   * @constructor
   * @param (Object) attributes
   * @param (Object) options
   */
  var GalleryPicture = Backbone.View.extend({
    tagName: 'img',

    initialize: function() {
      this._onClick = this._onClick.bind(this);
    },

    /**
     * Отрисовка фото в галерее
     * @override
     */
    render: function() {
      this.el.querySelector('img').src = this.model.get('url');
      this.el.querySelector('.likes-count').innerText = this.model.get('likes');
      this.el.querySelector('.comments-count').innerText = this.model.get('comments');
    },

    /**
     * Добавление и удаление лайка при клике на фото галереи
     * @override
     */
    likeSwitcher: function() {
      if (this.model.get('liked')) {
        this.model.dislike();
      } else {
        this.model.like();
      }
    },
    /**
     * Обработчик клика по фотографии в галерее
     * @param  {MouseEvent} evt
     * @private
     */
    _onClick: function(evt) {
      evt.preventDefault();
      this.likeSwitcher();
      this.render();
    }
  });

  window.GalleryPicture = GalleryPicture;
})();

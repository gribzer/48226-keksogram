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
    className: 'gallery-overlay-image',

    initialize: function() {
      this._onClick = this._onClick.bind(this);
    },

    /**
     * Отрисовка фото в галерее
     * @override
     */
    render: function() {
      this.el.src = this.model.get('url');
    },

    controlsRender: function() {
      this.el.querySelector('.likes-count').textContent = this.model.get('likes');
      this.el.querySelector('.comments-count').textContent = this.model.get('comments');
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
      this.controlsRender();
    }
  });

  window.GalleryPicture = GalleryPicture;
})();

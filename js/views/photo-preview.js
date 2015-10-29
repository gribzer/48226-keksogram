/* global Backbone: true */

'use strict';

(function() {
  /**
   * @const
   * @type {Number}
   */
  var REQUEST_FAILURE_TIMEOUT = 10000;

  /**
   * @constructor
   * @param (Object) attributes
   * @param (Object) options
   */
  var GalleryPicture = Backbone.View.extend({
    initialize: function() {
      this._onPhotoLoadError = this._onPhotoLoadError.bind(this);
      this._onPhotoLoad = this._onPhotoLoad.bind(this);
      this._onPhotoLoadTimeOut = setTimeout(this._onPhotoLoadError, REQUEST_FAILURE_TIMEOUT);

      this.listenTo(this.model, 'change', this.render);
    },

    /**
     * Маппинг событий происходящих на элементе на названия методов обработчиков
     * событий.
     * @type {Object.<string, string>}
     */
    events: {
      'click .gallery-overlay-controls-like': '_onClickLike'
    },

    /**
     * Отрисовка фото в галерее
     * @override
     */
    render: function() {
      this._galleryElement = this.el.querySelector('.gallery-overlay-image');
      this._galleryElement.src = this.model.get('url');
      this._galleryElement.addEventListener('error', this._onPhotoLoadError);
      this._galleryElement.addEventListener('load', this._onPhotoLoad);
      this.el.querySelector('.likes-count').innerHTML = this.model.get('likes');
      this.el.querySelector('.comments-count').innerHTML = this.model.get('comments');

      if (this.model.get('liked') === true) {
        this.el.querySelector('.likes-count').classList.add('likes-count-liked');
      } else {
        this.el.querySelector('.likes-count').classList.remove('likes-count-liked');
      }

      return this;
    },

    /**
     * Уничтожаем view
     */
    destroy: function() {
      this.stopListening();
      this.undelegateEvents();
    },

    /**
     * При нажатие на клик вызывается обработка количетва "лайков"
     * @param {Event} evt
     * @private
     */
    _onClickLike: function(evt) {
      evt.stopPropagation();
      this.model.likeToggle();
    },

    /**
     * Обработчик клика по фотографии в галерее
     * @param  {MouseEvent} evt
     * @private
     */
    _onClick: function(evt) {
      evt.preventDefault();
      this.render();
    },

    /**
     * @param {Event} evt
     * @private
     */
    _onPhotoLoadError: function(evt) {
      clearTimeout(this._onPhotoLoadTimeOut);
      this._galleryElement.src = '';
      this._galleryElement.classList.add('picture-big-load-failure');
      this._cleanupImageListeners(evt.target);
    },

    /**
     * @param {Event} evt
     * @private
     * @private
     */
    _onPhotoLoad: function(evt) {
      clearTimeout(this._onPhotoLoadTimeOut);
      this.el.querySelector('.gallery-overlay-image').classList.remove('picture-big-load-failure');
      this._cleanupImageListeners(evt.target);
    },

    /**
     * Удаление обработчиков событий
     * @param {Image} image
     * @private
     */
    _cleanupImageListeners: function(image) {
      image.removeEventListener('load', this._onPhotoLoad);
      image.removeEventListener('error', this._onPhotoLoadError);
    }
  });

  window.GalleryPicture = GalleryPicture;
})();

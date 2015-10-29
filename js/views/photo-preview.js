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
    tagName: 'img',
    className: 'gallery-overlay-image',

    initialize: function() {
      this._onClick = this._onClick.bind(this);
      this._onPhotoFail = this._onPhotoFail.bind(this);
    },
    /**
     * Отрисовка фото в галерее
     * @override
     */
    render: function() {
      this.el.src = this.model.get('url');

      this._imageLoadTimeout = setTimeout(function() {
        this.el.classList.add('picture-big-load-failure');
      }.bind(this), REQUEST_FAILURE_TIMEOUT);

      this.el.addEventListener('error', this._onPhotoFail);
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
    },

    /**
     * @param {Event} evt
     * @private
     */
    _onPhotoFail: function(evt) {
      this.el.src = '';
      this.el.classList.add('picture-big-load-failure');
      this.el.removeEventListener('error', this._onPhotoFail);
      clearTimeout(this._photoLoadTimeout);
    }
  });

  window.GalleryPicture = GalleryPicture;
})();

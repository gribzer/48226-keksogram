'use strict';

define(function() {
  /**
   * @const
   * @type {Number}
   */
  var REQUEST_FAILURE_TIMEOUT = 10000;

  /**
   * @constructor
   * @extends {Backbone.View}
   */
  var PhotoView = Backbone.View.extend({
    events: {
      'click': '_onClick'
    },

    initialize: function() {
      this._onImageLoad = this._onImageLoad.bind(this);
      this._onImageFail = this._onImageFail.bind(this);
      this._onClick = this._onClick.bind(this);
    },

    /**
     * Отрисовка фотографии
     * @override
     */
    render: function() {
      this.el.querySelector('.picture-likes').textContent = this.model.get('likes');
      this.el.querySelector('.picture-comments').textContent = this.model.get('comments');

      if (this.model.get('url')) {
        var photoImage = new Image();

        photoImage.src = this.model.get('url');

        this._imageLoadTimeout = setTimeout(function() {
          this.el.classList.add('picture-load-failure');
        }.bind(this), REQUEST_FAILURE_TIMEOUT);

        photoImage.addEventListener('load', this._onImageLoad);
        photoImage.addEventListener('error', this._onImageFail);
        photoImage.addEventListener('abort', this._onImageFail);

        if (this.model.get('preview')) {
          photoImage.addEventListener('load', this._onImageLoad);
          photoImage.addEventListener('error', this._onImageFail);
          photoImage.addEventListener('abort', this._onImageFail);
          photoImage.src = this.model.get('preview');
        }
      }
    },

    /**
     * Обработчик клика по фотографии
     * @param  {MouseEvent} evt
     * @private
     */
    _onClick: function(evt) {
      evt.preventDefault();
      var clickedElement = evt.target;

      if (!clickedElement.classList.contains('picture-load-failure')) {
        this.trigger('galleryclick');
      }
    },

    /**
     * Обработчик клика по лайку
     * @param {Event} evt
     * @private
     */
    _onClickLike: function(evt) {
      evt.preventDefault();
      this.model.likeToggle();
    },

    /**
     * @param {Event} evt
     * @private
     */
    _onImageLoad: function(evt) {
      var loadedPhoto = evt.path[0];

      loadedPhoto.style.width = '182px';
      loadedPhoto.style.height = '182px';

      this._cleanupPhotoListeners(loadedPhoto);

      var oldPhoto = this.el.querySelector('.picture img');
      this.el.replaceChild(loadedPhoto, oldPhoto);

      this.el.classList.remove('picture-load-failure');
      clearTimeout(this._imageLoadTimeout);
    },

    /**
     * @param {Event} evt
     * @private
     */
    _onImageFail: function(evt) {
      var failedPhoto = evt.path[0];
      this._cleanupPhotoListeners(failedPhoto);
      this.el.classList.add('picture-load-failure');
      clearTimeout(this._imageLoadTimeout);
    },

    /**
     * @param {Image} image
     * @private
     */
    _cleanupPhotoListeners: function(image) {
      image.removeEventListener('load', this._onImageLoad);
      image.removeEventListener('error', this._onImageError);
      image.removeEventListener('abort', this._onImageError);
    }

  });

  return PhotoView;
});

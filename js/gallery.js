'use strict';

(function() {
  var Key = {
    'LEFT': 37,
    'RIGHT': 39,
    'ESC': 27
  };

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  var Gallery = function() {
    this._element = document.body.querySelector('.gallery-overlay');
    this._closeButton = this._element.querySelector('.gallery-overlay-close');
    this._pictureElement = this._element.querySelector('.gallery-overlay-preview');
    this._currentPhoto = 0;
    this._photos = [];

    this._onCloseClick = this._onCloseClick.bind(this);
    this._onPhotoClick = this._onPhotoClick.bind(this);
    this._onDocumentKeyDown = this._onDocumentKeyDown.bind(this);
  };

  Gallery.prototype.show = function() {
    this._element.classList.remove('invisible');
    this._closeButton.addEventListener('click', this._onCloseClick);
    this._pictureElement.addEventListener('click', this._onPhotoClick);
    document.body.addEventListener('keydown', this._onDocumentKeyDown);
    this._showCurrentPhoto();
  };

  Gallery.prototype.hide = function() {
    this._element.classList.add('invisible');
    this._closeButton.removeEventListener('click', this._onCloseClick);
    this._pictureElement.removeEventListener('click', this._onPhotoClick);
    document.body.removeEventListener('keydown', this._onDocumentKeyDown);
    this._currentPhoto = 0;
  };

  Gallery.prototype.setPhotos = function(photos) {
    this._photos = photos;
  };

  Gallery.prototype._onCloseClick = function(evt) {
    evt.preventDefault();
    this.hide();
  };

  Gallery.prototype._onPhotoClick = function() {
    this.setCurrentPhoto(this._currentPhoto + 1);
  };

  Gallery.prototype.setCurrentPhoto = function(index) {
    index = clamp(index, 0, this._photos.length - 1);

    if (this._currentPhoto === index) {
      return;
    }

    this._currentPhoto = index;
    this._showCurrentPhoto();
  };

  Gallery.prototype.setCurrentPhotoByUrl = function(url) {
    this.setCurrentPhoto(this._photos.indexOf(url));
  };

  Gallery.prototype._showCurrentPhoto = function() {
    this._pictureElement.innerHTML = '';

    var imageElement = new Image();
    imageElement.src = this._photos[this._currentPhoto];
    imageElement.classList.add('gallery-overlay-image');
    imageElement.onload = function() {
      if (!this._pictureElement.querySelector('.gallery-overlay-image')) {
        this._pictureElement.appendChild(imageElement);
      }
    }.bind(this);
    imageElement.onerror = function() {
      this.setCurrentPhoto(this._currentPhoto + 1);
    }.bind(this);
  };

  Gallery.prototype._onDocumentKeyDown = function(evt) {
    switch (evt.keyCode) {
      case Key.LEFT:
        this.setCurrentPhoto(this._currentPhoto - 1);
        break;
      case Key.RIGHT:
        this.setCurrentPhoto(this._currentPhoto + 1);
        break;
      case Key.ESC:
        this.hide();
        break;
      default:
        break;
    }
  };

  window.Gallery = Gallery;
})();

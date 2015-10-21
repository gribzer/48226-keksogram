'use strict';

(function() {
  var REQUEST_FAILURE_TIMEOUT = 10000;
  var picturesTemplate = document.querySelector('.picture-template');

  var Photo = function(data) {
    this._data = data;
    this._element = null;
    this._onClick = this._onClick.bind(this);
  };

  Photo.prototype.render = function(container) {
    var newPictureElement = picturesTemplate.content.children[0].cloneNode(true);

    newPictureElement.querySelector('.picture-comments').textContent = this._data['comments'];
    newPictureElement.querySelector('.picture-likes').textContent = this._data['likes'];

    container.appendChild(newPictureElement);

    if (this._data['url']) {
      var newImage = new Image();
      newImage.src = this._data['url'];
      newImage.width = 182;
      newImage.height = 182;

      var imageLoadTimeout = setTimeout(function() {
        newPictureElement.classList.add('picture-load-failure');
      }, REQUEST_FAILURE_TIMEOUT);

      newImage.onload = function() {
        var oldImage = newPictureElement.getElementsByTagName('img')[0];
        var oldImageNode = oldImage.parentNode;
        oldImageNode.replaceChild(newImage, oldImage);
        clearTimeout(imageLoadTimeout);
      }

      newImage.onerror = function() {
        newPictureElement.classList.add('picture-load-failure');
      }

      this._element = newPictureElement;
      this._element.addEventListener('click', this._onClick);
    }
  };

  Photo.prototype.unrender = function() {
    this._element.parentNode.removeChild(this._element);
    this._element.removeEventListener('click', this._onClick);
    this._element = null;
  };

  Photo.prototype._onClick = function() {
    if (!this._element.classList.contains('picture-load-failure')) {
      var galleryClick = new CustomEvent('galleryclick', {detail: {pictureElement: this}});
      window.dispatchEvent(galleryClick);
    }
  };

  Photo.prototype.getCurrentPhoto = function() {
    return this._data.url;
  };

  window.Photo = Photo;
})();

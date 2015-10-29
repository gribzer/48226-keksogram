/* global GalleryPicture: true PhotoModel: true Backbone: true */

'use strict';

(function() {
  /**
   * Список констант кодов нажатых клавиш для обработки
   * клавиатурных событий.
   * @enum {number}
   */
  var Key = {
    'ESC': 27,
    'LEFT': 37,
    'RIGHT': 39
  };

  /**
   * Функция, "зажимающая" переданное значение value между значениями
   * min и max. Возвращает value которое будет не меньше min
   * и не больше max.
   * @param {number} value
   * @param {number} min
   * @param {number} max
   * @return {number}
   */
  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  /**
   * Конструктор объекта фотогалереи. Создает свойства, хранящие ссылки на элементы
   * галереи, служебные данные (номер показанной фотографии и список фотографий)
   * и фиксирует контекст у обработчиков событий.
   * @constructor
   */
  var Gallery = function() {
    this._photos = new Backbone.Collection();

    this._element = document.querySelector('.gallery-overlay');
    this._closeButton = this._element.querySelector('.gallery-overlay-close');
    this._pictureElement = this._element.querySelector('.gallery-overlay-preview');
    this._likesToggle = this._element.querySelector('.likes-count');

    this._currentPhoto = -1;

    this._onCloseClick = this._onCloseClick.bind(this);
    this._onPhotoClick = this._onPhotoClick.bind(this);
    this._onClickLike = this._onClickLike.bind(this);
    this._onDocumentKeyDown = this._onDocumentKeyDown.bind(this);
  };

  /**
   * Записывает список фотографий для галереи в коллекцию
   * @param  {Collection} photos
   */
  Gallery.prototype.setPhotos = function(photos) {
    this._photos = photos;
  };

  /**
   * Показывает фото в галерее
   * @param  {Model} photoModel
   * @private
   */
  Gallery.prototype._showCurrentPhoto = function() {
    var galleryElement = new GalleryPicture({
      model: this._photos.at(this._currentPhoto)
    });
    galleryElement.render();
    this._element.querySelector('.likes-count').innerHTML = galleryElement.model.get('likes');
    this._element.querySelector('.comments-count').innerHTML = galleryElement.model.get('comments');
    var currentPicture = this._pictureElement.querySelector('img');
    currentPicture.parentNode.replaceChild(galleryElement.el, currentPicture);
  };

  /**
   * Устанавливает номер фотографии, которую нужно показать, предварительно
   * "зажав" его между 0 и количеством фотографий в галерее минус 1 (чтобы нельзя
   * было показать фотографию номер -1 или номер 100 в массиве из четырех
   * фотографий), и показывает ее на странице.
   * @param {number} index
   */
  Gallery.prototype.setCurrentPhoto = function(index) {
    index = clamp(index, 0, this._photos.length - 1);

    if (this._currentPhoto === index) {
      return;
    }

    this._currentPhoto = index;
    this._showCurrentPhoto();
  };

  /**
   * Показывает фотогалерею, убирая у контейнера класс invisible. Затем добавляет
   * обработчики событий и показывает текущую фотографию.
   */
  Gallery.prototype.show = function() {
    this._element.classList.remove('invisible');
    this._closeButton.addEventListener('click', this._onCloseClick);
    this._pictureElement.addEventListener('click', this._onPhotoClick);
    this._likesToggle.addEventListener('click', this._onClickLike);
    document.body.addEventListener('keydown', this._onDocumentKeyDown);
  };

  /**
   * Прячет галерею и убирает обработчик закрытия галереи
   */
  Gallery.prototype.hide = function() {
    this._element.classList.add('invisible');
    this._closeButton.removeEventListener('click', this._onCloseClick);
    this._pictureElement.removeEventListener('click', this._onPhotoClick);
    this._likesToggle.removeEventListener('click', this._onClickLike);
    document.body.removeEventListener('keydown', this._onDocumentKeyDown);
  };

  /**
   * Обработчик клавиатурных событий. Прячет галерею при нажатии Esc
   * и переключает фотографии при нажатии на стрелки.
   * @param {Event} evt
   * @private
   */
  Gallery.prototype._onDocumentKeyDown = function(evt) {
    switch (evt.keyCode) {
      case Key.ESC:
        this.hide();
        break;
      case Key.LEFT:
        this.setCurrentPhoto(this._currentPhoto - 1);
        break;
      case Key.RIGHT:
        this.setCurrentPhoto(this._currentPhoto + 1);
        break;
    }
  };

  /**
   * При нажатие на клик вызывается обработка количетва "лайков"
   * @param {Event} evt
   * @private
   */
  Gallery.prototype._onClickLike = function(evt) {
    evt.stopPropagation();
    this.model.likeToggle();
  },

  /**
   * Обработчик события клика по текущецй фотографии. Вызывает метод setCurrentPhoto.
   * @param {Event} evt
   * @private
   */
  Gallery.prototype._onPhotoClick = function() {
    this.setCurrentPhoto(this._currentPhoto + 1);
  };

  /**
   * Обработчик события клика по крестику закрытия. Вызывает метод hide.
   * @param {Event} evt
   * @private
   */
  Gallery.prototype._onCloseClick = function(evt) {
    evt.preventDefault();
    this.hide();
  };

  window.Gallery = Gallery;
})();

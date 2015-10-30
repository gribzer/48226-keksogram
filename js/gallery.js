'use strict';

define([
  'views/photo-preview',
  'views/video-preview'
], function(GalleryPicture, GalleryVideo) {
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
    this._imageElement = this._element.querySelector('.gallery-overlay-image');

    this._currentPhoto = -1;

    this._onCloseClick = this._onCloseClick.bind(this);
    this._onPhotoClick = this._onPhotoClick.bind(this);
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
    this._currentModel = this._photos.at(this._currentPhoto);

    if (this._currentModel.get('preview')) {
      this._galleryView = new GalleryVideo({
        model: this._currentModel,
        el: document.querySelector('.gallery-overlay-preview')
      });
    } else {
      this._galleryView = new GalleryPicture({
        model: this._currentModel,
        el: document.querySelector('.gallery-overlay-preview')
      });
    }

    this._galleryView.render();
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
    this._imageElement.addEventListener('click', this._onPhotoClick);
    document.body.addEventListener('keydown', this._onDocumentKeyDown);
  };

  /**
   * Прячет галерею и убирает обработчик закрытия галереи
   */
  Gallery.prototype.hide = function() {
    this._element.classList.add('invisible');
    this._closeButton.removeEventListener('click', this._onCloseClick);
    this._imageElement.removeEventListener('click', this._onPhotoClick);
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

  return Gallery;
});

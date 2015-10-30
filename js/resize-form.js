/* global resizer: true */

'use strict';

define(function() {
  /**
   * Форма загрузки фотографии.
   * @type {Element}
   */
  var uploadForm = document.forms['upload-select-image'];

  /**
   * Форма кадрирования фотографии.
   * @type {Element}
   */
  var resizeForm = document.forms['upload-resize'];

  /**
   * Форма установки фильтра на фотографитю.
   * @type {Element}
   */
  var filterForm = document.forms['upload-filter'];

  /**
   * @type {Element}
   */
  var previewImage = resizeForm.querySelector('.resize-image-preview');

  /**
   * @type {Element}
   */
  var prevButton = resizeForm['resize-prev'];

  /**
   * @type {Element}
   */
  var resizeX = resizeForm['resize-x'];

  /**
   * @type {Element}
   */
  var resizeY = resizeForm['resize-y'];

  /**
   * @type {Element}
   */
  var resizeSide = resizeForm['resize-size'];

  /**
   * @type {number}
   */
  var pictureHeight;

  /**
   * @type {number}
   */
  var pictureWidth;

  /**
   * @type {number}
   */
  var pictureConstraint;

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
   * Обработчик клика по кнопке назад.
   * @param {Event} evt
   */
  prevButton.onclick = function(evt) {
    evt.preventDefault();

    resizeForm.reset();
    uploadForm.reset();
    resizeForm.classList.add('invisible');
    uploadForm.classList.remove('invisible');
  };

  /**
   * Обработчик отправки формы.
   * @param {Event} evt
   */
  resizeForm.onsubmit = function(evt) {
    evt.preventDefault();
    filterForm.elements['filter-image-src'] = previewImage.src;
    filterForm.querySelector('.filter-image-preview').src = resizer.exportImage().src;
    resizeForm.classList.add('invisible');
    filterForm.classList.remove('invisible');
  };

  /**
   * Обработчик изменения размера области кадрирования.
   */
  resizeSide.onchange = function() {
    resizeSide.value = clamp(Number(resizeSide.value), Number(resizeSide.min), Number(resizeSide.max));
    pictureConstraint = resizer.getConstraint();
    var differenceOfSide = Math.floor((pictureConstraint.side - Number(resizeSide.value)) / 2);
    resizer.setConstraint(pictureConstraint.x + differenceOfSide, pictureConstraint.y + differenceOfSide, Number(resizeSide.value));

    var pictureCanvas = document.querySelector('canvas');
    resizeX.max = Math.max(pictureWidth - resizeSide.value, 0);
    resizeY.max = Math.max(pictureHeight - resizeSide.value, 0);
    resizeSide.max = Math.min(pictureCanvas.width, pictureCanvas.height);

    resizeSide.value = Math.floor(pictureConstraint.side);

    resizeX.value = Math.floor(pictureConstraint.x);
    resizeY.value = Math.floor(pictureConstraint.y);
  };

  /**
   * Обработчик изменения значения отступа относительно оси X.
   */
  resizeX.onchange = function() {
    resizeX.value = clamp(Number(resizeX.value), Number(resizeX.min), Number(resizeX.max));
    resizer.setConstraint(Number(resizeX.value), Number(resizeY.value), Number(resizeSide.value));
  };

  /**
   * Обработчик изменения значения отступа относительно оси Y.
   */
  resizeY.onchange = function() {
    resizeY.value = clamp(Number(resizeY.value), Number(resizeY.min), Number(resizeY.max));
    resizer.setConstraint(Number(resizeX.value), Number(resizeY.value), Number(resizeSide.value));
  };

  /**
   * Обработчик запускающий проверку, что новые значения ограничений
   * не превышают допустимые и менющий их при необходимости.
   */
  window.addEventListener('resizerchange', function() {
    pictureConstraint = resizer.getConstraint();
    var x = clamp(
      Math.floor(pictureConstraint.x),
      parseFloat(resizeX.min),
      parseFloat(resizeX.max));
    var y = clamp(
      Math.floor(pictureConstraint.y),
      parseFloat(resizeY.min),
      parseFloat(resizeY.max));
    resizeX.value = x;
    resizeY.value = y;

    if (pictureConstraint.x !== x || pictureConstraint.y !== y) {
      resizer.setConstraint(x, y, Number(resizeSide.value));
    }
  });

  /**
   * Обоаботчик, который устанавливает ограничения по умолчанию для вновь
   * загруженного изображения.
   */
  window.addEventListener('pictureload', function() {
    pictureConstraint = resizer.getConstraint();
    pictureHeight = resizer.getHeight();
    pictureWidth = resizer.getWidth();
    resizeSide.value = pictureConstraint.side;

    resizeX.max = Math.max(pictureWidth - resizeSide.value, 0);
    resizeY.max = Math.max(pictureHeight - resizeSide.value, 0);
    resizeSide.max = Math.min(pictureWidth, pictureHeight);

    resizeX.min = 0;
    resizeY.min = 0;
    resizeSide.min = 50;

    resizeX.value = Math.floor(pictureConstraint.x);
    resizeY.value = Math.floor(pictureConstraint.y);
    resizeSide.value = Math.floor(pictureConstraint.side);
  });
});

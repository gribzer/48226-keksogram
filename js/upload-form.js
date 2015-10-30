/*global resizer: true*/

'use strict';

define([
  'resize-form',
  'resize-picture'
], function(Resizer) {
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

  var fileElement = uploadForm['upload-file'];

  /**
   * Функция загрузки нового изображения.
   * @param  {Element}   element
   * @param  {function} callback
   */
  function uploadImage(element, callback) {
    var fileReader = new FileReader();
    fileReader.onload = function(evt) {
      var image = evt.target.result;
      callback(image);
    };

    fileReader.readAsDataURL(element.files[0]);
  }

  /**
   * Обработчик, проверяющий загружено изображение или нет.
   */
  fileElement.onchange = function() {
    if (fileElement.value) {
      fileElement.classList.add('upload-input-hasvalue');
    }
  };

  /**
   * Обработчик отправки загруженного изображения.
   * @param  {Event} evt [description]
   */
  uploadForm.onsubmit = function(evt) {
    evt.preventDefault();

    uploadImage(fileElement, function(image) {
      sessionStorage.setItem('uploaded-image', image);

      resizer = new Resizer(image);
      resizer.setElement(resizeForm);

      filterForm.querySelector('.filter-image-preview').src = image;

      uploadForm.classList.add('invisible');
      resizeForm.classList.remove('invisible');
    });
  };

  /**
   * Обработчик сброса загруженного изображения.
   */
  uploadForm.onreset = function() {
    fileElement.classList.remove('upload-input-hasvalue');
  };
});

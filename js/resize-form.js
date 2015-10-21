'use strict';

(function() {
  var uploadForm = document.forms['upload-select-image'];
  var resizeForm = document.forms['upload-resize'];
  var filterForm = document.forms['upload-filter'];

  var previewImage = resizeForm.querySelector('.resize-image-preview');
  var prevButton = resizeForm['resize-prev'];
  var resizeX = resizeForm['resize-x'];
  var resizeY = resizeForm['resize-y'];
  var resizeSize = resizeForm['resize-size'];
  var MINIMAL_SIDE_VALUE = 50;

  resizeX.min = 0;
  resizeY.min = 0;
  resizeSize.min = MINIMAL_SIDE_VALUE;
  resizeX.required = true;
  resizeY.required = true;
  resizeSize.required = true;

  previewImage.onload = function() {
    var imageWidth = previewImage.clientWidth;
    var imageHeight = previewImage.clientHeight;
    var imageMinimalSide = Math.min(imageWidth, imageHeight);

    resizeX.max = imageMinimalSide - 1;
    resizeY.max = resizeX.max;
    resizeSize.max = imageMinimalSide - parseInt(resizeX.value, 10);

    var elementToListen = imageMinimalSide === imageWidth ? resizeX : resizeY;
    elementToListen.onchange = function() {
      resizeSize.max = imageMinimalSide - parseInt(elementToListen.value, 10);
    };
  };

  prevButton.onclick = function(evt) {
    evt.preventDefault();

    resizeForm.reset();
    uploadForm.reset();
    resizeForm.classList.add('invisible');
    uploadForm.classList.remove('invisible');
  };

  resizeForm.onsubmit = function(evt) {
    evt.preventDefault();
    filterForm.elements['filter-image-src'] = previewImage.src;


    resizeForm.classList.add('invisible');
    filterForm.classList.remove('invisible');
  };
})();

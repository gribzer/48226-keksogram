/* global resizer: true */

'use strict';

define(function() {
  var uploadForm = document.forms['upload-select-image'];
  var resizeForm = document.forms['upload-resize'];
  var filterForm = document.forms['upload-filter'];

  var previewImage = resizeForm.querySelector('.resize-image-preview');
  var prevButton = resizeForm['resize-prev'];

  var resizeX = resizeForm['resize-x'];
  var resizeY = resizeForm['resize-y'];
  var resizeSide = resizeForm['resize-size'];
  var pictureHeight;
  var pictureWidth;
  var pictureConstraint;

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

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
    filterForm.querySelector('.filter-image-preview').src = resizer.exportImage().src;
    resizeForm.classList.add('invisible');
    filterForm.classList.remove('invisible');
  };

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

  resizeX.onchange = function() {
    resizeX.value = clamp(Number(resizeX.value), Number(resizeX.min), Number(resizeX.max));
    resizer.setConstraint(Number(resizeX.value), Number(resizeY.value), Number(resizeSide.value));
  };

  resizeY.onchange = function() {
    resizeY.value = clamp(Number(resizeY.value), Number(resizeY.min), Number(resizeY.max));
    resizer.setConstraint(Number(resizeX.value), Number(resizeY.value), Number(resizeSide.value));
  };

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

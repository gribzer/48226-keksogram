'use strict';

(function() {
  var Key = {
    'LEFT': 37,
    'RIGHT': 39,
    'ESC': 27
  };

  var picturesContainer = document.querySelector('.pictures');
  var galleryElement = document.querySelector('.gallery-overlay');
  var closeButton = galleryElement.querySelector('.gallery-overlay-close');

  function doesHaveParent(element, className) {
    do {
      if (element.classList.contains(className)) {
        return !element.classList.contains('picture-load-failure');
      }
      element = element.parentElement;
        
    } while (element);
      
    return false;
  }
    
  function hideGallery() {
    galleryElement.classList.add('invisible');
    closeButton.removeEventListener('click', closeHandler);
    document.body.removeEventListener('keyup', keyHandler);
  }
    
  function closeHandler(evt) {
    evt.preventDefault();
    hideGallery();
  }
    
  function keyHandler(evt) {
    switch (evt.keyCode) {
      case Key.LEFT:
        break;
      case Key.RIGHT:
        break;
      case Key.ESC:
      default:
        hideGallery();
        break;
    }
  }
    
  function showGallery() {
    galleryElement.classList.remove('invisible');
    closeButton.addEventListener('click', closeHandler);
    document.body.addEventListener('keyup', keyHandler);
  }
    
  picturesContainer.addEventListener('click', function(evt) {
    evt.preventDefault();
      
    if (doesHaveParent(evt.target, 'picture')) {
      showGallery();
    }
  });
    
})();

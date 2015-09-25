(function() {
    var filtersForm = document.querySelector('.filters');
    var picturesContainer = document.querySelector('.pictures');
    var picturesTemplate = document.getElementById('picture-template');
    
    var picturesFragment = document.createDocumentFragment();
    
    filtersForm.classList.add('hidden');
    
    pictures.forEach(function(picture, i) {
      var newPictureElement = picturesTemplate.content.children[0].cloneNode(true);
      
      newPictureElement.querySelector('.picture-comments').textContent = picture['comments'];
      newPictureElement.querySelector('.picture-likes').textContent = picture['likes'];
        
      if (picture['url']) {
        var newImage = new Image();
        newImage.src = picture['url'];
        newImage.width = 182;
        newImage.height = 182;
        
        newImage.onload = function() {
          var oldImage = newPictureElement.getElementsByTagName('img')[0];
          var oldImageNode = oldImage.parentNode;
          oldImageNode.replaceChild(newImage, oldImage);
        }
        
        newImage.onerror = function() {
          newPictureElement.classList.add('picture-load-failure');
        }
      }
        console.log(newPictureElement);
      picturesFragment.appendChild(newPictureElement);
    });
    picturesContainer.appendChild(picturesFragment);
    
    filtersForm.classList.remove('hidden');
})();
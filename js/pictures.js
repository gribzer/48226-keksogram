(function() {
    var filtersForm = document.querySelector('.filters');
    var picturesContainer = document.querySelector('.pictures');
    
    var ReadyState = {
        'UNSENT' : 0,
        'OPENED' : 1,
        'HEADERS_RECIEVED' : 2,
        'LOADING' : 3,
        'DONE' : 4
    };
    
    //Скрытие блока с фильтрами
    filtersForm.classList.add('hidden');

    //Данные отображаемые при ошибке
    function showDataFailure() {
      picturesContainer.classList.add('pictures-failure');
    }
    
    //Формирование изображений на странице по шаблону
    function createPictures(pictures) {
      var picturesTemplate = document.getElementById('picture-template');
      var picturesFragment = document.createDocumentFragment();   
      
      picturesContainer.innerHTML = '';
        
      pictures.forEach(function(picture) {
        var newPictureElement = picturesTemplate.content.children[0].cloneNode(true);
      
        newPictureElement.querySelector('.picture-comments').textContent = picture.comments;
        newPictureElement.querySelector('.picture-likes').textContent = picture.likes;
        
        if (picture['url']) {
          var newImage = new Image();
          newImage.src = picture.url;
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
          
          picturesFragment.appendChild(newPictureElement);
        }
      });
        
      picturesContainer.appendChild(picturesFragment);
    }
    
    //Отображение блока с фильтрами
    filtersForm.classList.remove('hidden');
    
    //Загрузка изображений на сервер
    function loadPictures(callback) {
      var xhr = new XMLHttpRequest();
      xhr.timeout = 10000;
      xhr.open('get', 'data/pictures.json');
      xhr.send();
        
      xhr.onreadystatechange = function(evt) {
        var loadedXhr = evt.target;
          
        switch (loadedXhr.readyState) {
          case ReadyState.OPENED:
          case ReadyState.HEADERS_RECIEVED:
          case ReadyState.LOADING:
            picturesContainer.classList.add('pictures-loading');
            break;
          case ReadyState.DONE:
          default:
            if (xhr.status == 200) {
              var data = loadedXhr.response;
              picturesContainer.classList.remove('pictures-loading');
              callback(JSON.parse(data));
            }
                
            if (xhr.status == 400) {
              showDataFailure();
            }
            break;
        }
      }
    
      xhr.ontimeout = function() {
        showDataFailure();
      }
    }
    
    //Управление блоком фильтров
    function filterPictures(pictures, filterValue) {
      var filteredPictures = pictures.slice(0);
      switch (filterValue) {
          case 'new':
            filteredPictures = filteredPictures.sort(function(a, b) {
              if (a.date < b.date) {
                return 1;
              }
              if (a.date > b.date) {
                return -1;
              }
              if (a.date === b.date) {
                return 0;
              }
            });
            break;
          case 'discussed':
            filteredPictures = filteredPictures.sort(function(a, b) {
              if (a.comments < b.comments) {
                return 1;
              }
              if (a.comments > b.comments) {
                return -1;
              }
              if (a.comments === b.comments) {
                return 0;
              }
            });
            break;

          default:
            filteredPictures = pictures.slice(0);
            break;
      }
    
      return filteredPictures;
    }
    
    //Обработка активного фильтра
    function setActiveFilter(filterValue) {
        var filteredPictures = filterPictures(pictures, filterValue);
        createPictures(filteredPictures);
    }
    
    //Инициализация фильтров
    function initFilters() {
      var filterElements = filtersForm['filter'];
      for (var i = 0, l = filterElements.length; i < l; i++) {
        filterElements[i].onchange = function(evt) {
          var clickedFilter = evt.currentTarget;
          setActiveFilter(clickedFilter.value);
        }
      }
    }
    
    initFilters();
    loadPictures(function(loadedPictures) {
      pictures = loadedPictures;
      setActiveFilter('popular');
    });
})();
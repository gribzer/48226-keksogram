(function() {
    var filtersForm = document.querySelector('.filters');
    var picturesContainer = document.querySelector('.pictures');
    
    var REQUEST_FAILURE_TIMEOUT = 10000;
    var PAGE_SIZE = 12;
    
    var currentPage;
    var currentPictures;
    
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
    function createPictures(pictures, pageNumber, replace) {
      replace = typeof replace !== 'underfined' ? replace : true;
      pageNumber = pageNumber || 0;
        
      if (replace) {
        picturesContainer.classList.remove('pictures-failure');
        picturesContainer.innerHTML = '';
      }
        
      var picturesTemplate = document.querySelector('.picture-template');
      var picturesFragment = document.createDocumentFragment();   
      
      var picturesFrom = pageNumber * PAGE_SIZE;
      var picturesTo = picturesFrom + PAGE_SIZE;
      pictures = pictures.slice(picturesFrom, picturesTo);
        
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
      xhr.timeout = REQUEST_FAILURE_TIMEOUT;
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
                
            if (xhr.status >= 400) {
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
              return b.comments - a.comments;
            });
            break;

          default:
            break;
      }
      
      localStorage.setItem('filterValue', filterValue);
      return filteredPictures;
    }
    
    //Обработка активного фильтра
    function setActiveFilter(filterValue) {
      currentPage = 0;
      currentPictures = filterPictures(pictures, filterValue);
      createPictures(currentPictures, currentPage, true);
      loadMorePages();
    }
    
    //Проверка на возможность загрузки следующей страницы
    function checkNextPage() {
      if (isAtTheBottom() && isNextPageAvailable()) {
        window.dispatchEvent(new CustomEvent('loadneeded'));
      } 
    }
    
    //Проверка на доступность следующей страницы
    function isNextPageAvailable() {
      return currentPage < Math.ceil(pictures.length / PAGE_SIZE);
    }
    
    //Проверка нахождения внизу страницы
    function isAtTheBottom() {
      var paddingBottom = 100;
      return picturesContainer.getBoundingClientRect().bottom - paddingBottom <= window.innerHeight;
    }
    
    //Можно ли загрузить еще страницы при первой загрузке
    function loadMorePages() {
      if (!(document.body.offsetHeight == document.body.scrollHeight) && isNextPageAvailable()) {
        createPictures(currentPictures, currentPage++, false);
      }
    }
    
    //Можно ли загрузить страницы при изменении размера окна
    function initWindowResize() {
      window.addEventListener('resize', function() {
        loadMorePages()
      });
    }
    
    //Подгрузка новых изображение при прокрутке страницы
    function initScroll() {
      var someTimeout;
      window.addEventListener('scroll', function() {
        clearTimeout(someTimeout);
        someTimeout = setTimeout(checkNextPage, 100);
      });
        
      window.addEventListener('loadneeded', function() {
        createPictures(currentPictures, currentPage++, false);
      });
    }
    
    //Инициализация фильтров
    function initFilters() {      
      filtersForm.addEventListener('click', function(evt) {
        var clickedFilter = evt.target;
        setActiveFilter(clickedFilter.value);
      });
    }
    
    initFilters();
    initScroll();
    initWindowResize();
        
    loadPictures(function(loadedPictures) {
      pictures = loadedPictures;
      setActiveFilter(localStorage.getItem('filterValue') || 'popular');
    });
})();
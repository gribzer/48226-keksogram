/* global
     Gallery: true
     PhotosCollection: true
     PhotoView: true
*/

'use strict';

(function() {
  var filtersForm = document.querySelector('.filters');

  /**
   * Контейнер для фотографий
   * @type {Element}
   */
  var photosContainer = document.querySelector('.pictures');

  /**
   * @const
   * @type {number}
   */
  var REQUEST_FAILURE_TIMEOUT = 10000;

  /**
   * @const
   * @type {number}
   */
  var PAGE_SIZE = 12;

  /**
   * Объект типа коллекция фотографий
   * @type {PhotosCollection}
   */
  var photosCollection = new PhotosCollection();

  /**
   * Объект типа фотогалерея.
   * @type {Gallery}
   */
  var gallery = new Gallery();

  /**
   * @type {number}
   */
  var currentPage = 0;

  /**
   * @type {Array.<Object>}
   */
  var initiallyLoaded = [];

  /**
   * @type {Array.<HotelView>}
   */
  var renderedViews = [];

  /**
   * Скрытие блока с фильтрами
   */
  filtersForm.classList.add('hidden');

  /**
   * Добавляет класс ошибки, если ошибка загрузки фотографии
   */
  function showDataFailure() {
    photosContainer.classList.add('pictures-failure');
  }

  /**
   * Выводит фотографии постранично
   * @param  {number} pageNumber
   * @param  {boolean} replace
   */
  function renderPictures(pageNumber, replace) {
    replace = typeof replace !== 'undefined' ? replace : true;
    pageNumber = pageNumber || 0;

    if (replace) {
      while (renderedViews.length) {
        var viewToRemove = renderedViews.shift();

        photosContainer.removeChild(viewToRemove.el);
        photosContainer.classList.remove('pictures-failure');
        viewToRemove.off('galleryclick');
        viewToRemove.remove();
      }
    }

    var photosFragment = document.createDocumentFragment();

    var photosFrom = pageNumber * PAGE_SIZE;
    var photosTo = photosFrom + PAGE_SIZE;
    var photosTemplate = document.getElementById('picture-template');

    photosCollection.slice(photosFrom, photosTo).forEach(function(model) {
      var view = new PhotoView({
        model: model,
        el: photosTemplate.content.children[0].cloneNode(true)
      });
      view.render();
      photosFragment.appendChild(view.el);
      renderedViews.push(view);

      view.on('galleryclick', function() {
        gallery.setPhotos(photosCollection);
        gallery.show();
        gallery.setCurrentPhoto(0);
      });
    });

    photosContainer.appendChild(photosFragment);
  }

  //Управление блоком фильтров
  function filterPictures(filterValue) {
    var filteredPictures = initiallyLoaded.slice(0);
    switch (filterValue) {
      case 'new':
        filteredPictures.sort(function(a, b) {
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
        filteredPictures.sort(function(a, b) {
          return b.comments - a.comments;
        });
        break;

      default:
        break;
    }

    photosCollection.reset(filteredPictures);
    localStorage.setItem('filterName', filterValue);
    return filteredPictures;
  }

  /**
   * Устанавливает фильтр фотографий
   * @param {string} filterValue
   */
  function setActiveFilter(filterValue) {
    currentPage = 0;
    filterPictures(filterValue);
    renderPictures(currentPage++, true);
    loadMorePages();
  }

  /**
   * Проверка на возможность загрузки следующей страниц
   */
  function checkNextPage() {
    if (isAtTheBottom() && isNextPageAvailable()) {
      window.dispatchEvent(new CustomEvent('loadneeded'));
    }
  }

  /**
   * Проверка доступности следующей страницы для отрисовки
   * @return {boolean}
   */
  function isNextPageAvailable() {
    return currentPage < Math.ceil(photosCollection.length / PAGE_SIZE);
  }

  /**
   * Проверка нахождения внизу страницы
   * @return {boolean}
   */
  function isAtTheBottom() {
    var paddingBottom = 100;
    return photosContainer.getBoundingClientRect().bottom - paddingBottom <= window.innerHeight;
  }

  /**
   * Проверка на возможность загрузить дополнительные страницы при первой загрузке
   */
  function loadMorePages() {
    if (!(document.body.offsetHeight === document.body.scrollHeight) && isNextPageAvailable()) {
      renderPictures(currentPage++, false);
    }
  }

  /**
   * Проверка на возможность загрузить страницы при изменении размера окна
   */
  function initWindowResize() {
    window.addEventListener('resize', function() {
      loadMorePages();
    });
  }

  /**
   * Подгрузка новых изображение при прокрутке страницы
   */
  function initScroll() {
    var someTimeout;
    window.addEventListener('scroll', function() {
      clearTimeout(someTimeout);
      someTimeout = setTimeout(checkNextPage, 100);
    });

    window.addEventListener('loadneeded', function() {
      renderPictures(currentPage++, false);
    });
  }

  /**
   * Обработчик события клика по фильтру
   */
  function initFilters() {
    filtersForm.addEventListener('click', function(evt) {
      var clickedFilter = evt.target;
      setActiveFilter(clickedFilter.value);
    });
  }

  photosCollection.fetch({timeout: REQUEST_FAILURE_TIMEOUT}).success(function(loaded, state, jqXHR) {
    initiallyLoaded = jqXHR.responseJSON;
    initFilters();
    initScroll();
    initWindowResize();

    var activeFilter = localStorage.getItem('filterValue') || 'popular';
    var currentFilter = document.getElementById('filter-' + activeFilter);
    setActiveFilter(activeFilter);
    if (currentFilter !== null) {
      currentFilter.setAttribute('checked', 'checked');
    }
  }).fail(function() {
    showDataFailure();
  });

  /**
   * Отображение блока с фильтрами
   */
  filtersForm.classList.remove('hidden');

})();

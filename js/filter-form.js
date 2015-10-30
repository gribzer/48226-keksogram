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
  var previewImage = filterForm.querySelector('.filter-image-preview');

  /**
   * @type {Element}
   */
  var prevButton = filterForm['filter-prev'];

  /**
   * @type {Element}
   */
  var selectedFilter = filterForm['upload-filter'];

  /**
   * @type {boolean}
   */
  var filterMap;

  /**
   * Карта фильтров, для более удобного обращение к ним
   * @enum {number}
   */
  function setFilter() {
    if (!filterMap) {
      filterMap = {
        'none': 'filter-none',
        'chrome': 'filter-chrome',
        'sepia': 'filter-sepia'
      };
    }

    previewImage.className = 'filter-image-preview' + ' ' + filterMap[selectedFilter.value];
  }

  /**
   * Обработчик загрузки окна. Устанавливает последний использовавшийся фильтр из cookie.
   */
  window.onload = function() {
    selectedFilter.value = document.cookie.split('=')[1];
    setFilter();
  };

  for (var i = 0, l = selectedFilter.length; i < l; i++) {
    selectedFilter[i].onchange = function() {
      setFilter();
    };
  }

  /**
   * Обработчик клика по кнопке назад.
   * @param {Event} evt
   */
  prevButton.onclick = function(evt) {
    evt.preventDefault();

    filterForm.reset();
    filterForm.classList.add('invisible');
    resizeForm.classList.remove('invisible');
  };

  /**
   * Обработчик отправки формы.
   * @param {Event} evt
   */
  filterForm.onsubmit = function(evt) {
    evt.preventDefault();

    var birthday = new Date() - new Date('April 26, 1995');
    var date = new Date(new Date().getTime() + birthday);
    document.cookie = 'name=' + selectedFilter.value + '; expires=' + date.toUTCString();
    uploadForm.classList.remove('invisible');
    filterForm.classList.add('invisible');
  };

  setFilter();
});

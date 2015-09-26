(function() {
  var uploadForm = document.forms['upload-select-image'];
  var resizeForm = document.forms['upload-resize'];
  var filterForm = document.forms['upload-filter'];

  var previewImage = filterForm.querySelector('.filter-image-preview');
  var prevButton = filterForm['filter-prev'];
  var selectedFilter = filterForm['upload-filter'];

  var filterMap;

  function setFilter() {
    if (!filterMap) {
      filterMap = {
        'none': 'filter-none',
        'chrome': 'filter-chrome',
        'sepia': 'filter-sepia'
      };
    }

    previewImage.className = 'filter-image-preview' + ' ' + filterMap[selectedFilter.value];
  };

  window.onload = function(evt) {
    selectedFilter.value = document.cookie.split('=')[1];
    setFilter();
  }
    
  for (var i = 0, l = selectedFilter.length; i < l; i++) {
    selectedFilter[i].onchange = function(evt) {
      setFilter();
    }
  }

  prevButton.onclick = function(evt) {
    evt.preventDefault();

    filterForm.reset();
    filterForm.classList.add('invisible');
    resizeForm.classList.remove('invisible');
  };
  
  filterForm.onsubmit = function(evt) {
    evt.preventDefault();
        
    var birthday = new Date() - new Date('April 26, 1995');
    var date = new Date(new Date().getTime() + birthday);
    document.cookie = "name=" + selectedFilter.value + "; expires=" + date.toUTCString();
    uploadForm.classList.remove('invisible');
    filterForm.classList.add('invisible');
  }

  setFilter();
})();

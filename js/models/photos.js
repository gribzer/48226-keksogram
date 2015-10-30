'use strict';

define([
  'models/photo'
], function(PhotoModel) {
  /**
   * Конструктор Backbone коллекции фотографий
   * @constructor
   * @extends {Backbone.Collection}
   * @param (Object) attributes
   * @param (Object) options
   */
  var PhotosCollection = Backbone.Collection.extend({
    model: PhotoModel,
    url: 'data/pictures.json'
  });

  return PhotosCollection;

});

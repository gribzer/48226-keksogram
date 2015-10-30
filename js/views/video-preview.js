'use strict';

define(function() {
  var GalleryVideo = Backbone.View.extend({
    initialize: function() {
      this._onClickLike = this._onClickLike.bind(this);
      this._toggleVideo = this._toggleVideo.bind(this);

      this.listenTo(this.model, 'change:liked', this._onClickLike);
    },
    events: {
      'click .gallery-overlay-controls-like': '_onClickLike',
      'click .video': '_toggleVideo'
    },

    render: function() {
      this._photo = this.el.querySelector('.gallery-overlay-image');

      this._video = document.createElement('video');
      this._video.classList.add('video');
      this._video.src = this.model.get('url');
      this._video.poster = this.model.get('preview');
      this._video.controls = false;
      this._video.autoplay = false;
      this._video.loop = true;
      this.el.replaceChild(this._video, this._photo);

      this.el.querySelector('.likes-count').innerHTML = this.model.get('likes');
      this.el.querySelector('.comments-count').innerHTML = this.model.get('comments');
    },

    _onClickLike: function(evt) {
      evt.stopPropagation();
      this.model.likeToggle();
    },

    _toggleVideo: function(evt) {
      evt.stopPropagation();
      if (this._video.paused) {
        this._video.play();
      } else {
        this._video.pause();
      }
    },

    destroy: function() {
      this.stopListening();
      this.undelegateEvents();
    }
  });

  return GalleryVideo;
});

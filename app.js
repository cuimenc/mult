window.onerror = function myErrorHandler(errorMsg, url, lineNumber) {
  alert("Error occured: " + errorMsg);//or any message
  return false;
}

let Toggle = Vue.extend({
  template: '#vue-toggle',
  props: ['values','selected'],
  methods: {
    changeSelectVal: function(index) {
      this.$emit('update', index);
    }
  }
});

Vue.component('vue-toggle', Toggle);

var jumpDuration = 5;

var storage = function() {
  this.getVal = function (key, defaultVal) {
    var item = localStorage.getItem(key);
    return item ? parseFloat(item) : defaultVal;
  };

  this.setVal = function (key, val) {
    localStorage.setItem(key, val);
  }
};

var store = new storage();

var app = new Vue({
  el: '#app',
  data: {
    startTime: store.getVal('startTime', 0),
    endTime: store.getVal('endTime', 0),
    loop: false,
    speedOptions: [100, 50, 25],
    speedIndex: 0,
    songs: store.getVal('songs', []),
    settingView: false,
    hideControl: true,
    selectedSongIndex: store.getVal('selectedSongIndex', 0),
  },

  computed: {
    videoSrc: function () {
      return this.songs[this.selectedSongIndex];
    },
  },

  methods: {
    moveForward: function() {
      this.$refs['video'].currentTime += jumpDuration;
    },

    moveBackward: function() {
      this.$refs['video'].currentTime -= jumpDuration;
    },

    cycleSpeed: function () {
      this.speedIndex = (this.speedIndex + 1) % this.speedOptions.length;
      this.$refs['video'].playbackRate = this.speedOptions[this.speedIndex] / 100;
    },

    setStartTime: function () {
      this.startTime = this.$refs['video'].currentTime;
      store.setVal('startTime', this.startTime);
    },

    setEndTime: function () {
      this.endTime = this.$refs['video'].currentTime;
      store.setVal('endTime', this.endTime);
    },

    toggleLoop: function () {
      this.loop = !this.loop;
      store.setVal('loop', this.loop);
    },

    onTimeUpdate: function () {
      if (!this.loop) {
        return;
      }

      if (this.$refs['video'].currentTime < this.startTime || this.$refs['video'].currentTime > this.endTime) {
        this.$refs['video'].currentTime = this.startTime;
      }
    },

    selectSong: function () {
      this.settingView = true;
      this.hideControl = true;
    },

    changeSong: function (index) {
      this.settingView = false;

      if (index == this.selectedSongIndex) {
        return;
      }

      this.selectedSongIndex = index;
      store.setVal('selectedSongIndex', index);

      this.$refs['video'].src = this.songs[index];
    },
  }
});

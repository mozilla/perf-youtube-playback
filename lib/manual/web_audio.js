/**
 * @license
 * Copyright 2018 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var Sound = function(path) {
  /**
   * Array of sound bytes.
   * @type {?AudioBuffer}
   */
  this.buffer = null;

  /**
   * The URL path to the sound.
   * @private {string}
   */
  this.url_ = path;
};

/**
 * Download and store the sound.
 *
 * @param {!AudioContext} context An AudioContext used for decoding data.
 * @param {Function} successCallback Callback to call on success.
 */
Sound.prototype.download = function(context, successCallback) {
  var request = new XMLHttpRequest();
  request.responseType = 'arraybuffer';
  var self = this;
  request.onreadystatechange = function() {
    // Ignore any state changes before completion.
    if (request.readyState !== XMLHttpRequest.DONE) {
      return;
    }

    var contentType = request.getResponseHeader('content-type');
    if (!contentType) {
      return;
    }

    var response;
    if (request.responseType === 'arraybuffer') {
      context.decodeAudioData(
          request.response,
          function(buffer) {
            self.buffer = buffer;
            successCallback(self);
          },
          function(err) {
            console.error('Error in loading sound:', err);
          });
    }
  };
  request.open('GET', this.url_, true);
  request.send();
};

var audioContext;
if (typeof (webkitAudioContext) !== 'undefined') {
  audioContext = new webkitAudioContext();
} else if (typeof (AudioContext) !== 'undefined') {
  audioContext = new AudioContext();
}

var play = function(sound) {
  var source = audioContext.createBufferSource();
  source.buffer = sound.buffer;
  source.connect(audioContext.destination);
  source.start();
  if (!window[sound.url_]) {
    window[sound.url_] = sound;
  }
};

var playSound = function(name) {
  var extension = !!navigator.userAgent.match(/(cobalt)/i) ? '.wav' : '.mp3';
  var url = '../test-materials/media/manual/web_audio/' + name + extension;
  var sound;
  if (window[url]) {
    sound = window[url];
    play(sound);
  } else {
    sound = new Sound(url);
    sound.download(audioContext, play);
  }
};

document.addEventListener('keyup', function(event) {
  pushBackKeyToReturnManualPage(event);
  var vid = document.getElementById('vid');
  if (['Up', 'Down', 'Left', 'Right'].indexOf(keydb[event.keyCode]) > -1) {
    playSound('beep');
  } else if ([
               'Space', 'Play/Pause', 'Play', 'Pause', 'Enter'
             ].indexOf(keydb[event.keyCode]) > -1) {
    if (vid.paused) {
      vid.play();
    } else {
      vid.pause();
    }
  }
}, false);

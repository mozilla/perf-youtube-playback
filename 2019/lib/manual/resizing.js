/**
 * @license
 * Copyright 2019 Google Inc. All rights reserved.
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

var scale = document.documentElement.offsetHeight / 720;
var style = [
  '-o-transform: scale(' + scale + ');',
  '-webkit-transform: scale(' + scale + ');', 'transform: scale(' + scale + ');'
];
document.getElementById('resizing-container').style.cssText = style.join('');

var count = 0;
var vid = document.getElementById('resizing-vid');
var fpsList = [];
var minFps = 10000;
var fpsResult = document.getElementById('fps-result');
var frameResult = document.getElementById('frame-result');
vid.volume = 0.0;
vid.classList.add('shrink');

document.addEventListener('keyup', function(event) {
  pushBackKeyToReturnManualPage(event);
  if (getKeyName(event.keyCode) == 'Enter') {
    if (vid.paused) {
      vid.play();
      if (vid.classList.contains('shrink')) {
        vid.classList.remove('shrink');
        vid.classList.add('grow');
      } else {
        vid.classList.remove('grow');
        vid.classList.add('shrink');
      }
    } else {
      vid.pause();
    }
  }
}, false);

vid.addEventListener('animationend', (e) => {
  if (vid.paused) {
    return;
  }
  count++;
  if (count == 10) {
    vid.pause();
    return;
  }
  if (vid.classList.contains('shrink')) {
    vid.style.zIndex = '1';
    setTimeout(() => {
      vid.classList.remove('shrink');
      vid.classList.add('grow');
      vid.style.zIndex = '10';
    }, 1000);
  } else {
    vid.classList.remove('grow');
    vid.classList.add('shrink');
  }
  if (typeof h5vcc !== 'undefined') {
    var li =
        h5vcc.cVal.getValue('Renderer.Rasterize.AnimationsInterval.EntryList');
    if (li != null) {
      li = li.substring(1, li.length - 1);
      const lis = li.split(',').map(
          duration => Math.round(1000000.0 / Number(duration)));
      for (item of lis) {
        fpsList.push(item);
      }
    }
    var sorted = fpsList.sort(function(a, b) {return a - b});
    if (sorted) {
      var result = sorted[Math.floor(0.25 * sorted.length - 1)];
      console.log(`fps:${result}`);
      minFps = Math.min(minFps, sorted[0]);
      fpsResult.textContent =
          `75th fps: ${result.toFixed(0)}\r\nMinFps: ${minFps}`;
    } else {
      fpsResult.textContent = `No Cobalt data`;
    }
  }
}, false);

vid.addEventListener('timeupdate', function() {
  if (vid.getVideoPlaybackQuality) {
    var totalDroppedFrames = vid.getVideoPlaybackQuality().droppedVideoFrames;
    console.log(`Total dropped frames: ${totalDroppedFrames}`);
    frameResult.textContent =
        `Total dropped frames: ${totalDroppedFrames.toFixed(0)}`;
  }
});

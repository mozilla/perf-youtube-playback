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

function fetchArrayBuffer(method, url, body, callback) {
  var xhr = new XMLHttpRequest();
  xhr.responseType = 'arraybuffer';
  xhr.addEventListener('load', function() {
    callback(xhr.response);
  });
  xhr.open(method, url);
  xhr.send(body);
}

function extractLicense(licenseArrayBuffer) {
  var licenseArray = new Uint8Array(licenseArrayBuffer);
  var licenseStartIndex = licenseArray.length - 2;
  while (licenseStartIndex >= 0) {
    if (licenseArray[licenseStartIndex] == 13 &&
        licenseArray[licenseStartIndex + 1] == 10) {
      licenseStartIndex += 2;
      break;
    }
    --licenseStartIndex;
  }

  return licenseArray.subarray(licenseStartIndex);
}

var result = document.getElementById('result');
var secondaryVideo = document.querySelector('video.secondary');
if (!!secondaryVideo.setMaxVideoCapabilities) {
  secondaryVideo.setMaxVideoCapabilities('width=432; height=240; framerate=15;');
} else {
  result.textContent = "video.setMaxVideoCapabilities NOT SUPPORTED!";
}
secondaryVideo.loop = true;
secondaryVideo.autoplay = true;
secondaryVideo.muted = true;
secondaryVideo.src = 'https://storage.googleapis.com/ytlr-cert.appspot.com/test-materials/media/manual/dual_video/secondary-video.mp4';

var videoContentType = 'video/mp4; codecs="avc1.640028"';
var audioContentType = 'audio/mp4; codecs="mp4a.40.2"';

navigator
    .requestMediaKeySystemAccess(
        'com.widevine.alpha', [{
          'initDataTypes': ['cenc'],
          'videoCapabilities': [{'contentType': videoContentType}],
          'audioCapabilities': [{'contentType': audioContentType}]
        }])
    .then(function(mediaKeySystemAccess) {
      return mediaKeySystemAccess.createMediaKeys();
    })
    .then(function(mediaKeys) {
      var videoElement = document.querySelector('video.primary');

      videoElement.setMediaKeys(mediaKeys);

      var mediaKeySession = mediaKeys.createSession();
      mediaKeySession.addEventListener('message', function(messageEvent) {
        var licenseServerUrl =
            'https://dash-mse-test.appspot.com/api/drm/widevine?drm_system=widevine&source=YOUTUBE&ip=0.0.0.0&ipbits=0&expire=19000000000&key=test_key1&sparams=ip,ipbits,expire,drm_system,source,video_id&video_id=03681262dc412c06&signature=9C4BE99E6F517B51FED1F0B3B31966D3C5DAB9D6.6A1F30BB35F3A39A4CA814B731450D4CBD198FFD';
        fetchArrayBuffer(
            'POST', licenseServerUrl, messageEvent.message,
            function(licenseArrayBuffer) {
              mediaKeySession.update(extractLicense(licenseArrayBuffer));
            });
      });

      videoElement.addEventListener('encrypted', function(encryptedEvent) {
        mediaKeySession.generateRequest(
            encryptedEvent.initDataType, encryptedEvent.initData);
      });

      var mediaSource = new MediaSource();
      mediaSource.addEventListener('sourceopen', function() {
        var videoSourceBuffer = mediaSource.addSourceBuffer(videoContentType);
        fetchArrayBuffer(
            'GET',
            'https://yt-dash-mse-test.commondatastorage.googleapis.com/media/oops_cenc-20121114-142.mp4',
            null, function(videoArrayBuffer) {
              videoSourceBuffer.appendBuffer(videoArrayBuffer);
            });

        var audioSourceBuffer = mediaSource.addSourceBuffer(audioContentType);
        fetchArrayBuffer(
            'GET',
            'https://yt-dash-mse-test.commondatastorage.googleapis.com/media/oops_cenc-20121114-148.mp4',
            null, function(audioArrayBuffer) {
              audioSourceBuffer.appendBuffer(audioArrayBuffer);
            });
      });

      videoElement.src = URL.createObjectURL(mediaSource);
      videoElement.play();
    });

function showGuide() {
  var guide = document.getElementById('guide');
  guide.style.left = '0%';
};

function hideGuide() {
  var guide = document.getElementById('guide');
  guide.style.left = '-50%';
};

document.addEventListener('keyup', function(event) {
  var vid = document.getElementById('vid');
  if (['Up', 'Down', 'Left', 'Right'].indexOf(keydb[event.keyCode]) > -1) {
    showGuide();
  } else if ([
               'Space', 'Play/Pause', 'Play', 'Pause', 'Enter'
             ].indexOf(keydb[event.keyCode]) > -1) {
    hideGuide();
  }
}, false);

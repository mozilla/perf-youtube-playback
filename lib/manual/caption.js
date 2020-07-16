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

var logger = {
  log: function(text) {
    var timestamp = '[' + new Date().toUTCString() + '] ';
    console.log(timestamp, text);
    document.getElementById('output').textContent = timestamp + text + '\r\n' +
        document.getElementById('output').textContent;
  }
};
try {
  window.navigator.systemCaptionSettings.onchanged = function() {
    logger.log('[System Caption Settings] has changed.');
    logger.log(
        'navigator.systemCaptionSettings.supportsIsEnabled: ' +
        navigator.systemCaptionSettings.supportsIsEnabled);
    logger.log(
        'navigator.systemCaptionSettings.isEnabled: ' +
        navigator.systemCaptionSettings.isEnabled);
  };

  window.h5vcc.accessibility.addHighContrastTextListener(function() {
    logger.log('[High Contrast Text] has changed.');
    logger.log(
        'h5vcc.accessibility.highContrastText: ' +
        h5vcc.accessibility.highContrastText);
  });
} catch (e) {
  logger.log('[API NOT SUPPORTED]' + e);
}

function logAll() {
  logger.log('--------------------------------------------------');
  logger.log(
      'navigator.systemCaptionSettings.supportsIsEnabled: ' +
      navigator.systemCaptionSettings.supportsIsEnabled);
  logger.log(
      'navigator.systemCaptionSettings.isEnabled: ' +
      navigator.systemCaptionSettings.isEnabled);
  logger.log(
      'h5vcc.accessibility.highContrastText: ' +
      h5vcc.accessibility.highContrastText);
}

function logLoop () {
   setTimeout(function () {
      logAll();
      logLoop();
   }, 5000)
}

logLoop();

document.addEventListener('keyup', function(event) {
  try {
    window.navigator.systemCaptionSettings.onchanged = null;
  } catch (e) {
    logger.log('[Error When Exit]' + e);
  }
  pushBackKeyToReturnManualPage(event);
});

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
    console.log(timestamp,text);
    document.getElementById('output').textContent = timestamp + text
    + "\r\n" + document.getElementById('output').textContent;
  }
}

if("h5vcc" in window && !!h5vcc.runtime) {
  h5vcc.runtime.onDeepLink.addListener(function(link) {
    logger.log("h5vcc.runtime.onDeepLink: " + link);
  });
}

logger.log("document.visibilityState: " + document.visibilityState);

window.onblur = function() {
  logger.log("window.onblur");
};

window.onfocus = function() {
  logger.log("window.onfocus");
};

document.onblur = function() {
  logger.log("Error: document.onblur?! event should be on window!");
};

document.onfocus = function() {
  logger.log("Error: document.onfocus?! event should be on window!");
};

document.onvisibilitychange = function() {
  logger.log("document.onvisibilitychange: " + document.visibilityState);
};
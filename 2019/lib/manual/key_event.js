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


var displayKeyCode = function(kc_e, keycode) {
  var box = document.getElementById('key-code-box');

  if (getKeyName(keycode)) {
    kc_e.innerHTML = getKeyName(keycode);
    box.classList.remove('invalid-box');
    box.classList.add('valid-box');
    box.classList.remove('white');
    box.classList.add('black');
  } else {
    kc_e.innerHTML = keycode;
    var box = document.getElementById('key-code-box');
    box.classList.remove('valid-box');
    box.classList.add('invalid-box');
    box.classList.remove('black');
    box.classList.add('white');
  }
  return;
}

var checkKeycode = function(e) {
    var keycode = getKeycode(e);
    var kc_e = document.getElementById("key-code");
    displayKeyCode(kc_e, keycode);
    return keycode;
}

var lastTime = 0;
var lastKeyCode = 0x00;

var display = function(str) {
  var parent = document.getElementById('key-log');
  var elm = document.createElement('span');
  elm.classList.add('key-repeat-time');
  elm.textContent = str + ' ms';
  parent.appendChild(elm);
}

var clearDisplay = function(str) {
  var elm = document.getElementById('key-log');
  elm.innerHTML = "";
}

var onKeyDown = function(e) {
  var e = e || window.event;
  var newTime = new Date();
  var diffTime = newTime - lastTime;

  if (lastTime == 0) {
    clearDisplay();
  } else {
    display(diffTime);
  }
  lastTime = newTime;

  newKeyCode = checkKeycode(e);

  // Redirect to YTS manual test page if holding 'Back' key
  if ((newKeyCode == lastKeyCode) && (getKeyName(newKeyCode) == 'Back') &&
      (diffTime <= 1000)) {
    returnToManualPage();
  }
  lastKeyCode = newKeyCode;
}

var onKeyUp = function(e) {
  lastTime = 0;
}

document.addEventListener('keydown', onKeyDown);
document.addEventListener('keyup', onKeyUp);
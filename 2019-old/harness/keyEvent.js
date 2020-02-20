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

function getKeycode(e) {
  var keycode;
  if (window.event) {
    keycode = window.event.keyCode;
  } else if (e) {
    if (e.which != 0) {
      keycode = e.which;
    } else {
      keycode = e.keyCode;
    }
  }

  return keycode;
};

function returnToManualPage() {
  var url = document.location.href;
  var manual_test_page = url.substr(
      0, url.indexOf('/manual/')) + '/main.html?test_type=manual-test';
  document.location.href = manual_test_page;
};

function pushBackKeyToReturnManualPage(event) {
  if (getKeyName(event.keyCode) == 'Back') {
    returnToManualPage();
  }
};
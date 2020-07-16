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


var pane = document.getElementById('pane');
var bold_status = document.getElementById('bold-status');
var roboto_status = document.getElementById('roboto-status');
document.addEventListener('keyup', function(event) {
  pushBackKeyToReturnManualPage(event);

  if (getKeyName(event.keyCode) == 'Enter') {
    if (!pane.classList.contains('bold')) {
      pane.classList.add('bold');
      bold_status.classList.remove('hidden');
    } else {
      pane.classList.remove('bold');
      bold_status.classList.add('hidden');
    }
  }
  if (getKeyName(event.keyCode) == 'Right') {
    if (!pane.classList.contains('roboto')) {
      pane.classList.add('roboto');
      roboto_status.classList.remove('hidden');
    } else {
      pane.classList.remove('roboto');
      roboto_status.classList.add('hidden');
    }
  }
}, false);

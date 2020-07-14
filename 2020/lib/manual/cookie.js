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

var getCookieObject = function() {
  var arr = document.cookie.split('; ');
  var result = {};
  for (var i = 0; i < arr.length; i++) {
    var kv = arr[i].split('=');
    if (kv.length > 1) {
      result[kv[0]] = kv[1];
    }
  }
  return result;
};

var displayCookies = function() {
  var cookies = getCookieObject();
  for (var cookie_name in cookies) {
    var cdiv = document.createElement('div');
    var cname = document.createElement('span');
    var cval = document.createElement('span');
    var cequals = document.createElement('span');
    cequals.textContent = ' = ';
    cname.textContent = cookie_name;
    cname.className = 'cookie-name';
    cval.textContent = cookies[cookie_name];
    cval.className = 'cookie-value';
    cdiv.appendChild(cname);
    cdiv.appendChild(cequals);
    cdiv.appendChild(cval);
    cdiv.className += 'cookie expected-cookie';
    document.getElementById('display').appendChild(cdiv);
  }
};

var setPersistCookie = function(key, value, expires) {
  var payload = key + '=' + value + '; path=/';
  payload += '; domain=.ytlr-cert.appspot.com';
  payload += '; expires=' + expires;
  document.cookie = payload;
};

var setPersistCookies = function() {
  var now = new Date();
  var three_days_from_now = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
  var one_year_from_now = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);
  setPersistCookie(
      'PERSIST_THREE_DAYS',
      now.toGMTString(),
      three_days_from_now.toGMTString());
  setPersistCookie(
      'PERSIST_ONE_YEAR', now.toGMTString(), one_year_from_now.toGMTString());
};

var hitting_key = '';

document.addEventListener('keyup', function(event) {
  pushBackKeyToReturnManualPage(event);
  if (getKeyName(event.keyCode) == hitting_key) {
    switch (getKeyName(event.keyCode)) {
      case 'Up':
        setPersistCookies();
        break;
      case 'Left':
        var now = new Date();
        var three_days_from_now =
            new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
        setPersistCookie(
            'PERSIST_THREE_DAYS',
            now.toGMTString(),
            three_days_from_now.toGMTString());
        break;
      case 'Right':
        var now = new Date();
        var one_year_from_now =
            new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);
        setPersistCookie(
            'PERSIST_ONE_YEAR',
            now.toGMTString(),
            one_year_from_now.toGMTString());
        break;
    }
    document.location.reload(true);
  } else if (['Up', 'Left', 'Right'].includes(getKeyName(event.keyCode))) {
    hitting_key = getKeyName(event.keyCode);
    var messages = document.getElementById('message');
    messages.className = 'warning-message';
    messages.textContent = '****WARNING**** Press ' + hitting_key +
        ' to refresh cookies ****WARNING****';
  } else {
    hitting_key = getKeyName(event.keyCode);
    var messages = document.getElementById('message');
    messages.className = '';
    document.getElementById('message').textContent = '';
  }
}, false);

displayCookies();

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

'use strict';

(function() {

var Logger = function(log) {
  this.throwError = true;
  this.log = log;
  this.assert = function(cond, msg) {
    if (!cond) {
      this.log('Assert failed: ' + msg);
      try {
        var x = y.z.u.v.w;
      } catch (e) {
        this.log(e.stack);
      }
      if (this.throwError) throw 'Assert: ' + msg;
    }
  };

  this.check = function(condition, passMsg, failMsg, noLogging) {
    if (condition) {
      if (!noLogging) {
        this.log(passMsg);
      }
    } else {
      this.assert(false, failMsg);
    }
  };

  this.checkEq = function(x, y, name, noLogging) {
    var result = (x == y) ||
        (typeof(x) === 'number' && typeof(y) === 'number' &&
         isNaN(x) && isNaN(y));
    this.check(result, 'checkEq passed: ' + name + ' is (' + x + ').',
               name + ' is (' + x + ') which should be (' + y + ')', noLogging);
  };

  this.checkNE = function(x, y, name, noLogging) {
    var result = (x != y) &&
        !((typeof(x) === 'number' && typeof(y) === 'number' &&
           isNaN(x) && isNaN(y)));
    this.check(result, 'checkNE passed: ' + name + ' is (' + x + ').',
               name + ' is (' + x + ') which shouldn\'t.', noLogging);
  };
};

window.createLogger = function(log) {
  return new Logger(log || console.log.bind(console));
};

})();

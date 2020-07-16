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

var DommiscTest = function() {

/**
 * DOM Miscellaneous Test Suite.
 * @class
 */
var domVersion = 'Current Editor\'s Draft';

var tests = [];
var info = 'Spec Version: ' + domVersion + ' | Default Timeout: ' +
    TestBase.timeout + 'ms';

var fields = ['passes', 'failures', 'timeouts'];

var createDomTest = function(testId, name, category = 'DOM Misc', mandatory = true) {
  var t = createTest(name, category, mandatory, testId,
      'DOM chardata, window & Miscellaneous Tests');
  t.prototype.index = tests.length;
  tests.push(t);
  return t;
};

/**
 * Validate the existence of value in element.
 */
var isValueInElement = function(value, name, element, runner) {
  try {
    if (Modernizr.prefixed(value, element, false) != false)
      runner.succeed();
    else
      throw 'Failed: ' + name + ': ' +
          Modernizr.prefixed(value, document.implementation, false);
  } catch (e) {
    runner.fail(e);
  }
};

/**
 * Ensure the DOM methods are correctly supported through Modernizr.
 */
var createCommonDomTest = function(testId, value, category, element, mandatory) {
  var name = category.replace(/\s/g, '') + '.' + value;
  var test = createDomTest(testId, name, category, mandatory);
  test.prototype.title = 'Test DOM Implementation of ' + name;
  test.prototype.start = function() {
    isValueInElement(value, name, element, this.runner);
  };
};

// Category: CharacterData.
var createCharDataTest = function(testId, value, mandatory) {
  createCommonDomTest(
      testId, value, 'CharacterData', document.createTextNode('Test'), mandatory);
};

createCharDataTest('19.1.1.1', 'appendData', false);
createCharDataTest('19.1.2.1', 'data');
createCharDataTest('19.1.3.1', 'deleteData', false);
createCharDataTest('19.1.4.1', 'insertData', false);
createCharDataTest('19.1.5.1', 'length', false);
createCharDataTest('19.1.6.1', 'replaceData', false);
createCharDataTest('19.1.7.1', 'substringData', false);

// Category: NamedNodeMap.
var createNameNodeMapTest = function(testId, value, mandatory) {
  createCommonDomTest(
      testId, value, 'NamedNodeMap', document.documentElement.attributes, mandatory);
};

createNameNodeMapTest('19.2.1.1', 'getNamedItem');
createNameNodeMapTest('19.2.2.1', 'getNamedItemNS', false);
createNameNodeMapTest('19.2.3.1', 'item');
createNameNodeMapTest('19.2.4.1', 'length');
createNameNodeMapTest('19.2.5.1', 'removeNamedItem', false);
createNameNodeMapTest('19.2.6.1', 'removeNamedItemNS', false);
createNameNodeMapTest('19.2.7.1', 'setNamedItem', false);
createNameNodeMapTest('19.2.8.1', 'setNamedItemNS', false);

// Category: Node.
var createNodeTest = function(testId, value, mandatory) {
  createCommonDomTest(testId, value, 'Node', document.body, mandatory);
};

createNodeTest('19.3.1.1', 'appendChild');
createNodeTest('19.3.2.1', 'attributes');
createNodeTest('19.3.3.1', 'childNodes');
createNodeTest('19.3.4.1', 'cloneNode');
createNodeTest('19.3.5.1', 'firstChild');
createNodeTest('19.3.6.1', 'hasAttributes', false);
createNodeTest('19.3.7.1', 'hasChildNodes');
createNodeTest('19.3.8.1', 'insertBefore');
createNodeTest('19.3.9.1', 'lastChild');
createNodeTest('19.3.10.1', 'nextSibling');
createNodeTest('19.3.11.1', 'nodeName');
createNodeTest('19.3.12.1', 'nodeType');
createNodeTest('19.3.13.1', 'nodeValue');
createNodeTest('19.3.14.1', 'normalize', false);
createNodeTest('19.3.15.1', 'ownerDocument');
createNodeTest('19.3.16.1', 'parentNode');
createNodeTest('19.3.17.1', 'previousSibling');
createNodeTest('19.3.18.1', 'removeChild');
createNodeTest('19.3.19.1', 'replaceChild');

createCommonDomTest('19.3.20.1', 'getElementById', 'Node', document, false);
createCommonDomTest('19.3.21.1', 'localName', 'Node', document.documentElement, false);
createCommonDomTest('19.3.22.1', 'namespaceURI', 'Node', document.documentElement, false);
createCommonDomTest('19.3.23.1', 'prefix', 'Node', document.documentElement, false);


// Category: Rect.
var createRectTest = function(testId, value) {
  createCommonDomTest(testId, value, 'Rect', window.getComputedStyle.getRectValue);
};

createRectTest('19.4.1.1', 'bottom');
createRectTest('19.4.2.1', 'left');
createRectTest('19.4.3.1', 'right');
createRectTest('19.4.4.1', 'top');

// Category: window.
var createWindowTest = function(testId, value) {
  createCommonDomTest(testId, value, 'window', window);
};

createWindowTest('19.5.1.1', 'addEventListener');
createWindowTest('19.5.2.1', 'clearInterval');
createWindowTest('19.5.3.1', 'clearTimeout');
createWindowTest('19.5.4.1', 'location');
createWindowTest('19.5.5.1', 'navigator');
createWindowTest('19.5.6.1', 'close');
createWindowTest('19.5.7.1', 'removeEventListener');
createWindowTest('19.5.8.1', 'setInterval');
createWindowTest('19.5.9.1', 'setTimeout');

var createEventTest = function(testId, value) {
  var test = createDomTest(testId, 'window.'+ value, 'window', false);
  test.prototype.title = 'Test event existence of window.' + value;
  test.prototype.start = function() {
    try {
      if (Modernizr.hasEvent(value, window))
        this.runner.succeed();
      else
        throw 'Failed: window.' + value + ': ' +
            Modernizr.hasEvent(value, window);
    } catch (e) {
      this.runner.fail(e);
    }
  }
};

createEventTest('19.5.10.1', 'keydown');
createEventTest('19.5.11.1', 'keypress');
createEventTest('19.5.12.1', 'keyup');

/**
 * Ensure that onerror event is correctly fired.
 */
var testOnerror = createDomTest('19.5.13.1', 'Window.onerror stack trace', 'window');
testOnerror.prototype.title = 'Test window.onerror';
testOnerror.prototype.start = function(runner) {
  window.addEventListener('error', function onerror(e) {
    window.removeEventListener('error', onerror);
    // line number should match
    if (e.lineno == 193 && (e.colno == 5 || e.colno == 12)) {
      runner.succeed();
    }
    else {
      runner.fail('Caught Error: line ' + e.lineno + ' : colno ' + e.colno);
    }
  });

  // Line that should raise an error
  setTimeout(function() {
    failure.test;
  }, 500);
};

/**
 * Ensure that device pixel ratio is valid under current output resolution.
 */
var testDevicePixelRatio = createDomTest('19.5.14.1', 'Window.devicePixelRatio', 'window');
testDevicePixelRatio.prototype.title = 'Test window.devicePixelRatio';
testDevicePixelRatio.prototype.start = function() {
  try {
    var validDevicePixelRatios;
    if (util.isGt4K()) {
      validDevicePixelRatios = [2, 4];
    } else if (util.isGtFHD()) {
      validDevicePixelRatios = [1, 1.5, 2];
    } else {
      validDevicePixelRatios = [1, 1.5];
    }

    if (validDevicePixelRatios.indexOf(window.devicePixelRatio) > -1) {
      this.runner.succeed();
    }
    else {
      throw 'Value returned: devicePixelRatio is ' +
          window.devicePixelRatio + '. Value must be in [' +
          validDevicePixelRatios.toString() + ']';
    }
  } catch(e) {
    this.runner.fail(e);
  }
};

// Category: Heap.
/**
 * Validate that totalJSHeapSizs API is supported.
 */
var testTotalJSHeapSize = createDomTest('19.6.1.1', 'totalJSHeapSize', 'Heap');
testTotalJSHeapSize.prototype.title = 'Test totalJSHeapSize is valid';
testTotalJSHeapSize.prototype.start = function() {
  try {
    var totalHeap = window.performance.memory.totalJSHeapSize;
    var usedHeap = window.performance.memory.usedJSHeapSize;
    if (totalHeap != undefined && totalHeap > 0 && totalHeap >= usedHeap)
      this.runner.succeed();
    else
      throw 'totalJSHeapSize is ' + totalHeap;
  } catch (e) {
    this.runner.fail(e);
  }
};

/**
 * Validate that usedJSHeapSizs API is supported.
 */
var testUsedJSHeapSize = createDomTest('19.6.2.1', 'usedJSHeapSize', 'Heap');
testUsedJSHeapSize.prototype.title = 'Test usedJSHeapSize is valid';
testUsedJSHeapSize.prototype.start = function() {
  try {
    var usedHeap = window.performance.memory.usedJSHeapSize;
    var totalHeap = window.performance.memory.totalJSHeapSize;
    if (usedHeap != undefined && usedHeap > 0 && usedHeap <= totalHeap)
      this.runner.succeed();
    else
      throw 'usedJSHeapSize is ' + usedHeap;
  } catch (e) {
    this.runner.fail(e);
  }
};

// Category: Assorted.
var createAssortedTest = function(testId, value, name, element, mandatory) {
  var test = createDomTest(testId, name, 'Assorted', mandatory);
  test.prototype.title = 'Test DOM Implementation of ' + name;
  test.prototype.start = function() {
    isValueInElement(value, name, element, this.runner);
  }
};

createAssortedTest('19.7.1.1', 'item', 'NodeList.list', document.body.div);
createAssortedTest(
    '19.7.2.1',
    'length',
    'NodeList.length',
    document.documentElement.childNodes);
createAssortedTest(
    '19.7.3.1', 'publicId', 'Notation.publicId', document.doctype, false);
createAssortedTest(
    '19.7.4.1', 'systemId', 'Notation.systemId', document.doctype, false);
createAssortedTest(
    '19.7.5.1', 'data', 'ProcessingInstruction.data', document.body.firstChild);
createAssortedTest(
    '19.7.6.1', 'item', 'StyleSheetList.item', document.StyleSheetLists);
createAssortedTest(
    '19.7.7.1', 'length', 'StyleSheetList.length', document.StyleSheetLists);
createAssortedTest(
    '19.7.8.1', 'splitText', 'Text.splitText', document.body.firstChild, false);
createAssortedTest(
    '19.7.9.1', 'getComputedStyle', 'ViewCSS.getComputedStyle', window);
createAssortedTest(
    '19.7.10.1',
    'sheet',
    'LinkStyle.sheet',
    document.getElementsByTagName('link')[0],
    false);
createAssortedTest('19.7.11.1', 'item', 'MediaList.item', document.mediaList);
createAssortedTest(
    '19.7.12.1', 'length', 'MediaList.length', document.mediaList);


// Category: CreateEvent.
var createInitEventTest = function(testId, value, event, mandatory) {
  var name = event + '.' + value;
  var test = createDomTest(testId, name, 'CreateEvent', mandatory);
  test.prototype.title = 'Test DOM Implementation of ' + name;
  test.prototype.start = function() {
    try {
      var element = document.createEvent(event);
      isValueInElement(value, name, element, this.runner);
    } catch (e) {
      this.runner.fail(e);
    }
  }
};

createInitEventTest('19.8.1.1', 'initUIEvent', 'UIEvents');
createInitEventTest('19.8.2.1', 'initMouseEvent', 'MouseEvents', false);
createInitEventTest('19.8.3.1', 'initMutationEvent', 'MutationEvents', false);


return {tests: tests, info: info, fields: fields, viewType: 'default'};
};

try {
  exports.getTest = DommiscTest;
} catch (e) {
  // do nothing, this function is not supposed to work for browser, but it's for
  // Node js to generate json file instead.
}
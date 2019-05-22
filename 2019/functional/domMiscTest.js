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

var createDomTest = function(name, category, mandatory) {
  var t = createTest(name);
  t.prototype.index = tests.length;
  t.prototype.passes = 0;
  t.prototype.failures = 0;
  t.prototype.timeouts = 0;
  t.prototype.category = category || 'DOM Misc';
  if (typeof mandatory === 'boolean') {
    t.prototype.mandatory = mandatory;
  }
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
var createCommonDomTest = function(value, category, element, mandatory) {
  var name = category.replace(/\s/g, '') + '.' + value;
  var test = createDomTest(name, category, mandatory);
  test.prototype.title = 'Test DOM Implementation of ' + name;
  test.prototype.start = function() {
    isValueInElement(value, name, element, this.runner);
  };
};

// Category: CharacterData.
var createCharDataTest = function(value, mandatory) {
  createCommonDomTest(
      value, 'CharacterData', document.createTextNode('Test'), mandatory);
};

createCharDataTest('appendData', false);
createCharDataTest('data');
createCharDataTest('deleteData', false);
createCharDataTest('insertData', false);
createCharDataTest('length', false);
createCharDataTest('replaceData', false);
createCharDataTest('substringData', false);

// Category: NamedNodeMap.
var createNameNodeMapTest = function(value, mandatory) {
  createCommonDomTest(
      value, 'NamedNodeMap', document.documentElement.attributes, mandatory);
};

createNameNodeMapTest('getNamedItem');
createNameNodeMapTest('getNamedItemNS', false);
createNameNodeMapTest('item');
createNameNodeMapTest('length');
createNameNodeMapTest('removeNamedItem', false);
createNameNodeMapTest('removeNamedItemNS', false);
createNameNodeMapTest('setNamedItem', false);
createNameNodeMapTest('setNamedItemNS', false);

// Category: Node.
var createNodeTest = function(value, mandatory) {
  createCommonDomTest(value, 'Node', document.body, mandatory);
};

createNodeTest('appendChild');
createNodeTest('attributes');
createNodeTest('childNodes');
createNodeTest('cloneNode');
createNodeTest('firstChild');
createNodeTest('hasAttributes', false);
createNodeTest('hasChildNodes');
createNodeTest('insertBefore');
createNodeTest('lastChild');
createNodeTest('nextSibling');
createNodeTest('nodeName');
createNodeTest('nodeType');
createNodeTest('nodeValue');
createNodeTest('normalize', false);
createNodeTest('ownerDocument');
createNodeTest('parentNode');
createNodeTest('previousSibling');
createNodeTest('removeChild');
createNodeTest('replaceChild');

createCommonDomTest('getElementById', 'Node', document, false);
createCommonDomTest('localName', 'Node', document.documentElement, false);
createCommonDomTest('namespaceURI', 'Node', document.documentElement, false);
createCommonDomTest('prefix', 'Node', document.documentElement, false);


// Category: Rect.
var createRectTest = function(value) {
  createCommonDomTest(value, 'Rect', window.getComputedStyle.getRectValue);
};

createRectTest('bottom');
createRectTest('left');
createRectTest('right');
createRectTest('top');

// Category: window.
var createWindowTest = function(value) {
  createCommonDomTest(value, 'window', window);
};

createWindowTest('addEventListener');
createWindowTest('clearInterval');
createWindowTest('clearTimeout');
createWindowTest('location');
createWindowTest('navigator');
createWindowTest('close');
createWindowTest('removeEventListener');
createWindowTest('setInterval');
createWindowTest('setTimeout');

var createEventTest = function(value) {
  var test = createDomTest('window.'+ value, 'window', false);
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

createEventTest('keydown');
createEventTest('keypress');
createEventTest('keyup');

/**
 * Ensure that onerror event is correctly fired.
 */
var testOnerror = createDomTest('Window.onerror stack trace', 'window');
testOnerror.prototype.title = 'Test window.onerror';
testOnerror.prototype.start = function(runner) {
  window.addEventListener('error', function onerror(e) {
    window.removeEventListener('error', onerror);
    // line number should match
    if (e.lineno == 199 && (e.colno == 5 || e.colno == 12)) {
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
 * Ensure that device pixel ratio is either 1, 1.5 or 2.
 */
var testDevicePixelRatio = createDomTest('Window.devicePixelRatio', 'window');
testDevicePixelRatio.prototype.title = 'Test window.devicePixelRatio';
testDevicePixelRatio.prototype.start = function() {
  try {
    var devicePixelRatio = window.devicePixelRatio;
    if (devicePixelRatio == 2 ||
        devicePixelRatio == 1.5 || devicePixelRatio == 1 )
      this.runner.succeed();
    else
      throw 'Value returned: devicePixelRatio is ' +
          devicePixelRatio + '. Value must be 1, 1.5 or 2.';
  } catch(e) {
    this.runner.fail(e);
  }
};

// Category: Heap.
/**
 * Validate that totalJSHeapSizs API is supported.
 */
var testTotalJSHeapSize = createDomTest('totalJSHeapSize', 'Heap');
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
var testUsedJSHeapSize = createDomTest('usedJSHeapSize', 'Heap');
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
var createAssortedTest = function(value, name, element, mandatory) {
  var test = createDomTest(name, 'Assorted', mandatory);
  test.prototype.title = 'Test DOM Implementation of ' + name;
  test.prototype.start = function() {
    isValueInElement(value, name, element, this.runner);
  }
};

createAssortedTest('item', 'NodeList.list', document.body.div);
createAssortedTest(
    'length', 'NodeList.length', document.documentElement.childNodes);
createAssortedTest('publicId', 'Notation.publicId', document.doctype, false);
createAssortedTest('systemId', 'Notation.systemId', document.doctype, false);
createAssortedTest(
    'data', 'ProcessingInstruction.data', document.body.firstChild);
createAssortedTest('item', 'StyleSheetList.item', document.StyleSheetLists);
createAssortedTest('length', 'StyleSheetList.length', document.StyleSheetLists);
createAssortedTest(
    'splitText', 'Text.splitText', document.body.firstChild, false);
createAssortedTest('getComputedStyle', 'ViewCSS.getComputedStyle', window);
createAssortedTest(
    'sheet',
    'LinkStyle.sheet',
    document.getElementsByTagName('link')[0],
    false);
createAssortedTest('item', 'MediaList.item', document.mediaList);
createAssortedTest('length', 'MediaList.length', document.mediaList);


// Category: CreateEvent.
var createInitEventTest = function(value, event, mandatory) {
  var name = event + '.' + value;
  var test = createDomTest(name, 'CreateEvent', mandatory);
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

createInitEventTest('initUIEvent', 'UIEvents');
createInitEventTest('initMouseEvent', 'MouseEvents', false);
createInitEventTest('initMutationEvent', 'MutationEvents', false);


return {tests: tests, info: info, fields: fields, viewType: 'default'};
};

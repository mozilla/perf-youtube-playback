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

/**
 * DOM Document Event Test Suite.
 * @class
 */
var DomdocumentTest = function() {

var domDocumentVersion = 'Current Editor\'s Draft';

var tests = [];
var info = 'Spec Version: ' + domDocumentVersion + ' | Default Timeout: ' +
    TestBase.timeout + 'ms';

var fields = ['passes', 'failures', 'timeouts'];

var createDocumentTest =
    function(testId, name, category = 'Dom Document Event', mandatory = true) {
  var t = createTest(name, category, mandatory, testId, 'DOM Document Tests');
  t.prototype.index = tests.length;
  tests.push(t);
  return t;
};

/**
 * Ensure the DOM implementation of specified method through Modernizr.
 */
var createCommonDomTest = function(testId, value, category, element, mandatory) {
  var name = category.replace(/\s/g, '') + '.' + value;
  var test = createDocumentTest(testId, name, category, mandatory);
  test.prototype.title = 'Test DOM Implementation of ' + name;
  test.prototype.start = function() {
    try {
      if (Modernizr.prefixed(value, element, false) != false)
        this.runner.succeed();
      else
        throw 'Failed: ' + name + ': ' +
            Modernizr.prefixed(value, element, false);
    } catch (e) {
      this.runner.fail(e);
    }
  }
};

// Category: DOM Implementation.
var createDomImplementationTest = function(testId, value, mandatory) {
  createCommonDomTest(
      testId, value, 'DOM Implementation', document.implementation, mandatory);
};

createDomImplementationTest('18.1.1.1', 'createDocument');
createDomImplementationTest('18.1.2.1', 'createDocumentType', false);
createDomImplementationTest('18.1.3.1', 'hasFeature', false);

// Category: Document.
var createDocumentCommonTest = function(testId, value, mandatory) {
  createCommonDomTest(testId, value, 'Document', document, mandatory);
};

createDocumentCommonTest('18.2.1.1', 'createAttribute', false);
createDocumentCommonTest('18.2.2.1', 'createAttributeNS', false);
createDocumentCommonTest('18.2.3.1', 'createCDATASection', false);
createDocumentCommonTest('18.2.4.1', 'createComment');
createDocumentCommonTest('18.2.5.1', 'createDocumentFragment', false);
createDocumentCommonTest('18.2.6.1', 'createElement');
createDocumentCommonTest('18.2.7.1', 'createElementNS');
createDocumentCommonTest('18.2.8.1', 'createProcessingInstruction', false);
createDocumentCommonTest('18.2.9.1', 'createTextNode');
createDocumentCommonTest('18.2.10.1', 'doctype', false);
createDocumentCommonTest('18.2.11.1', 'documentElement');
createDocumentCommonTest('18.2.12.1', 'getElementById');
createDocumentCommonTest('18.2.13.1', 'getElementsByTagName');
createDocumentCommonTest('18.2.14.1', 'getElementsByTagNameNS', false);
createDocumentCommonTest('18.2.15.1', 'implementation');
createDocumentCommonTest('18.2.16.1', 'importNode', false);
createDocumentCommonTest('18.2.17.1', 'createEvent');
createDocumentCommonTest('18.2.18.1', 'styleSheets');

// Category: DocumentType.
var createDoctypeTest = function(testId, value, mandatory) {
  createCommonDomTest(testId, value, 'DocumentType', document.doctype, mandatory);
};

createDoctypeTest('18.3.1.1', 'name', false);
createDoctypeTest('18.3.2.1', 'publicId', false);
createDoctypeTest('18.3.3.1', 'systemId', false);

// Category: Element.
var createDomBodyTest = function(testId, value, mandatory) {
  createCommonDomTest(testId, value, 'Element', document.body, mandatory);
};

createDomBodyTest('18.4.1.1', 'getAttribute');
createDomBodyTest('18.4.2.1', 'getAttributeNS', false);
createDomBodyTest('18.4.3.1', 'getAttributeNode', false);
createDomBodyTest('18.4.4.1', 'getAttributeNodeNS', false);
createDomBodyTest('18.4.5.1', 'getElementsByTagName');
createDomBodyTest('18.4.6.1', 'getElementsByTagNameNS', false);
createDomBodyTest('18.4.7.1', 'hasAttribute');
createDomBodyTest('18.4.8.1', 'hasAttributeNS', false);
createDomBodyTest('18.4.9.1', 'removeAttribute');
createDomBodyTest('18.4.10.1', 'removeAttributeNS', false);
createDomBodyTest('18.4.11.1', 'removeAttributeNode', false);
createDomBodyTest('18.4.12.1', 'setAttribute');
createDomBodyTest('18.4.13.1', 'setAttributeNS', false);
createDomBodyTest('18.4.14.1', 'setAttributeNode', false);
createDomBodyTest('18.4.15.1', 'setAttributeNodeNS', false);
createDomBodyTest('18.4.16.1', 'tagName');
createDomBodyTest('18.4.17.1', 'style');


// Category: Event.

/**
 * Validate the existence of specified event properties.
 */
var createCommonEventTest = function(
      testId, value, category, element, mandatory) {
  var name = category.replace(/\s/g, '') + '.' + value;
  var test = createDocumentTest(testId, name, category, mandatory);
  test.prototype.title = 'Test event existence of ' + name;
  test.prototype.start = function() {
    try {
      if (Modernizr.hasEvent(value, element))
        this.runner.succeed();
      else
        throw 'Failed: ' + name + ': ' + Modernizr.hasEvent(value, element);
    } catch (e) {
      this.runner.fail(e);
    }
  }
};

var createVideoEventTest = function(testId, value, mandatory) {
  var videoElement = document.createElement("video");
  createCommonEventTest(testId, value, 'Event', videoElement, mandatory);
}

createVideoEventTest('18.5.1.1', 'durationchange', false);
createVideoEventTest('18.5.2.1', 'ended', false);
createVideoEventTest('18.5.3.1', 'loadeddata', false);
createVideoEventTest('18.5.4.1', 'loadedmetadata', false);
createVideoEventTest('18.5.5.1', 'loadstart');
createVideoEventTest('18.5.6.1', 'pause');
createVideoEventTest('18.5.7.1', 'play', false);
createVideoEventTest('18.5.8.1', 'playing', false);
createVideoEventTest('18.5.9.1', 'progress', false);
createVideoEventTest('18.5.10.1', 'seeked', false);
createVideoEventTest('18.5.11.1', 'seeking', false);
createVideoEventTest('18.5.12.1', 'stalled', false);
createVideoEventTest('18.5.13.1', 'suspend', false);
createVideoEventTest('18.5.14.1', 'timeupdate', false);
createVideoEventTest('18.5.15.1', 'waiting', false);

createCommonEventTest('18.5.16.1', 'error', 'Event', window, false);
createCommonDomTest(
    '18.5.17.1',
    'preventDefault',
    'Event',
    document.createEvent('Event'),
    false);
createCommonDomTest(
    '18.5.18.1',
    'stopPropagation',
    'Event',
    document.createEvent('Event'),
    false);

var testInitEvent = createDocumentTest('18.5.19.1', 'Event.initEvent', 'Event');
testInitEvent.prototype.title = 'Test event existence of Event.initEvent';
testInitEvent.prototype.start = function() {
  try {
    if (document.createEvent('Events').initEvent != null)
      this.runner.succeed();
    else
      throw "Event.initEvent not supported";
  } catch (e) {
    this.runner.fail(e);
  }
};

// Category: EventTarget.
var createEventTargetTest = function(testId, value) {
  createCommonDomTest(testId, value, 'EventTarget', document.body);
};

createEventTargetTest('18.6.1.1', 'addEventListener');
createEventTargetTest('18.6.2.1', 'dispatchEvent');
createEventTargetTest('18.6.3.1', 'removeEventListener');

// Category: HTMLAnchorElement.
createCommonDomTest(
    '18.7.1.1', 'focus', 'HTMLAnchorElement', document.createElement('a'));

// Category: HTML Document.
createCommonDomTest('18.8.1.1', 'body', 'HTML Document', document);
createCommonDomTest('18.8.2.1', 'cookie', 'HTML Document', document);

var createHTMLDocumentEventTest = function(testId, value, element, mandatory) {
  createCommonEventTest(testId, value, 'HTML Document', element, mandatory);
};

createHTMLDocumentEventTest('18.8.3.1', 'blur', document.body);
createHTMLDocumentEventTest('18.8.4.1', 'focus', document.body);
createHTMLDocumentEventTest('18.8.5.1', 'load', document.body);
createHTMLDocumentEventTest('18.8.6.1', 'resize', window, false);
createHTMLDocumentEventTest('18.8.7.1', 'unload', document.body, false);

// Category: HTML Element.
var createHTMLElementTest = function(testId, value, element, mandatory) {
  createCommonDomTest(testId, value, 'HTML Element', element, mandatory);
};

createHTMLElementTest('18.9.1.1', 'className', document.body);
createHTMLElementTest('18.9.2.1', 'getBoundingClientRect', document.body);
createHTMLElementTest('18.9.3.1', 'id', document.body);
createHTMLElementTest('18.9.4.1', 'innerHTML', document.body);
createHTMLElementTest('18.9.5.1', 'nodeName', document.body);
createHTMLElementTest('18.9.6.1', 'nodeType', document.body);
createHTMLElementTest('18.9.7.1', 'style', document.body);
createHTMLElementTest('18.9.8.1', 'textContent', document.body);

// Category: HTML IFrame Element.
createCommonDomTest(
    '18.10.1.1',
    'contentWindow',
    'HTML IFrame Element',
    document.createElement('iframe'),
    false);

// Category: HTML Input Element.
createCommonDomTest(
  '18.11.1.1', 'focus', 'HTML Input Element', document.createElement('input'));

// Category: HTML Media Element.

/**
 * Ensure the DOM implementation of specified properties of HTMLMediaElement.
 */
var createMediaElementTest = function(testId, value, mandatory) {
  var name = 'HTMLMediaElement.' + value;
  var test = createDocumentTest(testId, name, 'HTML Media Element', mandatory);
  test.prototype.title = 'Test DOM Implementation of HTMLMediaElement.' + value;
  test.prototype.start = function() {
    try {
      if (document.createElement('video')[value] != undefined)
        this.runner.succeed();
      else
        throw 'Failed: HTMLMediaElement.' + name;
    } catch (e) {
      this.runner.fail(e);
    }
  }
};

createMediaElementTest('18.12.1.1', 'canPlayType');
createMediaElementTest('18.12.2.1', 'autoplay');
createMediaElementTest('18.12.3.1', 'load');
createMediaElementTest('18.12.4.1', 'pause');
createMediaElementTest('18.12.5.1', 'play');
createMediaElementTest('18.12.6.1', 'muted');
createMediaElementTest('18.12.7.1', 'volume');
createMediaElementTest('18.12.8.1', 'currentTime');
createMediaElementTest('18.12.9.1', 'duration');
createMediaElementTest('18.12.10.1', 'buffered');
createMediaElementTest('18.12.11.1', 'paused');
createMediaElementTest('18.12.12.1', 'ended');

// Category: HTML Select Element.
createCommonDomTest(
    '18.13.1.1',
    'focus',
    'HTML Select Element',
    document.createElement('select'));

return {tests: tests, info: info, fields: fields, viewType: 'default'};
};

try {
  exports.getTest = DomdocumentTest;
} catch (e) {
  // do nothing, this function is not supposed to work for browser, but it's for
  // Node js to generate json file instead.
}
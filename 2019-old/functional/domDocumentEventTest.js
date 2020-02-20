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

var createDocumentTest = function(name, category, mandatory) {
  var t = createTest(name);
  t.prototype.index = tests.length;
  t.prototype.passes = 0;
  t.prototype.failures = 0;
  t.prototype.timeouts = 0;
  t.prototype.category = category || 'Dom Document Event';
  if (typeof mandatory === 'boolean') {
    t.prototype.mandatory = mandatory;
  }
  tests.push(t);
  return t;
};

/**
 * Ensure the DOM implementation of specified method through Modernizr.
 */
var createCommonDomTest = function(value, category, element, mandatory) {
  var name = category.replace(/\s/g, '') + '.' + value;
  var test = createDocumentTest(name, category, mandatory);
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
var createDomImplementationTest = function(value, mandatory) {
  createCommonDomTest(
      value, 'DOM Implementation', document.implementation, mandatory);
};

createDomImplementationTest('createDocument');
createDomImplementationTest('createDocumentType', false);
createDomImplementationTest('hasFeature', false);

// Category: Document.
var createDocumentCommonTest = function(value, mandatory) {
  createCommonDomTest(value, 'Document', document, mandatory);
};

createDocumentCommonTest('createAttribute', false);
createDocumentCommonTest('createAttributeNS', false);
createDocumentCommonTest('createCDATASection', false);
createDocumentCommonTest('createComment');
createDocumentCommonTest('createDocumentFragment', false);
createDocumentCommonTest('createElement');
createDocumentCommonTest('createElementNS');
createDocumentCommonTest('createProcessingInstruction', false);
createDocumentCommonTest('createTextNode');
createDocumentCommonTest('doctype', false);
createDocumentCommonTest('documentElement');
createDocumentCommonTest('getElementById');
createDocumentCommonTest('getElementsByTagName');
createDocumentCommonTest('getElementsByTagNameNS', false);
createDocumentCommonTest('implementation');
createDocumentCommonTest('importNode', false);
createDocumentCommonTest('createEvent');
createDocumentCommonTest('styleSheets');

// Category: DocumentType.
var createDoctypeTest = function(value, mandatory) {
  createCommonDomTest(value, 'DocumentType', document.doctype, mandatory);
};

createDoctypeTest('name', false);
createDoctypeTest('publicId', false);
createDoctypeTest('systemId', false);

// Category: Element.
var createDomBodyTest = function(value, mandatory) {
  createCommonDomTest(value, 'Element', document.body, mandatory);
};

createDomBodyTest('getAttribute');
createDomBodyTest('getAttributeNS', false);
createDomBodyTest('getAttributeNode', false);
createDomBodyTest('getAttributeNodeNS', false);
createDomBodyTest('getElementsByTagName');
createDomBodyTest('getElementsByTagNameNS', false);
createDomBodyTest('hasAttribute');
createDomBodyTest('hasAttributeNS', false);
createDomBodyTest('removeAttribute');
createDomBodyTest('removeAttributeNS', false);
createDomBodyTest('removeAttributeNode', false);
createDomBodyTest('setAttribute');
createDomBodyTest('setAttributeNS', false);
createDomBodyTest('setAttributeNode', false);
createDomBodyTest('setAttributeNodeNS', false);
createDomBodyTest('tagName');
createDomBodyTest('style');


// Category: Event.

/**
 * Validate the existence of specified event properties.
 */
var createCommonEventTest = function(value, category, element, mandatory) {
  var name = category.replace(/\s/g, '') + '.' + value;
  var test = createDocumentTest(name, category, mandatory);
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

var createVideoEventTest = function(value, mandatory) {
  var videoElement = document.createElement("video");
  createCommonEventTest(value, 'Event', videoElement, mandatory);
}

createVideoEventTest('durationchange', false);
createVideoEventTest('ended', false);
createVideoEventTest('loadeddata', false);
createVideoEventTest('loadedmetadata', false);
createVideoEventTest('loadstart');
createVideoEventTest('pause');
createVideoEventTest('play', false);
createVideoEventTest('playing', false);
createVideoEventTest('progress', false);
createVideoEventTest('seeked', false);
createVideoEventTest('seeking', false);
createVideoEventTest('stalled', false);
createVideoEventTest('suspend', false);
createVideoEventTest('timeupdate', false);
createVideoEventTest('waiting', false);

createCommonEventTest('error', 'Event', window, false);
createCommonDomTest(
    'preventDefault', 'Event', document.createEvent('Event'), false);
createCommonDomTest(
    'stopPropagation', 'Event', document.createEvent('Event'), false);

var testInitEvent = createDocumentTest('Event.initEvent', 'Event');
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
var createEventTargetTest = function(value) {
  createCommonDomTest(value, 'EventTarget', document.body);
};

createEventTargetTest('addEventListener');
createEventTargetTest('dispatchEvent');
createEventTargetTest('removeEventListener');

// Category: HTMLAnchorElement.
createCommonDomTest('focus', 'HTMLAnchorElement', document.createElement('a'));

// Category: HTML Document.
createCommonDomTest('body', 'HTML Document', document);
createCommonDomTest('cookie', 'HTML Document', document);

var createHTMLDocumentEventTest = function(value, element, mandatory) {
  createCommonEventTest(value, 'HTML Document', element, mandatory);
};

createHTMLDocumentEventTest('blur', document.body);
createHTMLDocumentEventTest('focus', document.body);
createHTMLDocumentEventTest('load', document.body);
createHTMLDocumentEventTest('resize', window, false);
createHTMLDocumentEventTest('unload', document.body, false);

// Category: HTML Element.
var createHTMLElementTest = function(value, element, mandatory) {
  createCommonDomTest(value, 'HTML Element', element, mandatory);
};

createHTMLElementTest('className', document.body);
createHTMLElementTest('getBoundingClientRect', document.body);
createHTMLElementTest('id', document.body);
createHTMLElementTest('innerHTML', document.body);
createHTMLElementTest('nodeName', document.body);
createHTMLElementTest('nodeType', document.body);
createHTMLElementTest('style', document.body);
createHTMLElementTest('textContent', document.body);

// Category: HTML IFrame Element.
createCommonDomTest(
    'contentWindow',
    'HTML IFrame Element',
    document.createElement('iframe'),
    false);

// Category: HTML Input Element.
createCommonDomTest(
    'focus', 'HTML Input Element', document.createElement('input'));

// Category: HTML Media Element.

/**
 * Ensure the DOM implementation of specified properties of HTMLMediaElement.
 */
var createMediaElementTest = function(value, mandatory) {
  var name = 'HTMLMediaElement.' + value;
  var test = createDocumentTest(name, 'HTML Media Element', mandatory);
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

createMediaElementTest('canPlayType');
createMediaElementTest('autoplay');
createMediaElementTest('load');
createMediaElementTest('pause');
createMediaElementTest('play');
createMediaElementTest('muted');
createMediaElementTest('volume');
createMediaElementTest('currentTime');
createMediaElementTest('duration');
createMediaElementTest('buffered');
createMediaElementTest('paused');
createMediaElementTest('ended');

// Category: HTML Select Element.
createCommonDomTest(
    'focus', 'HTML Select Element', document.createElement('select'));

return {tests: tests, info: info, fields: fields, viewType: 'default'};
};

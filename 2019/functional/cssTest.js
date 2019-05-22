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
 * CSS Test Suite.
 * @class
 */
var CssTest = function() {

var cssVersion = 'Current Editor\'s Draft';

var tests = [];
var info = 'Spec Version: ' + cssVersion + ' | Default Timeout: ' +
    TestBase.timeout + 'ms';

var fields = ['passes', 'failures', 'timeouts'];

var createCssTest = function(name, category, mandatory) {
  var t = createTest(name);
  t.prototype.index = tests.length;
  t.prototype.passes = 0;
  t.prototype.failures = 0;
  t.prototype.timeouts = 0;
  t.prototype.category = category || 'CSS';
  if (typeof mandatory === 'boolean') {
    t.prototype.mandatory = mandatory;
  }
  tests.push(t);
  return t;
};

/**
 * Validate CSS3 trasitions through Modernizr.
 */
var testCss3Transitions = createCssTest(
    'CSS3 Transitions', 'CSS Fundamentals', false);
testCss3Transitions.prototype.title = 'Test CSS3 Transitions.';
testCss3Transitions.prototype.start = function() {
  if (Modernizr.csstransitions)
    this.runner.succeed();
  else
    this.runner.fail('Modernizr finds no csstransitions support.');
};


/**
 * Validate CSS properties through Modernizr.
 */
var createCommonTest = function(name, category, mandatory) {
  var name = name;
  var test = createCssTest(name, category, mandatory);
  test.prototype.title = 'Test ' + name + ' by Modernizr.prefixed.';
  test.prototype.start = function() {
    try {
      var field = util.MakeFieldName(name);
      if (Modernizr.prefixed(field))
        this.runner.succeed();
      else
        throw 'No ' + name + ' detected by Modernizr.prefixed.';
    } catch (e) {
      this.runner.fail(e);
    }
  }
};


createCommonTest('background', 'Background');
createCommonTest('background-attachment', 'Background', false);
createCommonTest('background-color', 'Background');
createCommonTest('background-image', 'Background');
createCommonTest('background-position', 'Background');
createCommonTest('background-repeat', 'Background');
createCommonTest('background-size', 'Background');

createCommonTest('border', 'Border');
createCommonTest('border-collapse', 'Border', false);
createCommonTest('border-color', 'Border');
createCommonTest('border-left', 'Border');
createCommonTest('border-left-color', 'Border');
createCommonTest('border-left-style', 'Border');
createCommonTest('border-left-width', 'Border');
createCommonTest('border-right', 'Border');
createCommonTest('border-right-color', 'Border');
createCommonTest('border-right-style', 'Border');
createCommonTest('border-right-width', 'Border');
createCommonTest('border-spacing', 'Border', false);
createCommonTest('border-style', 'Border');
createCommonTest('border-top', 'Border');
createCommonTest('border-top-color', 'Border');
createCommonTest('border-top-style', 'Border');
createCommonTest('border-top-width', 'Border');
createCommonTest('border-width', 'Border');
createCommonTest('border-bottom', 'Border');
createCommonTest('border-bottom-color', 'Border');
createCommonTest('border-bottom-style', 'Border');
createCommonTest('border-bottom-width', 'Border');

createCommonTest('animation', 'CSS Fundamentals');
createCommonTest('bottom', 'CSS Fundamentals');
createCommonTest('box-shadow', 'CSS Fundamentals');
createCommonTest('caption-side', 'CSS Fundamentals', false);
createCommonTest('clear', 'CSS Fundamentals', false);
createCommonTest('clip', 'CSS Fundamentals', false);
createCommonTest('color', 'CSS Fundamentals');
createCommonTest('content', 'CSS Fundamentals');
createCommonTest('counter-increment', 'CSS Fundamentals', false);
createCommonTest('counter-reset', 'CSS Fundamentals', false);
createCommonTest('cursor', 'CSS Fundamentals', false);
createCommonTest('css-float', 'CSS Fundamentals', false);
createCommonTest('direction', 'CSS Fundamentals', false);
createCommonTest('display', 'CSS Fundamentals');
createCommonTest('empty-cells', 'CSS Fundamentals', false);
createCommonTest('float', 'CSS Fundamentals', false);
createCommonTest('height', 'CSS Fundamentals');
createCommonTest('left', 'CSS Fundamentals');
createCommonTest('letter-spacing', 'CSS Fundamentals', false);
createCommonTest('line-height', 'CSS Fundamentals');
createCommonTest('max-height', 'CSS Fundamentals');
createCommonTest('max-width', 'CSS Fundamentals');
createCommonTest('min-height', 'CSS Fundamentals');
createCommonTest('min-width', 'CSS Fundamentals');
createCommonTest('opacity', 'CSS Fundamentals', false);
createCommonTest('orphans', 'CSS Fundamentals', false);
createCommonTest('overflow', 'CSS Fundamentals');
createCommonTest('position', 'CSS Fundamentals');
createCommonTest('quotes', 'CSS Fundamentals', false);
createCommonTest('right', 'CSS Fundamentals');
createCommonTest('size', 'CSS Fundamentals', false);
createCommonTest('table-layout', 'CSS Fundamentals', false);
createCommonTest('top', 'CSS Fundamentals');
createCommonTest('transform', 'CSS Fundamentals');
createCommonTest('transform-origin', 'CSS Fundamentals');
createCommonTest('unicode-bidi', 'CSS Fundamentals', false);
createCommonTest('vertical-align', 'CSS Fundamentals');
createCommonTest('visibility', 'CSS Fundamentals');
createCommonTest('white-space', 'CSS Fundamentals');
createCommonTest('widows', 'CSS Fundamentals', false);
createCommonTest('width', 'CSS Fundamentals');
createCommonTest('word-spacing', 'CSS Fundamentals', false);
createCommonTest('z-index', 'CSS Fundamentals');

createCommonTest('font', 'Font');
createCommonTest('font-family', 'Font');
createCommonTest('font-size', 'Font');
createCommonTest('font-stretch', 'Font', false);
createCommonTest('font-style', 'Font');
createCommonTest('font-variant', 'Font', false);
createCommonTest('font-weight', 'Font');

createCommonTest('list-style', 'List Style', false);
createCommonTest('list-style-image', 'List Style', false);
createCommonTest('list-style-position', 'List Style', false);
createCommonTest('list-style-type', 'List Style', false);

createCommonTest('margin', 'Margin');
createCommonTest('margin-left', 'Margin');
createCommonTest('margin-right', 'Margin');
createCommonTest('margin-top', 'Margin');
createCommonTest('margin-bottom', 'Margin');

createCommonTest('outline', 'Outline', false);
createCommonTest('outline-color', 'Outline', false);
createCommonTest('outline-style', 'Outline', false);
createCommonTest('outline-width', 'Outline', false);

createCommonTest('padding', 'Padding');
createCommonTest('padding-left', 'Padding');
createCommonTest('padding-right', 'Padding');
createCommonTest('padding-top', 'Padding');
createCommonTest('padding-bottom', 'Padding');

createCommonTest('page', 'Page', false);
createCommonTest('page-break-after', 'Page', false);
createCommonTest('page-break-before', 'Page', false);
createCommonTest('page-break-inside', 'Page', false);

createCommonTest('text-align', 'Text');
createCommonTest('text-decoration', 'Text');
createCommonTest('text-indent', 'Text');
createCommonTest('text-overflow', 'Text');
createCommonTest('text-shadow', 'Text');
createCommonTest('text-transform', 'Text');

createCommonTest('transition', 'Trasition');
createCommonTest('transition-delay', 'Trasition');
createCommonTest('transition-duration', 'Trasition');
createCommonTest('transition-property', 'Trasition');
createCommonTest('transition-timing-function', 'Trasition');


/**
 * Setup selector elements relations for testings.
 */
var setupSelectorElement = function() {
  var selectorElement = document.createElement('span');
  selectorElement.className = 'test1 test2';
  selectorElement.setAttribute('testattr', 'test3');
  selectorElement.id = 'test4';
  document.getElementById('testArea').appendChild(selectorElement);
};

/**
 * Teardown selector elements when test is finished.
 */
var tearDownSelectorElement = function() {
  var selectorElement = document.getElementById('test4');
  selectorElement.parentNode.removeChild(selectorElement);
};


/**
 * Test if querySelector is properly supported.
 */
var createSelectorTest = function(name, value, mandatory) {
  var name = name;
  var test = createCssTest(name, 'Selector', mandatory);
  test.prototype.title = 'Test ' + name + ' document.querySelector.';
  test.prototype.start = function() {
    try {
      setupSelectorElement();
      if (!!(document.querySelector(value)))
        this.runner.succeed();
      else
        throw 'No ' + name + ' detected by querySelector.';
    } catch (e) {
      this.runner.fail(e);
    } finally {
      tearDownSelectorElement();
    }
  }
};

createSelectorTest('Type selector', 'span');
createSelectorTest('ID selector', '#test4');
createSelectorTest('Class selector', '.test1');
createSelectorTest('Multiple Class selector', '.test1.test2');
createSelectorTest('Descendant selector', 'body * span');
createSelectorTest('Child selector', 'body > span');
createSelectorTest('Attribute selector', '[testattr=test3]', false);

return {tests: tests, info: info, fields: fields, viewType: 'default'};
};
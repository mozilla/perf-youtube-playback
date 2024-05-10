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

var createCssTest = function(testId, name, category = 'CSS', mandatory = true) {
  var t = createTest(name, category, mandatory, testId, 'CSS Conformance Tests');
  t.prototype.index = tests.length;
  tests.push(t);
  return t;
};

/**
 * Validate CSS3 trasitions through Modernizr.
 */
var testCss3Transitions = createCssTest(
    '15.1.1.1', 'CSS3 Transitions', 'CSS Fundamentals', false);
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
var createCommonTest = function(testId, name, category, mandatory) {
  var name = name;
  var test = createCssTest(testId, name, category, mandatory);
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


createCommonTest('15.2.1.1', 'background', 'Background');
createCommonTest('15.2.2.1', 'background-attachment', 'Background', false);
createCommonTest('15.2.3.1', 'background-color', 'Background');
createCommonTest('15.2.4.1', 'background-image', 'Background');
createCommonTest('15.2.5.1', 'background-position', 'Background');
createCommonTest('15.2.6.1', 'background-repeat', 'Background');
createCommonTest('15.2.7.1', 'background-size', 'Background');

createCommonTest('15.3.1.1', 'border', 'Border');
createCommonTest('15.3.2.1', 'border-collapse', 'Border', false);
createCommonTest('15.3.3.1', 'border-color', 'Border');
createCommonTest('15.3.4.1', 'border-left', 'Border');
createCommonTest('15.3.5.1', 'border-left-color', 'Border');
createCommonTest('15.3.6.1', 'border-left-style', 'Border');
createCommonTest('15.3.7.1', 'border-left-width', 'Border');
createCommonTest('15.3.8.1', 'border-right', 'Border');
createCommonTest('15.3.9.1', 'border-right-color', 'Border');
createCommonTest('15.3.10.1', 'border-right-style', 'Border');
createCommonTest('15.3.11.1', 'border-right-width', 'Border');
createCommonTest('15.3.12.1', 'border-spacing', 'Border', false);
createCommonTest('15.3.13.1', 'border-style', 'Border');
createCommonTest('15.3.14.1', 'border-top', 'Border');
createCommonTest('15.3.15.1', 'border-top-color', 'Border');
createCommonTest('15.3.16.1', 'border-top-style', 'Border');
createCommonTest('15.3.17.1', 'border-top-width', 'Border');
createCommonTest('15.3.18.1', 'border-width', 'Border');
createCommonTest('15.3.19.1', 'border-bottom', 'Border');
createCommonTest('15.3.20.1', 'border-bottom-color', 'Border');
createCommonTest('15.3.21.1', 'border-bottom-style', 'Border');
createCommonTest('15.3.22.1', 'border-bottom-width', 'Border');

createCommonTest('15.4.1.1', 'animation', 'CSS Fundamentals');
createCommonTest('15.4.2.1', 'bottom', 'CSS Fundamentals');
createCommonTest('15.4.3.1', 'box-shadow', 'CSS Fundamentals');
createCommonTest('15.4.4.1', 'caption-side', 'CSS Fundamentals', false);
createCommonTest('15.4.5.1', 'clear', 'CSS Fundamentals', false);
createCommonTest('15.4.6.1', 'clip', 'CSS Fundamentals', false);
createCommonTest('15.4.7.1', 'color', 'CSS Fundamentals');
createCommonTest('15.4.8.1', 'content', 'CSS Fundamentals');
createCommonTest('15.4.9.1', 'counter-increment', 'CSS Fundamentals', false);
createCommonTest('15.4.10.1', 'counter-reset', 'CSS Fundamentals', false);
createCommonTest('15.4.11.1', 'cursor', 'CSS Fundamentals', false);
createCommonTest('15.4.12.1', 'css-float', 'CSS Fundamentals', false);
createCommonTest('15.4.13.1', 'direction', 'CSS Fundamentals', false);
createCommonTest('15.4.14.1', 'display', 'CSS Fundamentals');
createCommonTest('15.4.15.1', 'empty-cells', 'CSS Fundamentals', false);
createCommonTest('15.4.16.1', 'float', 'CSS Fundamentals', false);
createCommonTest('15.4.17.1', 'height', 'CSS Fundamentals');
createCommonTest('15.4.18.1', 'left', 'CSS Fundamentals');
createCommonTest('15.4.19.1', 'letter-spacing', 'CSS Fundamentals', false);
createCommonTest('15.4.20.1', 'line-height', 'CSS Fundamentals');
createCommonTest('15.4.21.1', 'max-height', 'CSS Fundamentals');
createCommonTest('15.4.22.1', 'max-width', 'CSS Fundamentals');
createCommonTest('15.4.23.1', 'min-height', 'CSS Fundamentals');
createCommonTest('15.4.24.1', 'min-width', 'CSS Fundamentals');
createCommonTest('15.4.25.1', 'opacity', 'CSS Fundamentals', false);
createCommonTest('15.4.26.1', 'orphans', 'CSS Fundamentals', false);
createCommonTest('15.4.27.1', 'overflow', 'CSS Fundamentals');
createCommonTest('15.4.28.1', 'position', 'CSS Fundamentals');
createCommonTest('15.4.29.1', 'quotes', 'CSS Fundamentals', false);
createCommonTest('15.4.30.1', 'right', 'CSS Fundamentals');
createCommonTest('15.4.31.1', 'size', 'CSS Fundamentals', false);
createCommonTest('15.4.32.1', 'table-layout', 'CSS Fundamentals', false);
createCommonTest('15.4.33.1', 'top', 'CSS Fundamentals');
createCommonTest('15.4.34.1', 'transform', 'CSS Fundamentals');
createCommonTest('15.4.35.1', 'transform-origin', 'CSS Fundamentals');
createCommonTest('15.4.36.1', 'unicode-bidi', 'CSS Fundamentals', false);
createCommonTest('15.4.37.1', 'vertical-align', 'CSS Fundamentals');
createCommonTest('15.4.38.1', 'visibility', 'CSS Fundamentals');
createCommonTest('15.4.39.1', 'white-space', 'CSS Fundamentals');
createCommonTest('15.4.40.1', 'widows', 'CSS Fundamentals', false);
createCommonTest('15.4.41.1', 'width', 'CSS Fundamentals');
createCommonTest('15.4.42.1', 'word-spacing', 'CSS Fundamentals', false);
createCommonTest('15.4.43.1', 'z-index', 'CSS Fundamentals');

createCommonTest('15.5.1.1', 'font', 'Font');
createCommonTest('15.5.2.1', 'font-family', 'Font');
createCommonTest('15.5.3.1', 'font-size', 'Font');
createCommonTest('15.5.4.1', 'font-stretch', 'Font', false);
createCommonTest('15.5.5.1', 'font-style', 'Font');
createCommonTest('15.5.6.1', 'font-variant', 'Font', false);
createCommonTest('15.5.7.1', 'font-weight', 'Font');

createCommonTest('15.6.1.1', 'list-style', 'List Style', false);
createCommonTest('15.6.2.1', 'list-style-image', 'List Style', false);
createCommonTest('15.6.3.1', 'list-style-position', 'List Style', false);
createCommonTest('15.6.4.1', 'list-style-type', 'List Style', false);

createCommonTest('15.7.1.1', 'margin', 'Margin');
createCommonTest('15.7.2.1', 'margin-left', 'Margin');
createCommonTest('15.7.3.1', 'margin-right', 'Margin');
createCommonTest('15.7.4.1', 'margin-top', 'Margin');
createCommonTest('15.7.5.1', 'margin-bottom', 'Margin');

createCommonTest('15.8.1.1', 'outline', 'Outline', false);
createCommonTest('15.8.2.1', 'outline-color', 'Outline', false);
createCommonTest('15.8.3.1', 'outline-style', 'Outline', false);
createCommonTest('15.8.4.1', 'outline-width', 'Outline', false);

createCommonTest('15.9.1.1', 'padding', 'Padding');
createCommonTest('15.9.2.1', 'padding-left', 'Padding');
createCommonTest('15.9.3.1', 'padding-right', 'Padding');
createCommonTest('15.9.4.1', 'padding-top', 'Padding');
createCommonTest('15.9.5.1', 'padding-bottom', 'Padding');

createCommonTest('15.10.1.1', 'page', 'Page', false);
createCommonTest('15.10.2.1', 'page-break-after', 'Page', false);
createCommonTest('15.10.3.1', 'page-break-before', 'Page', false);
createCommonTest('15.10.4.1', 'page-break-inside', 'Page', false);

createCommonTest('15.11.1.1', 'text-align', 'Text');
createCommonTest('15.11.2.1', 'text-decoration', 'Text');
createCommonTest('15.11.3.1', 'text-indent', 'Text');
createCommonTest('15.11.4.1', 'text-overflow', 'Text');
createCommonTest('15.11.5.1', 'text-shadow', 'Text');
createCommonTest('15.11.6.1', 'text-transform', 'Text');

createCommonTest('15.12.1.1', 'transition', 'Trasition');
createCommonTest('15.12.2.1', 'transition-delay', 'Trasition');
createCommonTest('15.12.3.1', 'transition-duration', 'Trasition');
createCommonTest('15.12.4.1', 'transition-property', 'Trasition');
createCommonTest('15.12.5.1', 'transition-timing-function', 'Trasition');


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
var createSelectorTest = function(testId, name, value, mandatory) {
  var name = name;
  var test = createCssTest(testId, name, 'Selector', mandatory);
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

createSelectorTest('15.13.1.1', 'Type selector', 'span');
createSelectorTest('15.13.2.1', 'ID selector', '#test4');
createSelectorTest('15.13.3.1', 'Class selector', '.test1');
createSelectorTest('15.13.4.1', 'Multiple Class selector', '.test1.test2');
createSelectorTest('15.13.5.1', 'Descendant selector', 'body * span');
createSelectorTest('15.13.6.1', 'Child selector', 'body > span');
createSelectorTest('15.13.7.1', 'Attribute selector', '[testattr=test3]', false);

return {tests: tests, info: info, fields: fields, viewType: 'default'};
};

try {
  exports.getTest = CssTest;
} catch (e) {
  // do nothing, this function is not supposed to work for browser, but it's for
  // Node js to generate json file instead.
}
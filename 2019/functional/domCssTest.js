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
 * DOM CSS Test Suite.
 * @class
 */
var DomcssTest = function() {

var domCssVersion = 'Current Editor\'s Draft';

var tests = [];
var info = 'Spec Version: ' + domCssVersion + ' | Default Timeout: ' +
    TestBase.timeout + 'ms';

var fields = ['passes', 'failures', 'timeouts'];

var createDomCssTest = function(
    testId, name, category = 'DOM CSS', mandatory = true) {
  var t = createTest(name, category, mandatory, testId, 'DOM CSS Tests');
  t.prototype.index = tests.length;
  tests.push(t);
  return t;
};


window.getCSSInterface = function(type) {
  for (var i = 0; i < document.styleSheets.length; i++) {
    for (var j = 0; j < document.styleSheets[i].cssRules.length; j++) {
      if (document.styleSheets[i].cssRules[j] instanceof type) {
        return document.styleSheets[i].cssRules[j];
      } else if (document.styleSheets[i].cssRules instanceof type) {
        // Some tests may only need a CSSRuleList
        return document.styleSheets[i].cssRules;
      } else if (document.styleSheets[i] instanceof type) {
        // Some tests may only need a CSSStyleSheet
        return document.styleSheets[i];
      } else if (document.styleSheets[i].cssRules[j] instanceof CSSStyleRule &&
          document.styleSheets[i].cssRules[j].style instanceof type) {
        // Some tests may only need a CSSStyleDeclaration
        return document.styleSheets[i].cssRules[j].style;
      }
    }
  }
  return null;
};

/**
 * Ensure the DOM and CSS are correctly supported through Modernizr.
 */
var createCommonCssTest = function(testId, name, category, arg, mandatory) {
  var test = createDomCssTest(testId, name, category, mandatory);
  test.prototype.title = 'Test CSS functionality ' + name;
  test.prototype.start = function() {
    try {
      var testRule = getCSSInterface(arg.type);
      if (!!(testRule) &&
          Modernizr.prefixed(arg.attribute, testRule, false) != false)
        this.runner.succeed();
      else {
        throw Modernizr.prefixed(arg.attribute, testRule, false);
      }
    } catch (e) {
      this.runner.fail(e);
    }
  };
};

createCommonCssTest(
    '17.1.1.1',
    'CSSFontFaceRule.style',
    'CSS Font',
    {type: window.CSSFontFaceRule, attribute: 'style'},
    false);

createCommonCssTest(
    '17.2.1.1',
    'CSSImportRule.href',
    'CSS Import Rule',
    {type: window.CSSImportRule, attribute:'href'},
    false);

createCommonCssTest(
    '17.2.2.1',
    'CSSImportRule.media',
    'CSS Import Rule',
    {type: window.CSSImportRule, attribute:'media'},
    false);

createCommonCssTest(
    '17.2.3.1',
    'CSSImportRule.styleSheet',
    'CSS Import Rule',
    {type: window.CSSImportRule, attribute:'styleSheet'},
    false);

createCommonCssTest(
    '17.3.1.1',
    'CSSMediaRule.cssRules',
    'CSS Media Rule',
    {type: window.CSSMediaRule, attribute: 'cssRules'});

createCommonCssTest(
    '17.3.2.1',
    'CSSMediaRule.deleteRule',
    'CSS Media Rule',
    {type: window.CSSMediaRule, attribute: 'deleteRule'},
    false);

createCommonCssTest(
    '17.3.3.1',
    'CSSMediaRule.insertRule',
    'CSS Media Rule',
    {type: window.CSSMediaRule, attribute: 'insertRule'});

createCommonCssTest(
    '17.3.4.1',
    'CSSMediaRule.media',
    'CSS Media Rule',
    {type: window.CSSMediaRule, attribute: 'media'});

createCommonCssTest(
    '17.4.1.1',
    'CSSPageRule.selectorText',
    'CSS Page Rule',
    {type: window.CSSPageRule, attribute: 'selectorText'},
    false);

createCommonCssTest(
    '17.4.2.1',
    'CSSPageRule.style',
    'CSS Page Rule',
    {type: window.CSSPageRule, attribute: 'style'},
    false);

createCommonCssTest(
    '17.5.1.1',
    'CSSRule.cssText',
    'CSS Rule',
    {type: window.CSSRule, attribute: 'cssText'});

createCommonCssTest(
    '17.5.2.1',
    'CSSRule.parentRule',
    'CSS Rule',
    {type: window.CSSRule, attribute: 'parentRule'});

createCommonCssTest(
    '17.5.3.1',
    'CSSRule.parentStyleSheet',
    'CSS Rule',
    {type: window.CSSRule, attribute: 'parentStyleSheet'});

createCommonCssTest(
    '17.6.1.1',
    'CSSRuleList.item',
    'CSS Rule List',
    {type: window.CSSRuleList, attribute: 'item'});

createCommonCssTest(
    '17.6.2.1',
    'CSSRuleList.length',
    'CSS Rule List',
    {type: window.CSSRuleList, attribute: 'length'});

createCommonCssTest(
    '17.7.1.1',
    'CSSStyleDeclaration.cssText',
    'CSS Style Declaration',
    {type: window.CSSStyleDeclaration, attribute: 'cssText'});

createCommonCssTest(
    '17.7.2.1',
    'CSSStyleDeclaration.getPropertyCSSValue',
    'CSS Style Declaration',
    {type: window.CSSStyleDeclaration, attribute: 'getPropertyCSSValue'},
    false);

createCommonCssTest(
    '17.7.3.1',
    'CSSStyleDeclaration.getPropertyPriority',
    'CSS Style Declaration',
    {type: window.CSSStyleDeclaration, attribute: 'getPropertyPriority'},
    false);

createCommonCssTest(
    '17.7.4.1',
    'CSSStyleDeclaration.getPropertyValue',
    'CSS Style Declaration',
    {type: window.CSSStyleDeclaration, attribute: 'getPropertyValue'});

createCommonCssTest(
    '17.7.5.1',
    'CSSStyleDeclaration.item',
    'CSS Style Declaration',
    {type: window.CSSStyleDeclaration, attribute: 'item'});

createCommonCssTest(
    '17.7.6.1',
    'CSSStyleDeclaration.length',
    'CSS Style Declaration',
    {type: window.CSSStyleDeclaration, attribute: 'length'});

createCommonCssTest(
    '17.7.7.1',
    'CSSStyleDeclaration.parentRule',
    'CSS Style Declaration',
    {type: window.CSSStyleDeclaration, attribute: 'parentRule'});

createCommonCssTest(
    '17.7.8.1',
    'CSSStyleDeclaration.removeProperty',
    'CSS Style Declaration',
    {type: window.CSSStyleDeclaration, attribute: 'removeProperty'});

createCommonCssTest(
    '17.7.9.1',
    'CSSStyleDeclaration.setProperty',
    'CSS Style Declaration',
    {type: window.CSSStyleDeclaration, attribute: 'setProperty'});

createCommonCssTest(
    '17.8.1.1',
    'CSSStyleRule.selectorText',
    'CSS Style Rule',
    {type: window.CSSStyleRule, attribute: 'selectorText'},
    false);

createCommonCssTest(
    '17.8.2.1',
    'CSSStyleRule.style',
    'CSS Style Rule',
    {type: window.CSSStyleRule, attribute: 'style'});

createCommonCssTest(
    '17.9.1.1',
    'CSSStyleSheet.cssRules',
    'CSS Style Sheet',
    {type: window.CSSStyleSheet, attribute: 'cssRules'});

createCommonCssTest(
    '17.9.2.1',
    'CSSStyleSheet.deleteRule',
    'CSS Style Sheet',
    {type: window.CSSStyleSheet, attribute: 'deleteRule'},
    false);

createCommonCssTest(
    '17.9.3.1',
    'CSSStyleSheet.insertRule',
    'CSS Style Sheet',
    {type: window.CSSStyleSheet, attribute: 'insertRule'});

createCommonCssTest(
    '17.9.4.1',
    'CSSStyleSheet.ownerRule',
    'CSS Style Sheet',
    {type: window.CSSStyleSheet, attribute: 'ownerRule'},
    false);


return {tests: tests, info: info, fields: fields, viewType: 'default'};
};

try {
  exports.getTest = DomcssTest;
} catch (e) {
  // do nothing, this function is not supposed to work for browser, but it's for
  // Node js to generate json file instead.
}
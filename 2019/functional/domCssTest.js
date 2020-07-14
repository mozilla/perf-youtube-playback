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

var createDomCssTest = function(name, category, mandatory) {
  var t = createTest(name);
  t.prototype.index = tests.length;
  t.prototype.passes = 0;
  t.prototype.failures = 0;
  t.prototype.timeouts = 0;
  t.prototype.category = category || 'DOM CSS';
  if (typeof mandatory === 'boolean') {
    t.prototype.mandatory = mandatory;
  }
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
var createCommonCssTest = function(name, category, arg, mandatory) {
  var test = createDomCssTest(name, category, mandatory);
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
    'CSSFontFaceRule.style',
    'CSS Font',
    {type: window.CSSFontFaceRule, attribute: 'style'},
    false);

createCommonCssTest(
    'CSSImportRule.href',
    'CSS Import Rule',
    {type: window.CSSImportRule, attribute:'href'},
    false);

createCommonCssTest(
    'CSSImportRule.media',
    'CSS Import Rule',
    {type: window.CSSImportRule, attribute:'media'},
    false);

createCommonCssTest(
    'CSSImportRule.styleSheet',
    'CSS Import Rule',
    {type: window.CSSImportRule, attribute:'styleSheet'},
    false);

createCommonCssTest(
    'CSSMediaRule.cssRules',
    'CSS Media Rule',
    {type: window.CSSMediaRule, attribute: 'cssRules'});

createCommonCssTest(
    'CSSMediaRule.deleteRule',
    'CSS Media Rule',
    {type: window.CSSMediaRule, attribute: 'deleteRule'},
    false);

createCommonCssTest(
    'CSSMediaRule.insertRule',
    'CSS Media Rule',
    {type: window.CSSMediaRule, attribute: 'insertRule'});

createCommonCssTest(
    'CSSMediaRule.media',
    'CSS Media Rule',
    {type: window.CSSMediaRule, attribute: 'media'});

createCommonCssTest(
    'CSSPageRule.selectorText',
    'CSS Page Rule',
    {type: window.CSSPageRule, attribute: 'selectorText'},
    false);

createCommonCssTest(
    'CSSPageRule.style',
    'CSS Page Rule',
    {type: window.CSSPageRule, attribute: 'style'},
    false);

createCommonCssTest(
    'CSSRule.cssText',
    'CSS Rule',
    {type: window.CSSRule, attribute: 'cssText'});

createCommonCssTest(
    'CSSRule.parentRule',
    'CSS Rule',
    {type: window.CSSRule, attribute: 'parentRule'});

createCommonCssTest(
    'CSSRule.parentStyleSheet',
    'CSS Rule',
    {type: window.CSSRule, attribute: 'parentStyleSheet'});

createCommonCssTest(
    'CSSRuleList.item',
    'CSS Rule List',
    {type: window.CSSRuleList, attribute: 'item'});

createCommonCssTest(
    'CSSRuleList.length',
    'CSS Rule List',
    {type: window.CSSRuleList, attribute: 'length'});

createCommonCssTest(
    'CSSStyleDeclaration.cssText',
    'CSS Style Declaration',
    {type: window.CSSStyleDeclaration, attribute: 'cssText'});

createCommonCssTest(
    'CSSStyleDeclaration.getPropertyCSSValue',
    'CSS Style Declaration',
    {type: window.CSSStyleDeclaration, attribute: 'getPropertyCSSValue'},
    false);

createCommonCssTest(
    'CSSStyleDeclaration.getPropertyPriority',
    'CSS Style Declaration',
    {type: window.CSSStyleDeclaration, attribute: 'getPropertyPriority'},
    false);

createCommonCssTest(
    'CSSStyleDeclaration.getPropertyValue',
    'CSS Style Declaration',
    {type: window.CSSStyleDeclaration, attribute: 'getPropertyValue'});

createCommonCssTest(
    'CSSStyleDeclaration.item',
    'CSS Style Declaration',
    {type: window.CSSStyleDeclaration, attribute: 'item'});

createCommonCssTest(
    'CSSStyleDeclaration.length',
    'CSS Style Declaration',
    {type: window.CSSStyleDeclaration, attribute: 'length'});

createCommonCssTest(
    'CSSStyleDeclaration.parentRule',
    'CSS Style Declaration',
    {type: window.CSSStyleDeclaration, attribute: 'parentRule'});

createCommonCssTest(
    'CSSStyleDeclaration.removeProperty',
    'CSS Style Declaration',
    {type: window.CSSStyleDeclaration, attribute: 'removeProperty'});

createCommonCssTest(
    'CSSStyleDeclaration.setProperty',
    'CSS Style Declaration',
    {type: window.CSSStyleDeclaration, attribute: 'setProperty'});

createCommonCssTest(
    'CSSStyleRule.selectorText',
    'CSS Style Rule',
    {type: window.CSSStyleRule, attribute: 'selectorText'},
    false);

createCommonCssTest(
    'CSSStyleRule.style',
    'CSS Style Rule',
    {type: window.CSSStyleRule, attribute: 'style'});

createCommonCssTest(
    'CSSStyleSheet.cssRules',
    'CSS Style Sheet',
    {type: window.CSSStyleSheet, attribute: 'cssRules'});

createCommonCssTest(
    'CSSStyleSheet.deleteRule',
    'CSS Style Sheet',
    {type: window.CSSStyleSheet, attribute: 'deleteRule'},
    false);

createCommonCssTest(
    'CSSStyleSheet.insertRule',
    'CSS Style Sheet',
    {type: window.CSSStyleSheet, attribute: 'insertRule'});

createCommonCssTest(
    'CSSStyleSheet.ownerRule',
    'CSS Style Sheet',
    {type: window.CSSStyleSheet, attribute: 'ownerRule'},
    false);


return {tests: tests, info: info, fields: fields, viewType: 'default'};
};
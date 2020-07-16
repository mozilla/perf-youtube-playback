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
 * HTML DOM Element Test Suite.
 * @class
 */
var DomelementTest = function () {
  var testVersion = 'Current Editor\'s Draft';

  var tests = [];
  var info = 'Spec Version: ' + testVersion +
      ' | Default Timeout: ' + TestBase.timeout + 'ms';

  var fields = ['passes', 'failures', 'timeouts'];

  var createElementTest = function (
      testId,
      name,
      category = 'Element',
      mandatory = true,
      title = '',
      passingCriteria = 'HTML element created is not HTMLUnknownElement',
      instruction = ''
  ) {
    var t = createTest(name, category, mandatory, testId, "HTML DOM Element Tests",
        title, passingCriteria, instruction);
    t.prototype.index = tests.length;
    tests.push(t);
    return t;
  };

  var createTemplateElementTest = function (
      testId, name, category, title, evaluate, mandatory,
      passingCriteria, instruction) {
    var test = createElementTest(testId, name, category, mandatory, title,
        passingCriteria, instruction);
    test.prototype.start = function () {
      try {
        if (evaluate()) {
          this.runner.succeed();
        } else {
          throw name + 'failed';
        }
      } catch (e) {
        this.runner.fail(e);
      }
    }
  };

  var createCommonElementTest = function (
      testId,
      name,
      value,
      mandatory = true,
      evaluate = function () {
        return !(
            document.createElement(value) instanceof window.HTMLUnknownElement);
      },
      title = 'Test ' + name + ' by create ' + value + ' Element.',
      passingCriteria = '',
      instruction = '') {
    createTemplateElementTest(testId, name + ' Element',
        'Element', title, evaluate, mandatory, passingCriteria,
        instruction);
  };

  createCommonElementTest('16.1.1.1', 'Unknown', null, true, function () {
    return document.createElement('UNKNOWN') instanceof
        window.HTMLUnknownElement;
  }, 'Test creating unknown element.');

  createCommonElementTest('16.1.2.1', 'Anchor', 'a');

  createCommonElementTest('16.1.3.1', 'Audio', 'audio', false, function () {
    return document.createElement('audio') !=
        '[object HTMLUnknownElement]' && Modernizr.audio;
  }, 'Test creation of audio element by Modernizr.');

  createCommonElementTest('16.1.4.1', 'Area', 'area', false);
  createCommonElementTest('16.1.5.1', 'Base', 'base', false);
  createCommonElementTest('16.1.6.1', 'BaseFont', 'basefont', false);
  createCommonElementTest('16.1.7.1', 'Blockquote', 'blockquote', false);
  createCommonElementTest('16.1.8.1', 'Body', 'body');
  createCommonElementTest('16.1.9.1', 'BR', 'br');
  createCommonElementTest('16.1.10.1', 'Button', 'button', false);

  createCommonElementTest('16.1.12.1', 'Deleted', 'del', false);
  createCommonElementTest('16.1.13.1', 'Directory', 'dir', false);
  createCommonElementTest('16.1.14.1', 'Div', 'div');
  createCommonElementTest('16.1.15.1', 'DList', 'dl', false);
  createCommonElementTest('16.1.16.1', 'FieldSet', 'fieldset', false);
  createCommonElementTest('16.1.17.1', 'Font', 'font', false);
  createCommonElementTest('16.1.18.1', 'Form', 'form', false);
  createCommonElementTest('16.1.19.1', 'Frame', 'frame', false);
  createCommonElementTest('16.1.20.1', 'FrameSet', 'frameset', false);
  createCommonElementTest('16.1.21.1', 'Head', 'head');
  createCommonElementTest('16.1.22.1', 'Heading 1', 'h1');
  createCommonElementTest('16.1.23.1', 'Heading 2', 'h2');
  createCommonElementTest('16.1.24.1', 'Heading 3', 'h3');
  createCommonElementTest('16.1.25.1', 'HR', 'hr', false);
  createCommonElementTest('16.1.26.1', 'HTML', 'html');
  createCommonElementTest('16.1.27.1', 'HTMLCollection', 'src', false);
  createCommonElementTest('16.1.28.1', 'Iframe', 'iframe', false);
  createCommonElementTest('16.1.29.1', 'Image', 'img', false);
  createCommonElementTest('16.1.30.1', 'Input', 'input', false);
  createCommonElementTest('16.1.31.1', 'Inserted', 'ins', false);
  createCommonElementTest('16.1.32.1', 'Label', 'label', false);
  createCommonElementTest('16.1.33.1', 'Legend', 'legend', false);
  createCommonElementTest('16.1.34.1', 'Link', 'link');
  createCommonElementTest('16.1.35.1', 'List', 'li', false);
  createCommonElementTest('16.1.36.1', 'Map', 'map', false);
  createCommonElementTest('16.1.37.1', 'Menu', 'menu', false);
  createCommonElementTest('16.1.38.1', 'Meta', 'meta');
  createCommonElementTest('16.1.39.1', 'Obejct', 'object', false);
  createCommonElementTest('16.1.40.1', 'Olist', 'ol', false);
  createCommonElementTest('16.1.41.1', 'OptGroup', 'optgroup', false);
  createCommonElementTest('16.1.42.1', 'Option', 'option', false);
  createCommonElementTest('16.1.43.1', 'Paragraph', 'p');
  createCommonElementTest('16.1.44.1', 'Param', 'param', false);
  createCommonElementTest('16.1.45.1', 'Pre', 'pre', false);
  createCommonElementTest('16.1.46.1', 'Quote', 'q', false);
  createCommonElementTest('16.1.47.1', 'Script', 'script');
  createCommonElementTest('16.1.48.1', 'Select', 'select', false);
  createCommonElementTest('16.1.49.1', 'Span', 'span');
  createCommonElementTest('16.1.50.1', 'Style', 'style');
  createCommonElementTest('16.1.51.1', 'Table Body', 'tbody', false);
  createCommonElementTest('16.1.52.1', 'Table', 'table', false);
  createCommonElementTest('16.1.53.1', 'Table Foot', 'tfoot', false);
  createCommonElementTest('16.1.54.1', 'Table Head', 'thead', false);
  createCommonElementTest('16.1.55.1', 'TableCol', 'col', false);
  createCommonElementTest('16.1.56.1', 'TableDataCell', 'td', false);
  createCommonElementTest('16.1.57.1', 'TableHeadCell', 'th', false);
  createCommonElementTest('16.1.59.1', 'TableRow', 'tr', false);
  createCommonElementTest('16.1.60.1', 'TextArea', 'textarea', false);
  createCommonElementTest('16.1.61.1', 'Title', 'title');
  createCommonElementTest('16.1.62.1', 'UList', 'ul', false);
  createCommonElementTest('16.1.63.1', 'Video', 'video');

  /**
   * Validate videoElement fields is correctly handled.
   */
  var createVideoFieldTest = function (
      testId,
      name,
      evaluate,
      mandatory = true,
      passingCriteria = 'VideoElement fields is correctly handled',
      instruction = '') {
    var setupVideoElement = function () {
      var videoElement = document.createElement('video');
      if (!(videoElement instanceof window.HTMLUnknownElement)) {
        return evaluate(videoElement);
      } else {
        return false;
      }
    };

    var title = 'Test video.' + name + ' by create video Element.';
    createTemplateElementTest(testId, 'video.'
        + name, 'Video', title, setupVideoElement, mandatory, passingCriteria,
        instruction);
  };

  createVideoFieldTest('16.2.1.1', 'height', function (videoElement) {
    if (videoElement.height == 0) {
      videoElement.height = 1080;
      if (videoElement.height == 1080) {
        return true;
      }
    }
    return false;
  });

  createVideoFieldTest('16.2.2.1', 'width', function (videoElement) {
    if (videoElement.width == 0) {
      videoElement.width = 1920;
      if (videoElement.width == 1920) {
        return true;
      }
    }
    return false;
  });

  createVideoFieldTest('16.2.3.1', 'videoHeight', function (videoElement) {
    if (videoElement.videoHeight == 0) {
      try {
        // read only
        videoElement.videoHeight = 1080;
      } catch (e) {
        return videoElement.videoHeight != 1080;
      }
    }
    return false;
  });

  createVideoFieldTest('16.2.4.1', 'videoWidth', function (videoElement) {
    if (videoElement.videoWidth == 0) {
      try {
        // read only
        videoElement.videoWidth = 1920;
      } catch (e) {
        return videoElement.videoWidth != 1920;
      }
    }
    return false;
  });

  createVideoFieldTest('16.2.5.1', 'poster', function (videoElement) {
    return videoElement.poster == '';
  }, false);

  /**
   * Setup element attributes for testing.
   */
  var setupAttrElement = function () {
    var attrElement = document.createElement('div');
    attrElement.className = 'attr-class';
    attrElement.id = 'attr-test';
    document.getElementById('testArea').appendChild(attrElement);
    console.log('setup');
  };

  /**
   * Teardown element attributes for testing.
   */
  var tearDownAttrElement = function () {
    var attrElement = document.getElementById('attr-test');
    attrElement.parentNode.removeChild(attrElement);
    console.log('teardown');
  };

  /**
   * Ensure element.attributes behave as expected.
   */
  var createAttrFieldTest = function (testId, name, evaluate, mandatory = true,
      passingCriteria = 'Ensure element.attributes behave as expected',
      instruction = '') {
    var title = 'Test Attr.' + name + '.';
    var test = createElementTest(testId, 'Attr.'
        + name, 'Attribute', mandatory, passingCriteria, instruction);
    test.prototype.start = function () {
      try {
        setupAttrElement()
        var attrElement = document.getElementById('attr-test');
        if (evaluate(attrElement)) {
          this.runner.succeed();
        } else {
          throw name + 'failed';
        }
      } catch (e) {
        this.runner.fail(e);
      } finally {
        tearDownAttrElement();
      }
    }
  };

  createAttrFieldTest('16.3.1.1', 'name', function (attrElement) {
    return attrElement.attributes.getNamedItem('id').name == 'id';
  });

  createAttrFieldTest('16.3.2.1', 'owner', function (attrElement) {
    return attrElement.attributes.getNamedItem('id').ownerElement ==
        attrElement;
  }, false);

  createAttrFieldTest('16.3.3.1', 'specified', function (attrElement) {
    return attrElement.attributes.getNamedItem('id').specified;
  }, false);

  createAttrFieldTest('16.3.4.1', 'value', function (attrElement) {
    return attrElement.attributes.getNamedItem('class').value == 'attr-class';
  });

  return {tests: tests, info: info, fields: fields, viewType: 'default'};
};

try {
  exports.getTest = DomelementTest;
} catch (e) {
  // do nothing, this function is not supposed to work for browser, but it's for
  // Node js to generate json file instead.
}
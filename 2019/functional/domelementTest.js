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
var DomelementTest = function() {
  var testVersion = 'Current Editor\'s Draft';

  var tests = [];
  var info = 'Spec Version: ' + testVersion +
      ' | Default Timeout: ' + TestBase.timeout + 'ms';

  var fields = ['passes', 'failures', 'timeouts'];

  var createElementTest = function(name, category, mandatory) {
    var t = createTest(name);
    t.prototype.index = tests.length;
    t.prototype.passes = 0;
    t.prototype.failures = 0;
    t.prototype.timeouts = 0;
    t.prototype.category = category || 'Element';
    if (typeof mandatory === 'boolean') {
      t.prototype.mandatory = mandatory;
    }
    tests.push(t);
    return t;
  };

  var createTemplateElementTest = function(
      name, category, title, evaluate, mandatory) {
    var test = createElementTest(name, category, mandatory);
    test.prototype.title = title;
    test.prototype.start = function() {
      try {
        if (evaluate())
          this.runner.succeed();
        else
          throw name + 'failed';
      } catch (e) {
        this.runner.fail(e);
      }
    }
  };

  var createCommonElementTest = function(
      name, value, mandatory, evaluate, title) {
    evaluate = evaluate || function() {
      return !(
          document.createElement(value) instanceof window.HTMLUnknownElement);
    };
    var title = title || 'Test ' + name + ' by create ' + value + ' Element.';
    createTemplateElementTest(
      name + ' Element', 'Element', title, evaluate, mandatory);
  };


  createCommonElementTest(
      'Unknown',
      null,
      true,
      function() {
        return document.createElement('UNKNOWN') instanceof
            window.HTMLUnknownElement;
      },
      'Test creating unknown element.');

  createCommonElementTest('Anchor', 'a');

  createCommonElementTest(
      'Audio',
      'audio',
      false,
      function() {
        return document.createElement('audio') !=
            '[object HTMLUnknownElement]' && Modernizr.audio;
      },
      'Test creation of audio element by Modernizr.');

  createCommonElementTest('Area', 'area', false);
  createCommonElementTest('Base', 'base', false);
  createCommonElementTest('BaseFont', 'basefont', false);
  createCommonElementTest('Blockquote', 'blockquote', false);
  createCommonElementTest('Body', 'body');
  createCommonElementTest('BR', 'br');
  createCommonElementTest('Button', 'button', false);

  createCommonElementTest(
      'Canvas',
      null,
      harnessConfig.support_webgl && !harnessConfig.is_cobalt,
      function() {
        return Modernizr.canvas;
      },
      'Test Canvas element by Modernizr.');


  createCommonElementTest('Deleted', 'del', false);
  createCommonElementTest('Directory', 'dir', false);
  createCommonElementTest('Div', 'div');
  createCommonElementTest('DList', 'dl', false);
  createCommonElementTest('FieldSet', 'fieldset', false);
  createCommonElementTest('Font', 'font', false);
  createCommonElementTest('Form', 'form', false);
  createCommonElementTest('Frame', 'frame', false);
  createCommonElementTest('FrameSet', 'frameset', false);
  createCommonElementTest('Head', 'head');
  createCommonElementTest('Heading 1', 'h1');
  createCommonElementTest('Heading 2', 'h2');
  createCommonElementTest('Heading 3', 'h3');
  createCommonElementTest('HR', 'hr', false);
  createCommonElementTest('HTML', 'html');
  createCommonElementTest('HTMLCollection', 'src', false);
  createCommonElementTest('Iframe', 'iframe', false);
  createCommonElementTest('Image', 'img');
  createCommonElementTest('Input', 'input', false);
  createCommonElementTest('Inserted', 'ins', false);
  createCommonElementTest('Label', 'label', false);
  createCommonElementTest('Legend', 'legend', false);
  createCommonElementTest('Link', 'link');
  createCommonElementTest('List', 'li', false);
  createCommonElementTest('Map', 'map', false);
  createCommonElementTest('Menu', 'menu', false);
  createCommonElementTest('Meta', 'meta');
  createCommonElementTest('Obejct', 'object', false);
  createCommonElementTest('Olist', 'ol', false);
  createCommonElementTest('OptGroup', 'optgroup', false);
  createCommonElementTest('Option', 'option', false);
  createCommonElementTest('Paragraph', 'p');
  createCommonElementTest('Param', 'param', false);
  createCommonElementTest('Pre', 'pre', false);
  createCommonElementTest('Quote', 'q', false);
  createCommonElementTest('Script', 'script');
  createCommonElementTest('Select', 'select', false);
  createCommonElementTest('Span', 'span');
  createCommonElementTest('Style', 'style');
  createCommonElementTest('Table Body', 'tbody', false);
  createCommonElementTest('Table', 'table', false);
  createCommonElementTest('Table Foot', 'tfoot', false);
  createCommonElementTest('Table Head', 'thead', false);
  createCommonElementTest('TableCol', 'col', false);
  createCommonElementTest('TableDataCell', 'td', false);
  createCommonElementTest('TableHeadCell', 'th', false);
  createCommonElementTest('TableRow', 'tr', false);
  createCommonElementTest('TextArea', 'textarea', false);
  createCommonElementTest('Title', 'title');
  createCommonElementTest('UList', 'ul', false);
  createCommonElementTest('Video', 'video');


  /**
   * Validate videoElement fields is correctly handled.
   */
  var createVideoFieldTest = function(name, evaluate, mandatory) {
    var setupVideoElement = function() {
      var videoElement = document.createElement('video');
      if (!(videoElement instanceof window.HTMLUnknownElement)) {
        return evaluate(videoElement);
      } else {
        return false;
      }
    };

    var title = 'Test video.' + name + ' by create video Element.';
    createTemplateElementTest(
        'video.' + name, 'Video', title, setupVideoElement, mandatory);
  };

  createVideoFieldTest('height', function(videoElement) {
    if (videoElement.height == 0) {
      videoElement.height = 1080;
      if (videoElement.height == 1080) return true;
    }
    return false;
  });

  createVideoFieldTest('width', function(videoElement) {
    if (videoElement.width == 0) {
      videoElement.width = 1920;
      if (videoElement.width == 1920) return true;
    }
    return false;
  });

  createVideoFieldTest('videoHeight', function(videoElement) {
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

  createVideoFieldTest('videoWidth', function(videoElement) {
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

  createVideoFieldTest('poster', function(videoElement) {
    return videoElement.poster == '';
  }, false);


  /**
   * Setup element attributes for testing.
   */
  var setupAttrElement = function() {
    var attrElement = document.createElement('div');
    attrElement.className = 'attr-class';
    attrElement.id = 'attr-test';
    document.getElementById('testArea').appendChild(attrElement);
    console.log('setup');
  };

  /**
   * Teardown element attributes for testing.
   */
  var tearDownAttrElement = function() {
    var attrElement = document.getElementById('attr-test');
    attrElement.parentNode.removeChild(attrElement);
    console.log('teardown');
  };

  /**
   * Ensure element.attributes behave as expected.
   */
  var createAttrFieldTest = function(name, evaluate, mandatory) {
    var title = 'Test Attr.' + name + '.';
    var test = createElementTest('Attr.' + name, 'Attribute', mandatory);
    test.prototype.title = title;
    test.prototype.start = function() {
      try {
        setupAttrElement()
        var attrElement = document.getElementById('attr-test');
        if (evaluate(attrElement))
          this.runner.succeed();
        else
          throw name + 'failed';
      } catch (e) {
        this.runner.fail(e);
      } finally {
        tearDownAttrElement();
      }
    }
  };

  createAttrFieldTest('name', function(attrElement) {
    return attrElement.attributes.getNamedItem('id').name == 'id';
  });

  createAttrFieldTest('owner', function(attrElement) {
    return attrElement.attributes.getNamedItem('id').ownerElement ==
        attrElement;
  }, false);

  createAttrFieldTest('specified', function(attrElement) {
    return attrElement.attributes.getNamedItem('id').specified;
  }, false);

  createAttrFieldTest('value', function(attrElement) {
    return attrElement.attributes.getNamedItem('class').value == 'attr-class';
  });


  return {tests: tests, info: info, fields: fields, viewType: 'default'};
};

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

// This file create the main interface of the app.
'use strict';

(function() {

var loadTests = function(testType) {
  // We have to make it compatible to the legacy url format.
  var testName = testType.substr(0, testType.indexOf('-'));
  if (testName == "playbackperf") {
    var subgroup =
      testType.substring(testType.indexOf('-') + 1, testType.lastIndexOf('-'));
    return window['PlaybackperfTest'](subgroup)
  } else {
    testName = util.MakeCapitalName(testName) + 'Test';
    return window[testName]();
  }
};

var parseParam = function(param, defaultValue) {
  var regex = new RegExp('(\\?|\\&)' + param + '=([-:,\\w]+)', 'g');
  var value = regex.exec(document.URL);
  return value ? value[2] : defaultValue;
};

var parseParams = function(testSuiteConfig) {
  var config = {};
  config.testType = parseParam('test_type', testSuiteConfig.defaultTestSuite);
  config.command = parseParam('command', '');
  config.timeout = Number(parseParam('timeout', TestBase.timeout));
  config.logging = !util.stringToBoolean(parseParam('disable_log', false));
  config.fullscreen = util.stringToBoolean(parseParam('fullscreen', false));
  config.loop = util.stringToBoolean(parseParam('loop', false));
  config.stoponfailure = util.stringToBoolean(
      parseParam('stoponfailure', false));
  config.enablewebm = util.stringToBoolean(
      parseParam('enablewebm', testSuiteConfig.enablewebm));
  config.muted = util.stringToBoolean(parseParam('muted', false));
  config.novp9 = util.stringToBoolean(parseParam('novp9', false));
  config.tests = parseParam('tests');
  config.exclude = parseParam('exclude');
  config.testsMask = parseParam('tests_mask', '');
  config.testid = parseParam('testid', '');
  config.cert_scope = parseParam('cert_scope', null);
  config.sig = parseParam('sig', null);
  config.start_time = parseParam('start_time', null);

  // See: https://wiki.mozilla.org/Performance_sheriffing/Raptor
  config.is_raptor = util.stringToBoolean(parseParam('raptor', false));

  config.is_cobalt = util.isCobalt();
  config.support_hdr = util.supportHdr();
  config.support_webspeech = util.supportWebSpeech();

  // Overloaded run command to support browsers that have limitations on extra
  // parameters. Example usage: command=run:1,2,3
  if (config.command.indexOf(':') != -1) {
    var commandSplit = config.command.split(':');
    config.command = commandSplit[0];
    config.tests = commandSplit[1];
  }
  return config;
};

var configureHarness = function(testSuiteConfig) {
  harnessConfig.controlMediaFormatSelection =
      testSuiteConfig.controlMediaFormatSelection;
  harnessConfig.recycleVideoTag = true;
  TestBase.timeout = harnessConfig.timeout;

  if (harnessConfig.testsMask) {
    harnessConfig.testsMask += '0';
  } else if (harnessConfig.tests) {
    harnessConfig.tests =
        harnessConfig.tests.split(',')
            .map(function(x) {
              if (x.indexOf('-') != -1) {
                var [start, end] = x.split('-');
                var arr = [];
                for (var i = parseInt(start); i <= parseInt(end); i++) {
                  arr.push(i);
                }
                return arr;
              } else {
                return parseInt(x);
              }
            })
            .reduce((acc, val) => acc.concat(val), [])
            .sort(function(a, b) {
              return a - b;
            });
    harnessConfig.tests = [...new Set(harnessConfig.tests)];
    for (var i = 0; i < harnessConfig.tests.length; ++i) {
      var index = harnessConfig.tests[i] * 1 - 1;
      if (index < 0)
        continue;
      harnessConfig.testsMask =
          util.resize(harnessConfig.testsMask, index, '0');
      harnessConfig.testsMask += '1';
    }
    harnessConfig.testsMask += '0';
  } else if (harnessConfig.exclude) {
    harnessConfig.exclude = harnessConfig.exclude.split(',').
        map(function(x) {return parseInt(x);}).
        sort(function(a, b) {return a - b;});
    for (var i = 0; i < harnessConfig.exclude.length; ++i) {
      var index = harnessConfig.exclude[i] * 1 - 1;
      if (index < 0)
        continue;
      harnessConfig.testsMask =
          util.resize(harnessConfig.testsMask, index, '1');
      harnessConfig.testsMask += '0';
    }
    harnessConfig.testsMask += '1';
  }

  if (!harnessConfig.testsMask) {
    harnessConfig.testsMask = '1';
  }
};

var createLogger = function() {
  window.LOG = function() {
    if (!harnessConfig.logging)
      return;
    var output = document.getElementById('output');
    var text = '';

    for (var i = 0; i < arguments.length; ++i)
      text += arguments[i].toString() + ' ';

    console.log(text);
    output.innerHTML = text + '\n' + output.innerHTML;
  };
};

window.globalRunner = null;

var createRunner = function(testSuite, testSuiteVer, testsMask) {
  var runner = new TestExecutor(testSuite, testsMask, testSuiteVer);

  // Expose the runner so outside/injected scripts can read it.
  window.globalRunner = runner;

  var id = 0;
  runner.getNewVideoTag = function() {
    var testarea = document.getElementById('testarea');
    var vid = 'v' + id;
    if (harnessConfig.recycleVideoTag)
      ++id;
    if (!document.getElementById(vid)) {
      testarea.innerHTML = '';
      testarea.appendChild(util.createElement('video', vid, 'box-right'));
      document.getElementById(vid).controls = true;
      document.getElementById(vid).muted = harnessConfig.muted;
      if (harnessConfig.fullscreen) {
        try {
          document.getElementById(vid).requestFullscreen();
        } catch(e) {
          this.fail('Failed to start video in fullscreen mode: ' + e);
        }
      }
    }
    return document.getElementById(vid);
  };

  runner.getControlContainer = function() {
    return document.getElementById('control');
  };

  runner.initialize();
  return runner;
};

var addTimestampHash = function() {
  var newTimeStamp = (new Date()).getTime();
  window.location.hash = newTimeStamp;
};

window.startMseTest = function(testSuiteVer) {
  setupMsePortability(testSuiteVer);
  var testSuiteVersion = testSuiteVersions[testSuiteVer];
  window.harnessConfig = parseParams(testSuiteVersion.config);
  window.harnessConfig.testSuite = testSuiteVer;

  addTimestampHash();

  if (!testSuiteVersion.testSuites.indexOf(harnessConfig.testType) === -1) {
    alert('Cannot find test type ' + harnessConfig.testType);
    throw 'Cannot find test type ' + harnessConfig.testType;
  }
  // This is a hack that will not work in all cases.
  if (!!window.Media && harnessConfig.novp9 &&
      harnessConfig.testType != 'playbackperf-test') {
    Media.VP9 = Media.H264;
  }

  configureHarness(testSuiteVersion.config);
  createLogger();

  var testSuite = loadTests(harnessConfig.testType);
  var runner = createRunner(testSuite, testSuiteVer, harnessConfig.testsMask);
  if (harnessConfig.command === 'run')
    runner.startTest(0, runner.testList.length);
};

})();

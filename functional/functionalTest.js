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
 * Functional Test Suite.
 * @class
 */
var FunctionalTest = function() {

const URL_PATH = 'lib/functional/src/';
const MEDIA_PATH = 'test-materials/media/';
const MAX_URL_LENGTH = 2047;

const TEST_MEDIA_SRC = {
  Jpg: MEDIA_PATH + 'qual-e/pass.jpg',
  Png: MEDIA_PATH + 'qual-e/pass.png',
  Webp: MEDIA_PATH + 'qual-e/pass.webp',
  SslTestVideoMp4: MEDIA_PATH + 'qual-e/sslTestVideo.mp4',
  SslTestVideoWebm: MEDIA_PATH + 'qual-e/sslTestVideo.webm',
};

const MS_TO_WAIT_FOR_FONTS = 3000;
const COBALT_REQ_URL =
    'https://cobalt.googlesource.com/cobalt/+/20.lts.stable/' +
    'src/cobalt/build/build.id?format=TEXT';

var functionalVersion = 'Current Editor\'s Draft';
var webkitPrefix = MediaSource.prototype.version.indexOf('webkit') >= 0;
var tests = [];
var testArea = document.getElementById('testArea');

var info = 'No Media Support!';
if (window.MediaSource) {
  info = 'Spec Version: ' + functionalVersion;
  info += ' | webkit prefix: ' + webkitPrefix.toString();
}
info += ' | Default Timeout: ' + TestBase.timeout + 'ms';

var fields = ['passes', 'failures', 'timeouts'];

var createFunctionalTest =
    function(testId, name, category = 'Functional', mandatory = true) {
  var t = createTest(name, category, mandatory, testId, 'Functional Tests');
  t.prototype.index = tests.length;
  tests.push(t);
  return t;
};

// Create and check if the element is supported by browser
var createElement = function(elementName) {
  var element = document.createElement(elementName);
  if (Object.prototype.toString.call(element)
      === '[object HTMLUnknownElement]') {
    throw Error(elementName + ' not supported!');
  }
  return element;
};

/**
 * Validate the existence of AudioContext and its properties.
 */
var createAudioContextPropertyTest = function(testId, value, evaluate) {
  var name = value ? 'AudioContext.' + value : 'AudioContext';
  var test = createFunctionalTest(testId, name,'AudioContext');
  test.prototype.title = 'Test if' + name + ' exists';
  test.prototype.start = function(runner) {
    try {
      var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (!evaluate(audioCtx)) {
        throw 'No ' + name + '.';
      }
      runner.succeed();
    } catch (e) {
      runner.fail(e);
    } finally {
      audioCtx.close();
    }
  }
};

createAudioContextPropertyTest('14.1.1.1', null, function(audioCtx) {
  return !!(audioCtx);
});
createAudioContextPropertyTest('14.1.2.1', 'destination', function(audioCtx) {
  return !!(audioCtx.destination);
});
createAudioContextPropertyTest('14.1.3.1', 'sampleRate', function(audioCtx) {
  return typeof audioCtx.sampleRate === 'number';
});
createAudioContextPropertyTest('14.1.4.1', 'currentTime', function(audioCtx) {
  return isNaN(audioCtx.currentTime) == false;
});
createAudioContextPropertyTest(
    '14.1.5.1', 'decodeAudioData', function(audioCtx) {
      return !!(audioCtx.decodeAudioData);
    });
createAudioContextPropertyTest(
  '14.1.6.1', 'createBufferSource', function(audioCtx) {
    return (
        !!audioCtx.createBufferSource &&
        audioCtx.createBufferSource() instanceof AudioBufferSourceNode);
  });

/**
 * Validate the existence of AudioBufferSourceNode and its properties.
 */
var createAudioBufferSourceNodeTest = function(
    testId, value, evaluate, mandatory) {
  var name = value ? 'AudioBufferSourceNode.' + value : 'AudioBufferSourceNode';
  var test =
      createFunctionalTest(testId, name, 'AudioBufferSourceNode', mandatory);
  test.prototype.title = 'Test if ' + name + ' exists.';
  test.prototype.start = function(runner) {
    try {
      var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      var source = audioCtx.createBufferSource();
      if (!evaluate(source)) {
        throw 'No ' + name + '.';
      }
      runner.succeed();
    } catch (e) {
      return runner.fail(e);
    } finally {
      audioCtx.close();
    }
  }
};

createAudioBufferSourceNodeTest('14.2.1.1', null, function(source) {
  return !!source;
});
createAudioBufferSourceNodeTest('14.2.2.1', 'buffer', function(source) {
  return !!(typeof source.buffer);
});
createAudioBufferSourceNodeTest('14.2.3.1', 'onended', function(source) {
  return !!(typeof source.onended);
});
createAudioBufferSourceNodeTest(
    '14.2.4.1',
    'playbackRate',
    function(source) {
      return (typeof source.playbackRate.defaultValue === 'number') &&
          (typeof source.playbackRate.value === 'number');
    },
    false);
createAudioBufferSourceNodeTest('14.2.5.1', 'start', function(source) {
  return !!(typeof source.start);
});
createAudioBufferSourceNodeTest('14.2.6.1', 'stop', function(source) {
  return !!(typeof source.stop);
});

/**
 * Validate the existence of AudioNode and its properties.
 */
var createAudioNodeTest = function(testId, value, evaluate) {
  var name = value ? 'AudioNode.' + value : 'AudioNode';
  var test = createFunctionalTest(testId, name, 'AudioNode');
  test.prototype.title = 'Test if ' + name + ' exists.';
  test.prototype.start = function(runner) {
    try {
      var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      var node = audioCtx.destination;
      if (!evaluate(node, audioCtx)) {
        throw 'No ' + name + '.';
      }
      runner.succeed();
    } catch (e) {
      runner.fail(e);
    } finally {
      audioCtx.close();
    }
  }
};

createAudioNodeTest('14.3.1.1', null, function(node) {
  return !!(node);
});
createAudioNodeTest('14.3.2.1', 'context', function(node, audioCtx) {
  return node.context === audioCtx;
});
createAudioNodeTest('14.3.3.1', 'numberOfInputs', function(node) {
  return typeof node.numberOfInputs === 'number';
});
createAudioNodeTest('14.3.4.1', 'numberOfOutputs', function(node) {
  return typeof node.numberOfOutputs === 'number';
});
createAudioNodeTest('14.3.5.1', 'channelCountMode', function(node) {
  return typeof node.channelCountMode === 'string';
});
createAudioNodeTest('14.3.6.1', 'channelInterpretation', function(node) {
  return typeof node.channelInterpretation === 'string';
});
createAudioNodeTest('14.3.7.1', 'connect', function(node, audioCtx) {
  return (!!(audioCtx.createBufferSource().connect));
});
createAudioNodeTest('14.3.8.1', 'disconnect', function(node, audioCtx) {
  return (!!(audioCtx.createBufferSource().disconnect));
});


// expand url into MAX length
var expandUrl = function(url, charset) {
  return url + new Array(MAX_URL_LENGTH - url.length - 1).join(charset);
}

/**
 * Ensure super long navigation URL is properly supported.
 */
var testNavigationURLLength = createFunctionalTest(
    '14.4.1.1', 'NavigationURLLength', 'URL Length', false);
testNavigationURLLength.prototype.title = 'Test Navigation URL Length support.';
testNavigationURLLength.prototype.start = function(runner) {
  try {
    var navElement = createElement('iframe');
    var randChar =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
            .charAt(Math.floor(Math.random() * 62));
    var url = expandUrl(URL_PATH + 'navUrlTest.html?q=', randChar);
    navElement.setAttribute('src', url);
    navElement.setAttribute('id', 'urlTestFrame' + randChar);
    testArea.appendChild(navElement);
    var frame = document.getElementById('urlTestFrame' + randChar);
    frame.onload = function() {
      var doc = frame.contentDocument ||
          frame.contentWindow.document || frame.document;
      var result = doc.getElementsByTagName('title')[0].innerHTML;
      this.log('Result: ' + result)
      testArea.removeChild(navElement);
      if (result == 'Success') {
        return runner.succeed();
      }
      throw Error(result);
    }.bind(this);
  } catch (e) {
    return runner.fail(e);
  }
};

/**
 * Ensure super long image src URL is properly supported.
 */
var testImageSrcURLLength = createFunctionalTest(
    '14.4.2.1', 'ImageSrcURLLength', 'URL Length');
testImageSrcURLLength.prototype.title = 'Test Image Src URL Length support.';
testImageSrcURLLength.prototype.start = function(runner) {
  try {
    var imgElement = createElement('img');
    var url = expandUrl(TEST_MEDIA_SRC.Jpg + '?q=', 'a');
    imgElement.setAttribute('src', url);
    testArea.appendChild(imgElement);
    imgElement.onload = function() {
      testArea.removeChild(imgElement);
      imgElement = null;
      return runner.succeed();
    }.bind(this);
  } catch (e) {
    return runner.fail(e);
  }
};

/**
 * Ensure super long video src URL is properly supported.
 */
var createVideoSrcURLTest = function(testId, format, src) {
  var test = createFunctionalTest(
      testId, 'VideoSrcURLLength - ' + format, 'URL Length');
  test.prototype.title = 'Test ' + format + ' Video Src URL Length support.';
  test.prototype.start = function(runner, video) {
    try {
      var randChar =
          'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
              .charAt(Math.floor(Math.random() * 62));
      var longUrl = expandUrl(src + '?q=', randChar);
      video.setAttribute('src', longUrl);
      video.onplaying = function onPlaying() {
        video.removeEventListener('onplaying', onPlaying);
        return runner.succeed();
      }.bind(this);
      video.onerror = function() {
        var message = String().concat(this.name + ' - value returned: ', false);
        throw Error(message);
      }.bind(this);
      video.play();
    } catch (e) {
      return runner.fail(e);
    }
  }
};

createVideoSrcURLTest('14.4.3.1', 'mp4', TEST_MEDIA_SRC.SslTestVideoMp4);


/**
 * Ensure super long XHR request URL is properly supported.
 */
var testXHRURLLength =
    createFunctionalTest('14.4.4.1', 'XHRURLLength', 'URL Length');
testXHRURLLength.prototype.title = 'Test XHR Src URL Length support.';
testXHRURLLength.prototype.start = function(runner) {
  try {
    var xmlHttp = new XMLHttpRequest();
    var url = expandUrl(TEST_MEDIA_SRC.Png + '?q=', 'a');
    xmlHttp.open('GET', url, true);
    xmlHttp.send(null);
    xmlHttp.onreadystatechange = function() {
      if (xmlHttp.readyState == 4) {
        if (xmlHttp.status == 200) {
          return runner.succeed();
        } else {
          runner.fail(Error('Xhr request status is not 200 OK'));
        }
      }
    };
  } catch (e) {
    return runner.fail(e);
  }
};

/**
 * Validate the existence of CORS through Modernizr.
 */
var testCORS = createFunctionalTest('14.5.1.1', 'CORS', 'Security');
testCORS.prototype.title = 'Test if CORS works.';
testCORS.prototype.start = function(runner) {
  try {
    if (window.Modernizr.cors) {
      return runner.succeed();
    }
    throw Error('CORS is not supported.');
  } catch (e) {
    return runner.fail(e);
  }
};

/**
 * Validate the existence of localStorage properties.
 */
var createLocalStorageTest = function(testId, value, evaluate, cleanup) {
  var name = value ? 'localStorage.' + value : 'localStorage';
  var test = createFunctionalTest(testId, name, 'localStorage');
  test.prototype.title = 'Test if ' + name + ' works.';
  test.prototype.start = function(runner) {
    try {
      if (evaluate()) {
        return runner.succeed();
      }
      throw name + ' errors';
    } catch (e) {
      if (cleanup) {
        cleanup();
      }
      return runner.fail(e);

    }
  }
};

createLocalStorageTest('14.6.1.1', null, function() {
  return Modernizr.localstorage;
});
createLocalStorageTest('14.6.2.1', 'setItem', function() {
  return Modernizr.prefixed('setItem', window.localStorage , false) != false;
});
createLocalStorageTest('14.6.3.1', 'getItem', function() {
  return Modernizr.prefixed('getItem', window.localStorage , false) != false;
});
createLocalStorageTest('14.6.4.1', 'removeItem', function() {
  return Modernizr.prefixed('removeItem', window.localStorage , false) != false;
});
createLocalStorageTest(
    '14.6.5.1',
    '1M Char Quota',
    function() {
      var testData = new Array(1000 * 1000).join('2');
      localStorage.setItem('yt-quale', testData);
      localStorage.removeItem('yt-quale');
      return true;
    },
    function() {
      localStorage.removeItem('yt-quale');
    });

/**
 * Test if HTTPS onload fires.
 */
var testHTTPS = createFunctionalTest('14.7.1.1', 'HTTPS', 'HTTP');
testHTTPS.prototype.title = 'Test if HTTPS onload fires.';
testHTTPS.prototype.start = function(runner) {
  try {
      var sslImg = createElement('img');
      sslImg.setAttribute(
          'src', 'https://www.google.com/images/srpr/logo3w.png');
      testArea.appendChild(sslImg);
      sslImg.onload  = function() {
        testArea.removeChild(sslImg);
        sslImg = null;
        return runner.succeed();
      }.bind(this);
  } catch (e) {
    return runner.fail(e);

  }
};

/**
 * Test if XMLHTTPRequest works.
 */
var testXMLHTTPRequest =
    createFunctionalTest('14.7.2.1', 'XMLHTTPRequest', 'HTTP');
testXMLHTTPRequest.prototype.title = 'Test if XMLHTTPRequest works.';
testXMLHTTPRequest.prototype.start = function(runner) {
  try {
    if (new XMLHttpRequest()) {
      return runner.succeed();
    }
  } catch (e) {
    return runner.fail(e);
  }
};

/**
 * Test if XMLHTTPRequest Level 2 works.
 */
var testXMLHTTPRequestLevel2 =
    createFunctionalTest('14.7.3.1', 'XMLHTTPRequest Level 2', 'HTTP');
testXMLHTTPRequestLevel2.prototype.title =
    'Test if XMLHTTPRequest Level 2 works.';
testXMLHTTPRequestLevel2.prototype.start = function(runner) {
  try {
    // test from https://github.com/NielsLeenheer/html5test/pull/100
    if (window.XMLHttpRequest && ('upload' in new XMLHttpRequest())) {
      return runner.succeed();
    }
    throw Error('Does not support XMLHTTPRequest Level 2');
  } catch (e) {
    return runner.fail(e);
  }
};

/**
 * Validate Fetch API properties work as expect.
 */
var createFetchAPITest = function(testId, value, evaluate) {
  var name = 'Fetch API - ' + value;
  var test = createFunctionalTest(testId, name, 'Fetch API');
  test.prototype.title = 'Test if ' + value + ' in Fetch API works.';
  test.prototype.start = function(runner) {
    try {
      if (evaluate()) {
        return runner.succeed();
      }
      throw Error(name + ' errors');
    } catch (e) {
      return runner.fail(e);
    }
  }
};

createFetchAPITest('14.8.1.1', 'fetch()', function() {
  return !!(window.fetch);
});
createFetchAPITest('14.8.2.1', 'Headers', function() {
  var httpHeaders = {
    'Content-Type' : 'image/jpeg',
    'Accept-Charset' : 'utf-8'
  };
  var testHeaders = new Headers(httpHeaders);
  return testHeaders.get('Content-Type') == "image/jpeg";
});

/**
 * Validate Fetch API Request work as expect.
 */
var testFetchAPIRequest =
    createFunctionalTest('14.8.3.1', 'Fetch API - Request', 'Fetch API');
testFetchAPIRequest.prototype.title = 'Test if Fetch API Request works.';
testFetchAPIRequest.prototype.start = function(runner) {
  try {
    var fetchRequest = new Request(
        'https://qual-e.appspot.com/test',
        {method: 'POST', body: '{"result":"pass"}'});
    // This shouldn't work, as method is read-only
    fetchRequest.method = 'GET';
  } catch (e) {
    if (fetchRequest.url == 'https://qual-e.appspot.com/test' &&
        fetchRequest.method == 'POST' && fetchRequest.credentials != 'include')
      return runner.succeed();
  }
  return runner.fail('Fetch API Request should be read-only.')
};

/**
 * Validate Fetch API Response work as expect.
 */
var testFetchAPIResponse =
    createFunctionalTest('14.8.4.1', 'Fetch API - Response', 'Fetch API');
testFetchAPIResponse.prototype.title = 'Test if Fetch API Response works.';
testFetchAPIResponse.prototype.start = function(runner) {
  try {
    var init = {'status': 200, 'statusText': 'YouTube'};
    var myResponse = new Response('test_body', init);
    myResponse.statusText = 'Should not work since it is read-only';
  } catch (e) {
    if (myResponse.statusText == 'YouTube' && myResponse.ok) {
      return runner.succeed();
    }
  }
  return runner.fail('Fetch API does not work as expected');
};

/**
 * Test fetch API's streaming feature.
 */
var testFetchStreamAPIRequest =
    createFunctionalTest('14.8.5.1', 'Fetch API - stream', 'Fetch API');
testFetchStreamAPIRequest.prototype.title =
    'Test if Fetch API handles steaming. ';
testFetchStreamAPIRequest.prototype.start = function(runner){
  try {
    const FETCH_TIME_OUT = 3000;
    const timeout = setTimeout(function(){
      throw Error('Fetch took too long');
    }, FETCH_TIME_OUT);
    fetch('lib/functional/fetch-sample.txt').then(function(response) {
      var reader = response.body.getReader();
      var partialCell = '';
      var returnNextCell = false;
      var returnCellAfter = "YouTube";
      function search() {
        return reader.read().then(function(result) {
          var chunk = result.value;
          for (var i = 3; i < chunk.byteLength; i++) {
            partialCell += String.fromCharCode(chunk[i]);
          }
          var cellBoundry = /(?:,|\r\n)/;
          var completeCells = partialCell.split(cellBoundry);
          if (!result.done) {
            // last cell may not be complete
            partialCell = completeCells[completeCells.length - 1];
            completeCells = completeCells.slice(0, -1);
          }
          for (var cell of completeCells) {
            cell = cell.trim();
            if (returnNextCell) {
              reader.cancel("No more reading needed.");
              return cell;
            }
            if (cell === returnCellAfter) {
              returnNextCell = true;
            }
          }
          if (result.done) {
            throw Error("Could not find value after " + returnCellAfter);
          }
          return search();
        });
      }
      return search();
    }).then(function(){
      clearTimeout(timeout);
      return runner.succeed();
    });
  } catch (e) {
    return runner.fail(e);
  }
};

/**
 * Validate Streams API - ReadableByteStream.
 */
var testStreamsAPI = createFunctionalTest(
    '14.9.1.1', 'Streams API - ReadableByteStream', 'Assorted');
testStreamsAPI.prototype.title = 'Test Streams API - ReadableByteStream.';
testStreamsAPI.prototype.start = function(runner) {
  try {
    var init = {'status': 200, 'statusText' : 'YouTube'};
    var myResponse = new Response('test_body', init);
    if (!!window.ReadableStream && myResponse.ok) {
      return runner.succeed();
    }
    throw Error('Response not ok');
  } catch (e) {
    return runner.fail(e);
  }
};

/**
 * Validate browser supports strict mode in ECMA262-5.
 */
var testECMA262 =
    createFunctionalTest('14.9.2.1', 'ECMA262-5 Strict Mode', 'Assorted');
testECMA262.prototype.title = 'Test browser supports strict mode in ECMA262-5.';
testECMA262.prototype.start = function(runner) {
  try {
    'use strict';
    var a = 1;
    return runner.succeed();
  } catch (e) {
    return runner.fail(e)
  }
};

/**
 * Validate the existence of window.requestAnimationFrame through Modernizr.
 */
var testAnimationFrame =
    createFunctionalTest('14.9.3.1', 'RequestAnimationFrame', 'Assorted');
testAnimationFrame.prototype.title = 'Test request Animation Frame.';
testAnimationFrame.prototype.start = function(runner) {
  try {
    if (Modernizr.prefixed('requestAnimationFrame', window, false)) {
      return runner.succeed();
    }
    throw Error('window.requestAnimationFrame does not exist');
  } catch (e) {
    return runner.fail(e)
  }
};

/**
 * Test if js date object is correctly supported.
 */
var testJSDateObject =
    createFunctionalTest('14.9.4.1', 'JavaScript Date Object', 'Assorted');
testJSDateObject.prototype.title = 'Test if js date object is supported.';
testJSDateObject.prototype.start = function(runner) {
  try {
    var dateObj = new Date(Date.parse('2012-11-01T14:12:09.000Z'));
    var dateObjFormatted = dateObj.getUTCDate() + '/' +
        (dateObj.getUTCMonth() + 1) + '/' +
        dateObj.getUTCFullYear().toString().substr(2,2);
    if (dateObjFormatted == '1/11/12' || dateObjFormatted == '2012/11/2') {
      return runner.succeed();
    }
    throw Error('date object is not supported correctly');
  } catch (e) {
    return runner.fail(e)
  }
};

/**
 * Validate support for specified image format.
 */
var createImgTest = function(testId, suffix) {
  var test = createFunctionalTest(testId, suffix.toUpperCase(), 'Assorted');
  test.prototype.title = 'Test image format ' + suffix;
  test.prototype.start = function(runner) {
    try {
      var imgElement = createElement('img');
      var url = TEST_MEDIA_SRC[suffix];
      imgElement.setAttribute('src', url);
      testArea.appendChild(imgElement);
      imgElement.onload = function() {
        testArea.removeChild(imgElement);
        imgElement = null;
        return runner.succeed();
      }.bind(this);
    } catch (e) {
        return runner.fail(e);
    }
  }
};

createImgTest('14.9.5.1', 'Jpg');
createImgTest('14.9.6.1', 'Png');

/**
 * Validate the window height and width are in right size.
 */
var testWindowSize =
    createFunctionalTest('14.9.7.1', 'Window Size', 'Assorted');
testWindowSize.prototype.title = 'Test window size in current browser.';
testWindowSize.prototype.start = function(runner) {
  try {
    var result = false;
    switch (window.innerHeight) {
      case 720:
        if(window.innerWidth == 1280)
          result = true;
        break;
      case 1080:
        if(window.innerWidth == 1920)
          result = true;
        break;
      case 1440:
        if(window.innerWidth == 2560)
          result = true;
        break;
      case 2160:
        if(window.innerWidth == 3840)
          result = true;
        break;
    }
    if (!result) {
      throw 'Failed test with window size in ' +
      window.innerWidth + ' x ' + window.innerHeight;
    }
    return runner.succeed();
  } catch (e) {
    return runner.fail(e);
  }
};

/**
 * Validate existence of WebP properties.
 */
var createWebPTest = function(testId, name, uri) {
  var test = createFunctionalTest(testId, name, 'WebP');
  test.prototype.title = 'Test ' + name + ' support.';
  test.prototype.start = function(runner) {
    var img = new Image();

    img.addEventListener('load', function() {
      return runner.succeed();
    }, false);
    img.addEventListener('error', function(event) {
      return runner.fail('Request to website with valid SSL certificate fails.');
    }, false);

    img.src = uri;
  };
};

var webpTests = [{
  'uri': 'data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA=',
  'name': 'WebP'
}, {
  'uri': 'data:image/webp;base64,UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAABBxAR/Q9ERP8DAABWUDggGAAAADABAJ0BKgEAAQADADQlpAADcAD++/1QAA==',
  'name': 'WebP Alpha'
}, {
  'uri': 'data:image/webp;base64,UklGRlIAAABXRUJQVlA4WAoAAAASAAAAAAAAAAAAQU5JTQYAAAD/////AABBTk1GJgAAAAAAAAAAAAAAAAAAAGQAAABWUDhMDQAAAC8AAAAQBxAREYiI/gcA',
  'name': 'WebP Animation'
}, {
  'uri': 'data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA=',
  'name': 'WebP Lossless'
}];

for (var i = 0; i < webpTests.length; i++) {
  createWebPTest(`14.10.${i + 1}.1`, webpTests[i].name, webpTests[i].uri);
}

/**
 * Test WebSpeech API through Modernizr.
 */
var testWebSpeechAPI = createFunctionalTest(
    '14.12.1.1', 'WebSpeech API', 'Assorted', harnessConfig.support_webspeech);
testWebSpeechAPI.prototype.title = 'Test WebSpeech API.';
testWebSpeechAPI.prototype.start = function(runner) {
  try {
    if (Modernizr.speechrecognition || Modernizr.mediarecorder) {
      return runner.succeed();
    }
    throw 'Neither speechrecognition nor mediarecorder supported.';
  } catch (e) {
    return runner.fail(e);
  }
};

/**
 * Ensure video/x-flv is unsupported.
 */
var testNoVideoXFlv = createFunctionalTest(
    '14.12.2.1', 'video/x-flv is unsupported', 'Assorted');
testNoVideoXFlv.prototype.title = 'Make sure video/x-flv is unsupported.';
testNoVideoXFlv.prototype.start = function(runner) {
  try {
    if (!Modernizr.video.flv) {
      return runner.succeed();
    }
    throw 'video/x-flv is still supported.'
  } catch (e) {
    return runner.fail(e);
  }
};

/**
 * Validate MediaSource properties through Modernizr.
 */
var createMediaSourceTest = function(testId, arg) {
  var test = createFunctionalTest(testId, 'MediaSource.' + arg, 'MediaSource');
  test.prototype.title = 'Test if MediaSource.' + arg + ' is supported.';
  test.prototype.start = function(runner, video) {
    try {
      var media = new MediaSource();
      window.attachMediaSource(video, media);
      if (Modernizr.prefixed(arg, media, false) != false) {
        return runner.succeed();
      }
      throw 'MediaSource.' + arg + ' support failed.';
    } catch (e) {
      return runner.fail(e);
    }
  };
}

createMediaSourceTest('14.13.1.1', 'addSourceBuffer');
createMediaSourceTest('14.13.2.1', 'sourceBuffers');
createMediaSourceTest('14.13.3.1', 'activeSourceBuffers');
createMediaSourceTest('14.13.4.1', 'duration');
createMediaSourceTest('14.13.5.1', 'removeSourceBuffer');
createMediaSourceTest('14.13.6.1', 'readyState');
createMediaSourceTest('14.13.7.1', 'endOfStream');

/**
 * Test if specified type is supported through MediaSource.isTypeSupported.
 */
var createSupportTest = function(testId, name, evaluate, mandatory) {
  var logResult = function(format, result) {
    this.runner.log('[' + this.desc + '] - isTypeSupported("' + format +
        '") returned: ' + result);
  };

  var test = createFunctionalTest(testId, name, 'Support', mandatory);
  test.prototype.title = 'Test ' + name;
  test.prototype.start = function(runner) {
    try {
      if (evaluate(logResult.bind(this))) {
        return runner.succeed();
      }
      throw name + ' failed.';
    } catch (e) {
      return runner.fail(e);
    }
  }
};


createSupportTest(
    '14.14.1.1', 'isTypeSupported cryptoblockformat', function(logResult) {
  var invalidCryptoBlockFormatType = util.createVideoFormatStr(
      'webm', 'vp9', 1280, 720, 23.976, null, 'cryptoblockformat=invalid');
  var invalidCryptoBlockFormatSupported =
      MediaSource.isTypeSupported(invalidCryptoBlockFormatType);
  logResult(
      invalidCryptoBlockFormatType, invalidCryptoBlockFormatSupported);

  var validCryptoBlockFormatType = util.createVideoFormatStr(
      'webm', 'vp9', 1280, 720, 23.976, null, 'cryptoblockformat=subsample');
  var validCryptoBlockFormatSupported =
      MediaSource.isTypeSupported(validCryptoBlockFormatType);
  logResult(validCryptoBlockFormatType, validCryptoBlockFormatSupported);

  if (!invalidCryptoBlockFormatSupported && validCryptoBlockFormatSupported) {
    return true;
  }
});


var isTypeSupportedTest = function(logResult) {
  var baselineVideoType = util.createVideoFormatStr(
      'mp4', 'avc1.4d401e', 640, 360, 30, null, 'bitrate=300000');
  var baselineVideoSupported =
      MediaSource.isTypeSupported(baselineVideoType);
  logResult(baselineVideoType, baselineVideoSupported);

  var baselineAudioType =
      util.createAudioFormatStr('mp4', 'mp4a.40.2', 'channels=2');
  var baselineAudioSupported = MediaSource.isTypeSupported(baselineAudioType);
  logResult(baselineAudioType, baselineAudioSupported);

  var invalidVideoHeightType = util.createVideoFormatStr(
      'mp4', 'avc1.4d401e', 640, 10360);
  var invalidVideoHeightSupported =
      MediaSource.isTypeSupported(invalidVideoHeightType);
  logResult(invalidVideoHeightType, invalidVideoHeightSupported);

  var invalidAudioChannelsType = util.createAudioFormatStr(
      'mp4', 'mp4a.40.2', 'channels=100');
  var invalidAudioChannelsSupported =
      MediaSource.isTypeSupported(invalidAudioChannelsType);
  logResult(invalidAudioChannelsType, invalidAudioChannelsSupported);

  if (baselineVideoSupported && baselineAudioSupported &&
      !invalidVideoHeightSupported && !invalidAudioChannelsSupported) {
    return true;
  }
};

createSupportTest(
    '14.14.2.1', 'isTypeSupported Extensions', isTypeSupportedTest);

createSupportTest(
    '14.14.3.1',
    'H.264 60fps Support',
    function(logResult) {
      if (!(isTypeSupportedTest(logResult))) return false;

      var maxWidth = util.getMaxH264SupportedWindow()[0];
      var maxHeight = util.getMaxH264SupportedWindow()[1];

      var invalidH264Type = util.createVideoFormatStr(
          'mp4', 'avc1.4d401e', 640, 360, 9999);
      var invalidH264Supported = MediaSource.isTypeSupported(invalidH264Type);
      logResult(invalidH264Type, invalidH264Supported);

      var baselineH264Type = util.createVideoFormatStr(
          'mp4', 'avc1.4d401e', 640, 360, 60)
      var baselineH264Supported = MediaSource.isTypeSupported(baselineH264Type);
      logResult(baselineH264Type, baselineH264Supported);

      var maxResolutionH264Type = util.createVideoFormatStr(
          'mp4', 'avc1.4d401e', maxWidth, maxHeight, 60);
      var maxResolutionH264Supported =
          MediaSource.isTypeSupported(maxResolutionH264Type);
      logResult(maxResolutionH264Type, maxResolutionH264Supported);

      if (baselineH264Supported && maxResolutionH264Supported &&
          !invalidH264Supported) {
        return true;
      }
    });

createSupportTest(
    '14.14.4.1',
    'VP9 60fps Support',
    function(logResult) {
      if (!(isTypeSupportedTest(logResult))) return false;

      var maxWidth = util.getMaxVp9SupportedWindow()[0];
      var maxHeight = util.getMaxVp9SupportedWindow()[1];

      var invalidVp9Type =
          util.createVideoFormatStr('webm', 'vp9', 640, 360, 9999);
      var invalidVp9Supported = MediaSource.isTypeSupported(invalidVp9Type);
      logResult(invalidVp9Type, invalidVp9Supported);

      var baselineVp9Type =
          util.createVideoFormatStr('webm', 'vp9', 640, 360, 60);
      var baselineVp9Supported = MediaSource.isTypeSupported(baselineVp9Type);
      logResult(baselineVp9Type, baselineVp9Supported);

      var maxVp9Type =
          util.createVideoFormatStr('webm', 'vp9', maxWidth, maxHeight, 60);
      var maxVp9Supported = MediaSource.isTypeSupported(maxVp9Type);
      logResult(maxVp9Type, maxVp9Supported);

      if (baselineVp9Supported && maxVp9Supported && !invalidVp9Supported) {
        return true;
      }
    });

createSupportTest(
    '14.14.5.1',
    'H.264 120fps Support',
    function(logResult) {
      if (!(isTypeSupportedTest(logResult))) return false;

      var maxWidth = util.getMaxH264SupportedWindow()[0];
      var maxHeight = util.getMaxH264SupportedWindow()[1];

      var invalidH264Type = util.createVideoFormatStr(
          'mp4', 'avc1.4d401e', 640, 360, 9999);
      var invalidH264Supported = MediaSource.isTypeSupported(invalidH264Type);
      logResult(invalidH264Type, invalidH264Supported);

      var baselineH264Type = util.createVideoFormatStr(
          'mp4', 'avc1.4d401e', 640, 360, 120);
      var baselineH264Supported = MediaSource.isTypeSupported(baselineH264Type);
      logResult(baselineH264Type, baselineH264Supported);

      var maxResolutionH264Type = util.createVideoFormatStr(
          'mp4', 'avc1.4d401e', maxWidth, maxHeight, 120);;
      var maxResolutionH264Supported =
          MediaSource.isTypeSupported(maxResolutionH264Type);
      logResult(maxResolutionH264Type, maxResolutionH264Supported);

      if (baselineH264Supported && maxResolutionH264Supported &&
          !invalidH264Supported) {
        return true;
      }
    },
    false);

createSupportTest(
    '14.14.6.1',
    'VP9 120fps Support',
    function(logResult) {
      if (!(isTypeSupportedTest(logResult))) return false;

      var maxWidth = util.getMaxVp9SupportedWindow()[0];
      var maxHeight = util.getMaxVp9SupportedWindow()[1];

      var invalidVp9Type =
          util.createVideoFormatStr('webm', 'vp9', 640, 360, 9999);
      var invalidVp9Supported = MediaSource.isTypeSupported(invalidVp9Type);
      logResult(invalidVp9Type, invalidVp9Supported);

      var baselineVp9Type =
          util.createVideoFormatStr('webm', 'vp9', 640, 360, 120);
      var baselineVp9Supported = MediaSource.isTypeSupported(baselineVp9Type);
      logResult(baselineVp9Type, baselineVp9Supported);

      var maxVp9Type = util.createVideoFormatStr(
          'webm', 'vp9', maxWidth, maxHeight, 120);
      var maxVp9Supported = MediaSource.isTypeSupported(maxVp9Type);
      logResult(maxVp9Type, maxVp9Supported);

      if (baselineVp9Supported && maxVp9Supported && !invalidVp9Supported) {
        return true;
      }
    },
    false);

createSupportTest(
    '14.14.7.1',
    'isTypeSupported EOTF Support',
    function(logResult) {
      var smpte2084Type = util.createVideoFormatStr(
          'webm', 'vp9.2', 1280, 720, 30, null, 'eotf=smpte2084');
      var smpte2084Supported = MediaSource.isTypeSupported(smpte2084Type);
      logResult(smpte2084Type, smpte2084Supported);

      var bt709Type = util.createVideoFormatStr(
          'webm', 'vp9.2', 1280, 720, 30, null, 'eotf=bt709');
      var bt709Supported = MediaSource.isTypeSupported(bt709Type);
      logResult(bt709Type, bt709Supported);

      var hlgType = util.createVideoFormatStr(
          'webm', 'vp9.2', 1280, 720, 30, null, 'eotf=arib-std-b67');
      var hlgSupported = MediaSource.isTypeSupported(hlgType);
      logResult(hlgType, hlgSupported);

      var invalidEOTFType = util.createVideoFormatStr(
          'webm', 'vp9.2', 1280, 720, 30, null, 'eotf=strobevision');
      var invalidEOTFSupported = MediaSource.isTypeSupported(invalidEOTFType);
      logResult(invalidEOTFType, invalidEOTFSupported);

      if (smpte2084Supported && bt709Supported &&
          hlgSupported && !invalidEOTFSupported) {
        return true;
      }
    },
    harnessConfig.support_hdr);

createSupportTest(
    '14.14.8.1',
    'SMPTE2084 Support',
    function(logResult) {
      var smpte2084Type =
          util.createSimpleVideoFormatStr('webm', 'vp9.2', 'eotf=smpte2084');
      var smpte2084Supported = MediaSource.isTypeSupported(smpte2084Type);
      logResult(smpte2084Type, smpte2084Supported);

      if (smpte2084Supported) {
        return true;
      }
    },
    harnessConfig.support_hdr);

createSupportTest(
    '14.14.9.1',
    'ARIB STD-B67 Support',
    function(logResult) {
      var hlgType =
          util.createSimpleVideoFormatStr('webm', 'vp9.2', 'eotf=arib-std-b67');
      var hlgSupported = MediaSource.isTypeSupported(hlgType);
      logResult(hlgType, hlgSupported);

      if (hlgSupported) {
        return true;
      }
    },
    harnessConfig.support_hdr);

createSupportTest(
    '14.14.10.1',
    'ITU-R BT.709 Support',
    function(logResult) {
      var bt709Type =
          util.createSimpleVideoFormatStr('webm', 'vp9.2', 'eotf=bt709');
      var bt709Supported = MediaSource.isTypeSupported(bt709Type);
      logResult(bt709Type, bt709Supported);

      if (bt709Supported) {
        return true;
      }
    },
    harnessConfig.support_hdr);

createSupportTest(
    '14.14.11.1',
    'Spherical(decode-to-texture) Support',
    function(logResult) {
      if (!(isTypeSupportedTest(logResult))) return false;

      var invalidSphericalType = util.createSimpleVideoFormatStr(
          'webm', 'vp9', 'decode-to-texture=nope');
      var invalidSphericalSupported =
          MediaSource.isTypeSupported(invalidSphericalType);
      logResult(invalidSphericalType, invalidSphericalSupported);

      var validSphericalTrueType = util.createSimpleVideoFormatStr(
          'webm', 'vp9', 'decode-to-texture=true');
      var validSphericalTrueSupported =
          MediaSource.isTypeSupported(validSphericalTrueType);
      logResult(validSphericalTrueType, validSphericalTrueSupported);

      var validSphericalFalseType = util.createSimpleVideoFormatStr(
          'webm', 'vp9', 'decode-to-texture=false');
      var validSphericalFalseSupported =
          MediaSource.isTypeSupported(validSphericalFalseType);
      logResult(validSphericalFalseType, validSphericalFalseSupported);

      if (validSphericalTrueSupported && validSphericalFalseSupported &&
          !invalidSphericalSupported) {
        return true;
      }
    },
    util.isCobalt());

/**
 * Test if specified type is supported through videoElement.isTypeSupported.
 */
var createEMETest = function(testId, name, evaluate, mandatory) {
  var test = createFunctionalTest(testId, name, 'EME Basic', mandatory);
  test.prototype.title = 'Test ' + name;
  test.prototype.start = function(runner, video) {
    try {
      if (evaluate(video)) {
        return runner.succeed();
      }
      throw name + ' failed.';
    } catch (e) {
      return runner.fail(e);
    }
  }
};

createEMETest(
    '14.15.1.1',
    'canPlayType.keySystem',
    function(videoElement) {
      return videoElement.canPlayType(
          util.createVideoFormatStr('mp4', 'avc1.42E01E'),
          'org.w3.clearkey') != undefined ||
              videoElement.canPlayType(
                  util.createVideoFormatStr('webm', 'vp9'),
                  'org.w3.clearkey') != undefined;
    });


var widevineTest = function(videoElement) {
  return videoElement.canPlayType(
      util.createVideoFormatStr('mp4', 'avc1.42E01E'),
      'com.widevine.alpha') != undefined ||
          videoElement.canPlayType(
              util.createVideoFormatStr('webm', 'vp9'),
              'com.widevine.alpha') != undefined;
};

createEMETest('14.15.2.1', 'Widevine', widevineTest);


var playreadyTest = function(videoElement) {
  return videoElement.canPlayType(
      util.createVideoFormatStr('mp4', 'avc1.42E01E'),
      'com.youtube.playready') != undefined;
};

createEMETest('14.15.3.1', 'PlayReady', playreadyTest, false);

createEMETest('14.15.4.1', 'DRM', function(videoElement) {
  return widevineTest || playreadyTest;
});

createEMETest(
    '14.15.5.1',
    'Video.generateKeyRequest',
    function(videoElement) {
      return Modernizr.prefixed(
          'generateKeyRequest', videoElement, false) != false;
    },
    false);

/**
 * Creates a MediaDevices test that validates whether the device has
 * Audio input media device and it implements correctly.
 */
var createMediaDevicesTest = function(testId) {
  var name = 'EnumerateDevices';
  var test =
      createFunctionalTest(testId, name, name, harnessConfig.support_webspeech);
  test.prototype.title = 'Test if ' + name + ' exists';
  test.prototype.start = function(runner) {
    try {
      if (undefined == navigator.mediaDevices.enumerateDevices) {
        throw Error('enumerateDevices does not exists!');
      }
      navigator.mediaDevices.enumerateDevices().then(function(listOfDevices) {
        for (var device of listOfDevices) {
          if (undefined == device.kind) {
            throw Error('kind does not exists!');
          }
          if (undefined == device.label) {
            throw Error('label does not exists!');
          }
          if (device.kind == "audioinput") {
            return runner.succeed();
          }
        }
        throw Error('No audioinput found!');
      });
    } catch (e) {
      return runner.fail(e);
    }
  };
};

createMediaDevicesTest('14.16.1.1');

/**
 * Create a UAString test that validates the format of current User Agent.
 */
var user_agent_2020 = new RegExp(
    [
      '([-.A-Za-z0-9\\\\\\/]+)_([-.A-Za-z0-9\\\\\\/]*)_([a-zA-Z0-9\\-]*)',
      '_2020 ?\\/ ?[-_.A-Za-z0-9\\\\]* \\(([a-zA-Z0-9\\-\\_]+), ',
      '?([a-zA-Z0-9\\-\\_]*), ?([WIREDLSwiredls\\\\\\/]*)\\)'
    ].join(''));

var createUAStringTest = function(testId) {
  var name = 'User Agent';
  var test = createFunctionalTest(testId, name, name);
  test.prototype.title = 'Test if ' + name + ' format is correct';
  test.prototype.start = function(runner) {
    try{
      var useragentParsed = user_agent_2020.exec(navigator.userAgent);
      if (useragentParsed &&
          useragentParsed[2].match(/^(BDP|GAME|OTT|STB|TV|ATV)$/)) {
        return runner.succeed();
      }
      throw Error('invalid User agent format');
    } catch (e) {
      return runner.fail(e);
    }
  };
};

createUAStringTest('14.17.1.2');

/**
 * Create a UAString test that validates version of certain items in user agent.
 */
var createCobaltVersionTest = function(testId, regexp, version, name) {
  var title = 'User Agent';
  var test = createFunctionalTest(testId, name + ' ' + title, title);
  test.prototype.title = 'Test if ' + name + title + ' format is correct';
  test.prototype.start = function(runner) {
    try {
      var useragentParsed = regexp.exec(navigator.userAgent);
      if (name === 'Cobalt') {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', COBALT_REQ_URL);
        xhr.send();
        xhr.onreadystatechange = function() {
          if (xhr.readyState === 4) {
            if (xhr.status === 200) {
              try {
                var buildVersion = Number(window.atob(xhr.responseText));
              } catch (e) {
                runner.fail(e);
              }
              if (useragentParsed &&
                  Number(useragentParsed[1].split('.')[1]) === buildVersion) {
                return runner.succeed();
              }
              runner.fail(Error(name + ' version is not ' + buildVersion));
            } else {
              runner.fail(Error('Failed to request Cobalt build version'));
            }
          }
        };
      } else {
        if (useragentParsed && Number(useragentParsed[1]) >= version) {
          return runner.succeed();
        }
        throw Error(name + ' version is less than ' + version);
      }
    } catch (e) {
      return runner.fail(e);
    }
  };
};

createCobaltVersionTest(
    '14.17.2.1', new RegExp(/20\.lts\.([0-9]\.[0-9]{6})/), 0, 'Cobalt');
createCobaltVersionTest(
    '14.17.3.2', new RegExp(/Starboard\/([0-9]+)/), 11, 'Starboard')

var widevine_ua = /([-.A-Za-z0-9\\\/]*)_([-.A-Za-z0-9\\\/]*)_([-.A-Za-z0-9\\\/]*) ?\/ ?[-_.A-Za-z0-9\\]* \(([-_.A-Za-z0-9\\\/ ]+), ?([^,]*), ?([WIREDLSwiredls\\\/]*)\)/;

/**
 * Ensure information in Widevine License match User Agent and the OEMCrypto
 * api version is at least 15.
 */
var testWidevine = createFunctionalTest('14.17.4.1', 'Widevine License', 'User Agent');
testWidevine.prototype.title = 'Test if widevine versions.'
testWidevine.prototype.start = function(runner) {

  function clearPlayer() {
    if((typeof player !== 'undefined') && (player !== null)){
      player.unload();
      player.destroy();
    }
  };

  try {
    var manifestUri =
    'test-materials/media/manual/wv_license_request.mpd';
    var licenseServer = 'https://cwip-shaka-proxy.appspot.com/no_auth';
    var userAgentParsed = widevine_ua.exec(navigator.userAgent);
    if (!userAgentParsed) {
      throw Error('Error! User agent is not in correct format');
    }
    var ua_brand = userAgentParsed[4];
    var ua_model = userAgentParsed[5];

    var sessionID;
    const initSession = () => {
      /**
       * Generates a GUID string, according to RFC4122 standards.
       * @returns {String} The generated GUID.
       * @example af8a84166e18a307bd9cf2c947bbb3aa
       * @author Slavik Meltser (slavik@meltser.info).
       * @link http://slavik.meltser.info/?p=142
       */
      function _p8(s) {
        var p = (Math.random().toString(16) + '000000000').substr(2, 8);
        return s ? p.substr(0, 4) + p.substr(4, 4) : p;
      }
      sessionID = window.location.href.split('testid=')[1] ||
          _p8() + _p8(true) + _p8(true) + _p8();
      runner.log('Session ID: ' + sessionID);
    };

    const initPlayer = () => {
      // Create a Player instance.
      var videoElement = createElement('video');
      try {
        videoElement.textTracks = [];
      } catch (e) {
        let textTracks = videoElement.textTracks;
        textTracks = [];
      }
      videoElement.addTextTrack = function() {
        return {
          addCue: function() {}
        }
      };
      var player = new shaka.Player(videoElement);

      // Attach player to the window to make it easy to access in the JS console.
      window.player = player;

      // Listen for error events.
      player.addEventListener('error', function(event) {
        throw Error('shaka error ' + event.detail);
      });

      // Try to load a manifest.
      // This is an asynchronous process.

      player.configure({drm: {servers: {'com.widevine.alpha': licenseServer}}});
      player.getNetworkingEngine().registerRequestFilter(function(
          type, request) {
        // Only manipulate license requests:
        if (type == shaka.net.NetworkingEngine.RequestType.LICENSE) {
          // This is the raw license request generated by the Widevine CDM.
          var rawLicenseRequest = new Uint8Array(request.body);
          // Encode the raw license request in base64.

          var rawLicenseRequestBase64 =
              base64js.fromByteArray(rawLicenseRequest);
          runner.log('license request: ' + rawLicenseRequestBase64);

          var xhr = new XMLHttpRequest();
          var url = 'https://proxy.uat.widevine.com/proxy?get_client_id=true';
          xhr.open('POST', url, true);
          xhr.send(rawLicenseRequest);
          xhr.onreadystatechange = function() {
            try {
              if (xhr.readyState == 4) {
                if (xhr.status != 200) {
                  throw Error('failed, HTTP status ' + xhr.status);
                } else {
                  runner.log("xhr.responseText: " + xhr.responseText);
                  var parsedResponse = JSON.parse(xhr.responseText);
                  var license = {};
                  var client_info = parsedResponse.client_info;
                  if (client_info.length != 0) {
                    for (var i = 0; i < client_info.length; i++) {
                      var key = parsedResponse.client_info[i].name;
                      var value = parsedResponse.client_info[i].value;
                      license[key] = value;
                    }
                    runner.checkEq(
                        license["company_name"], ua_brand, "Company Name");
                    runner.checkEq(license["model_name"], ua_model, "Model Name");
                    runner.checkGE(
                        parsedResponse.client_capabilities.oem_crypto_api_version,
                        15, "OEMCrypto version");
                    runner.succeed();
                    clearPlayer();
                  }
                }
              }
            } catch (error) {
              throw Error('Player Error ' + error);
            }
          };
        }
      });
      player.load(manifestUri).then(function() {}).catch(function(error) {
        throw Error('Load error ' + error);
      });
    };


    initSession();
    // Install built-in polyfills to patch browser incompatibilities.
    shaka.polyfill.installAll();

    // Check to see if the browser supports the basic APIs Shaka needs.
    if (shaka.Player.isBrowserSupported()) {
      // Everything looks good!
      initPlayer();
    } else {
      // This browser does not have the minimum set of APIs we need.
      throw Error('Browser not supported!');
    }
  } catch (e) {
    return runner.fail(e);
    clearPlayer();
  }
};

/**
 * Create a CPU memory test that validates the size of system memory.
 */
var createMemoryTest = function(testId, processor, size) {
  var title = processor + ' System Memory';
  var test = createFunctionalTest(testId, title, 'Memory Allocation');
  test.prototype.title = 'Test if ' + title + ' is correct';
  test.prototype.start = function(runner) {
    try{
      if (typeof h5vcc != 'undefined' && typeof h5vcc.cVal != 'undefined') {
        var memFree = Number(h5vcc.cVal.getValue('Memory.' + processor +
            '.Free'));
        var memUsed = Number(h5vcc.cVal.getValue('Memory.' + processor +
            '.Used'));
        if (memFree + memUsed < size) {
          throw Error(processor + ' memory allocated less than ' + size);
        }
      } else {
        throw Error('Cobalt not found');
      }
      return runner.succeed();
    } catch (e) {
      return runner.fail(e);
    }
  };
};

createMemoryTest('14.18.1.1','CPU', 170 * 1024 * 1024);

/**
 * Create a memory test that validates the size of JavaScript allocation.
 */
var createMemoryAllocationTest = function(testId, size) {
  var title = 'JavaScript Memory Allocation';
  var test = createFunctionalTest(testId, title, 'Memory Allocation');
  test.prototype.title = 'Test if ' + title + ' is correct';
  test.prototype.start = function(runner) {
    try{
      var a = new ArrayBuffer(size * 1024 * 1024);
      return runner.succeed();
    } catch (e) {
      return runner.fail(e);
    }
  };
};

createMemoryAllocationTest('14.18.2.1', 80);

var GetMinVideoBufferSizeInMB = function() {
  if (util.is8k()) {
    return 300;
  } else if (util.is4k()) {
    return util.supportHdr() ? 80 : 50;
  } else {
    return 30;
  }
};

var GetVideoSrc = function() {
  if (util.is4k()) {
    return util.supportHdr() ?
        Media.VP9.Video2160pHdr1MB : Media.VP9.Video2160p1MB;
  } else {
    return Media.VP9.Video1080p1MB;
  }
}

/**
 * Test if device can hold a minimum size of video and audiosource buffer.
 */
var testSourceBufferSize = createFunctionalTest(
    '14.19.1.1', 'Source Buffer Size', 'Buffer', util.isGtFHD());
testSourceBufferSize.prototype.title = 'Determines video and audiobuffer sizes '
    'by appending incrementally until discard occurs or requirement is met.';
testSourceBufferSize.prototype.start = function(runner, video) {
    var ms = new MediaSource();
    // We start appending video clip repeatedly until we get eviction.
    var videoStream = GetVideoSrc();
    // The audio clip has just over 5MB, which is the requirement for audio
    // souce buffer.
    var audioStream = Media.AAC.AudioHuge;
    var videoSb;
    var audioSb;
    ms.addEventListener('sourceopen', function() {
      videoSb = ms.addSourceBuffer(videoStream.mimetype);
      audioSb = ms.addSourceBuffer(audioStream.mimetype);
    });
    video.src = window.URL.createObjectURL(ms);

    var minVideoBufferSizeMb = GetMinVideoBufferSizeInMB();
    var minVideoBufferSize = minVideoBufferSizeMb * 1024 * 1024;
    var videoEstimatedMinTime =
        minVideoBufferSize * videoStream.duration / videoStream.size * 0.9;

    var videoXhr =
        runner.XHRManager.createRequest(videoStream.src, function(e) {
      var appendCount = 0;
      var expectedTime = 0;
      var expectedSize = 0;

      var onUpdate = function() {
        appendCount++;
        runner.log('Append count ' + appendCount);
        if (videoSb.buffered.start(0) > 0 ||
            expectedTime > videoSb.buffered.end(0)) {
          onBufferFull();
        } else {
          expectedTime += videoStream.duration;
          expectedSize += videoStream.size;
          if (expectedSize > minVideoBufferSize) {
            runner.log('Source buffer exceeded minimum: ' + minVideoBufferSize);
            onBufferFull();
            return;
          }
          videoSb.timestampOffset = expectedTime;
          try {
            videoSb.appendBuffer(videoXhr.getResponseData());
          } catch (e) {
            runner.log(e);
            var QUOTA_EXCEEDED_ERROR_CODE = 22;
            if (e.code == QUOTA_EXCEEDED_ERROR_CODE) {
              onBufferFull();
            } else {
              runner.fail(e);
            }
          }
        }
      };
      var onBufferFull = function() {
        videoSb.removeEventListener('updateend', onUpdate);
        runner.checkGE(
            videoSb.buffered.end(0) - videoSb.buffered.start(0),
            videoEstimatedMinTime,
            'Time range in source buffer');
        runner.succeed();
      };
      videoSb.addEventListener('updateend', onUpdate);
      videoSb.appendBuffer(videoXhr.getResponseData());
    });

    var audioXhr =
        runner.XHRManager.createRequest(audioStream.src, function(e) {
      var minAudioBufferSizeMb = 5;
      var minAudioBufferSize = minAudioBufferSizeMb * 1024 * 1024;
      var audioEstimatedMinTime =
          minAudioBufferSize * (audioStream.duration / audioStream.size) * 0.95;
      var onUpdate = function() {
        audioSb.removeEventListener('updateend', onUpdate);
        runner.checkGE(
            audioSb.buffered.end(0) - audioSb.buffered.start(0),
            audioEstimatedMinTime,
            'Time range in source buffer');
        videoXhr.send();
      };
      audioSb.addEventListener('updateend', onUpdate);
      audioSb.appendBuffer(audioXhr.getResponseData());
    });
    audioXhr.send();
};

/**
 * Ensure Same-origin Policy is enabled through accessing localStorage.
 */
var testSameOriginPolicy =
    createFunctionalTest('14.20.1.1', 'Same-origin Policy', 'Assorted');
testSameOriginPolicy.prototype.title = 'Test Same-origin Policy.';
testSameOriginPolicy.prototype.start = function(runner) {
  var value = localStorage.getItem('yt.leanback::schema-version');
  runner.log('[Same-origin Policy] - localStorage.getItem(' +
      '"yt.leanback::schema-version"); returned: ' + value);
  runner.checkEq(
      value, null, 'localStorage.getItem("yt.leanback::schema-version")');
  return runner.succeed();
};


var createFontDiv = function(format, content) {
  var span = createElement('span');
  span.className = 'dancing-script-' + format;
  span.innerHTML = content;
  return span;
};

/**
 * Validate specified font format is supported by browser.
 * Assume ttf is supported.
 */
var createFontTest = function(testId, format) {
  var test = createFunctionalTest(testId, 'Fonts - ' + format, 'Fonts', false);
  test.prototype.title = 'Test if font format ' + format + ' is supported.';
  test.prototype.start = function(runner) {
    try {
      testArea.removeAttribute('style');
      var fontDiv = createElement('div');
      fontDiv.className = 'font-block';
      testArea.appendChild(fontDiv);
      var characters =
      'ABCĆČDĐEFGHIJKLMNOPQRSŠTUVWXYZŽabcčćdđefghijklmnopqrsštuvwxyzž' +
      'ĂÂÊÔƠƯăâêôơư1234567890‘?’“!”(%)[#]{@}/&amp;\&lt;-+÷×=&gt;®©$€£¥¢:;,.*';
      var ttfEle = createFontDiv('ttf', characters)
      var testEle = createFontDiv(format, characters)
      fontDiv.appendChild(ttfEle);
      fontDiv.appendChild(testEle);

      // Cobalt does not emit any event when fonts load finish.
      // So use setTimeout as a workaround.
      setTimeout(function(event) {
        var ttfWidth = ttfEle.offsetWidth;
        var testWidth = testEle.offsetWidth;
        testArea.removeChild(fontDiv);
        testArea.setAttribute('style', 'display: none');
        if (ttfWidth !== testWidth) {
          throw 'Widths don\'t match: ttf:' + ttfWidth + ' and ' +
              format + ':' + testWidth;
        }
        return runner.succeed();
      }, MS_TO_WAIT_FOR_FONTS);
    } catch (e) {
      return runner.fail(e);
    }
  };
};

createFontTest('14.21.1.1', 'woff');
createFontTest('14.21.2.1', 'woff2');


var setCookie = function(key, value, path, domain, expires, httponly) {
  var payload = key + '=' + value;
  payload += '; path=' + (path ? path : '/');
  payload += '; domain=' + (domain ? domain : '.ytlr-cert.appspot.com');
  if (expires) {
    payload += '; expires=' + expires;
  }
  if (httponly) {
    payload += '; httponly';
  }
  document.cookie = payload;
}

var setCookieObj = function(cookie) {
  setCookie(
      cookie['key'],
      cookie['value'],
      cookie['path'],
      cookie['domain'],
      cookie['expires'],
      cookie['httponly']);
};

var getCookieObject = function() {
  var arr = document.cookie.split('; ');
  var result = {};
  for (var i = 0; i < arr.length; i++) {
    var kv = arr[i].split('=');
    if (kv.length > 1) {
      result[kv[0]] = kv[1];
    }
  }
  return result;
};

// Clear cookie by marking it as expired.
var clearCookie = function(cookie) {
  setCookie(
      cookie['key'],
      cookie['value'],
      cookie['path'],
      cookie['domain'],
      'Thu, 01-Jan-1970 00:00:00 GMT',
      cookie['httponly']);
};

var clearTestCookies = function() {
  for (var i in valid_cookies) {
    clearCookie(valid_cookies[i]);
  }
  for (var i in invalid_cookies) {
    clearCookie(invalid_cookies[i]);
  }
};

var getCookiePath = function() {
  return (testVersion != 'Test-In-Progress') ? testVersion : 'tip';
};

// 'valid_path_cookie' and 'valid_domain_cookie' would fail if you download
// the source code and setup your own server
var valid_cookies = [
  {key: 'valid_cookie', value: 'valid'},
  {key: 'valid_path_cookie', value: 'valid', path: getCookiePath()},
  {
    key: 'valid_domain_cookie',
    value: 'valid',
    domain: '.ytlr-cert.appspot.com'
  }
];

var invalid_cookies = [
  {key: 'invalid_http_only', value: 'invalid', httponly: true},
  {key: 'invalid_path_cookie', value: 'invalid', path: '/p/a/t/h'},
  {
    key: 'invalid_domain_cookie',
    value: 'invalid',
    domain: '.invalid-domain.com'
  },
  {
    key: 'invalid_expired_cookie',
    value: 'invalid',
    expires: 'Thu, 01-Jan-1970 00:00:00 GMT'
  }
];

/**
 * Ensure browser could set cookie and save properly.
 */
var testSetCookie = createFunctionalTest('14.22.1.1', 'Set Cookie', 'Cookie');
testSetCookie.prototype.title = 'Test if browser could save cookie.'
testSetCookie.prototype.start = function(runner) {
  try {
    for (var i in valid_cookies) {
      setCookieObj(valid_cookies[i]);
    }
    for (var i in invalid_cookies) {
      setCookieObj(invalid_cookies[i]);
    }

    var keys = Object.keys(getCookieObject());

    for (var i in valid_cookies) {
      var k = valid_cookies[i].key;
      if (!keys.includes(k)) {
        throw 'Key ' + k + ' should exist in document.cookie but it does not.';
      }
    }
    for (var i in invalid_cookies) {
      var k = invalid_cookies[i].key;
      if (keys.includes(k)) {
        throw 'Key ' + k + ' should not exist in document.cookie but it does.';
      }
    }
    return runner.succeed();
  } catch (e) {
    return runner.fail(e);
  } finally {
    clearTestCookies();
  }
};

/**
 * Ensure browser could set cookie and save properly.
 */
var testSetExpiredCookie =
    createFunctionalTest('14.22.2.1', 'Set Expired Cookie', 'Cookie');
testSetExpiredCookie.prototype.title = 'Test if browser ignores expired cookie.'
testSetExpiredCookie.prototype.start = function(runner) {
  try {
    for (var i in valid_cookies) {
      setCookieObj(valid_cookies[i]);
    }

    var keys = Object.keys(getCookieObject());
    for (var i in valid_cookies) {
      var k = valid_cookies[i].key;
      if (!keys.includes(k)) {
        throw 'Key ' + k + ' should exist in document.cookie but it does not.';
      }
    }

    for (var i in valid_cookies) {
      clearCookie(valid_cookies[i]);
    }

    keys = Object.keys(getCookieObject());
    for (var i in valid_cookies) {
      var k = valid_cookies[i].key;
      if (keys.includes(k)) {
        throw 'Key ' + k + ' should not exist in document.cookie but it does.';
      }
    }

    return runner.succeed();
  } catch (e) {
    return runner.fail(e);
  } finally {
    clearTestCookies();
  }
};

/**
 * Validate certain number of cookies is supported by browser.
 */
var createCookieStorageTest = function(testId, name, count) {
  var test = createFunctionalTest(testId, name, 'Cookie');
  test.prototype.title = 'Test if browser supports ' + count + '4kb cookies.';
  test.prototype.start = function(runner) {
    var cookie_size = 4000;
    try {
      var cookie_storage = document.cookie.length;
      for (var i = 0; i < count; i++) {
        var prefix = 'CookieStorageTest' + ('000' + i).substr(-3) + '=';
        var payload =
            prefix + new Array(cookie_size - prefix.length + 1).join('m');
        document.cookie = payload;
        if (document.cookie.length - cookie_storage < cookie_size)
          throw 'Fail to add the No.' + i + ' cookie';
        else
          cookie_storage = document.cookie.length;
      }
      return runner.succeed();
    } catch (e) {
      return runner.fail(e);
    } finally {
      document.cookie.split(';').forEach(function(c) {
        if (c.trim().startsWith('CookieStorageTest')) {
          document.cookie = c.replace(/^ +/, '').replace(/=.*/, '=;expires=' +
              new Date().toUTCString());
        }
      });
    }
  };
};

createCookieStorageTest('14.22.3.1', 'Min Cookie Storage', 50);
createCookieStorageTest('14.22.4.1', 'Max Cookie Storage', 150);

/**
 * Validate browser could correctly handle request from server with valid and
 * invalid certificates.
 */
var createSslTest = function(testId, name, origin, shouldFail = false) {
  var test = createFunctionalTest(testId, name, 'SSL');
  test.prototype.title =
      'Test if browser correctly handle to request to ' + origin;
  test.prototype.start = function(runner) {
    var url = origin + 'test/dashboard/small-image.png';
    var img = new Image();

    img.addEventListener('load', function() {
      if (shouldFail) {
        return runner.fail(
            'Request to website with invalid SSL certificate succeeds.' +
            'Invalid SSL requests must not be allowed to load.');
      }
      return runner.succeed();
    }, false);

    img.addEventListener('error', function(event) {
      if (shouldFail) {
        return runner.succeed();
      }
      return runner.fail('Request to website with valid SSL certificate fails.');
    }, false);

    img.src = url;
  };
};

createSslTest('14.23.1.1', 'Self-Signed', 'https://self-signed.badssl.com/', true);
createSslTest('14.23.2.1', 'expired', 'https://expired.badssl.com/', true);
createSslTest('14.23.3.1', 'sha256', 'https://sha256.badssl.com/');
createSslTest('14.23.4.1', 'TLS', 'https://tls-v1-2.badssl.com:1012/');

var testGlobalSignR2 =
    createFunctionalTest('14.23.5.1', 'GlobalSign RootCA R2', 'SSL');
testGlobalSignR2.prototype.title = 'Test if browser correctly handle to' +
    'request with GlobalSign RootCA R2 certificate.';
testGlobalSignR2.prototype.start = function(runner) {
  try {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://cert-test.sandbox.google.com/', true);
    xhr.send();
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        if (xhr.status != 200) {
          runner.fail(Error('Xhr request status is not 200 ok'));
        }
        if (!xhr.responseText.includes('Client test successful.')) {
          runner.fail(
              Error('XHR Response not as expected: ' + xhr.responseText));
        }
        return runner.succeed();
      }
    };
  } catch (e) {
    return runner.fail(e);
  }
};

var testGlobalSignR3 =
    createFunctionalTest('14.23.6.1', 'GlobalSign RootCA R3', 'SSL');
testGlobalSignR3.prototype.title = 'Test if browser correctly handle to' +
    'request with GlobalSign RootCA R3 certificate.';
testGlobalSignR3.prototype.start = function(runner) {
  try {
    var url =
	"https://www.globalsign.com/files/4114/9494/4842/switch-to-secure-ssl-globalsign.jpg"
    var img = new Image();

    img.addEventListener('load', function() {
      return runner.succeed();
    }, false);

    img.addEventListener('error', function(event) {
      runner.fail(Error('Request to website with valid SSL certificate fails.'));
    }, false);

    img.src = url;
  } catch (e) {
    return runner.fail(e);
  }
};

return {tests: tests, info: info, fields: fields, viewType: 'default'};
};

try {
  exports.getTest = FunctionalTest;
} catch (e) {
  // do nothing, this function is not supposed to work for browser, but it's for
  // Node js to generate json file instead.
}

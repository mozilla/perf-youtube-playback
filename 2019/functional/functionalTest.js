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
    'https://cobalt.googlesource.com/cobalt/+/19.lts.stable/' +
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

var createFunctionalTest = function(name, category, mandatory) {
  var t = createTest(name);
  t.prototype.index = tests.length;
  t.prototype.passes = 0;
  t.prototype.failures = 0;
  t.prototype.timeouts = 0;
  t.prototype.category = category || 'Functional';
  if (typeof mandatory === 'boolean') {
    t.prototype.mandatory = mandatory;
  }
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
var createAudioContextPropertyTest = function(value, evaluate) {
  var name = value ? 'AudioContext.' + value : 'AudioContext';
  var test = createFunctionalTest(name,'AudioContext');
  test.prototype.title = 'Test if' + name + ' exists';
  test.prototype.start = function(runner) {
    try {
      var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (!evaluate(audioCtx)) {
        throw 'No ' + name + '.';
      }
    } catch (e) {
      return runner.fail(e);
    }
    runner.succeed();
  }
};

createAudioContextPropertyTest(null, function(audioCtx) {
  return !!(audioCtx);
});
createAudioContextPropertyTest('destination', function(audioCtx) {
  return !!(audioCtx.destination);
});
createAudioContextPropertyTest('sampleRate', function(audioCtx) {
  return typeof audioCtx.sampleRate === 'number';
});
createAudioContextPropertyTest('currentTime', function(audioCtx) {
  return isNaN(audioCtx.currentTime) == false;
});
createAudioContextPropertyTest('decodeAudioData', function(audioCtx) {
  return !!(audioCtx.decodeAudioData);
});
createAudioContextPropertyTest('createBufferSource', function(audioCtx) {
  return (!!audioCtx.createBufferSource &&
      audioCtx.createBufferSource() instanceof AudioBufferSourceNode);
});

/**
 * Validate the existence of AudioBufferSourceNode and its properties.
 */
var createAudioBufferSourceNodeTest = function(value, evaluate, mandatory) {
  var name = value ? 'AudioBufferSourceNode.' + value : 'AudioBufferSourceNode';
  var test = createFunctionalTest(name, 'AudioBufferSourceNode', mandatory);
  test.prototype.title = 'Test if ' + name + ' exists.';
  test.prototype.start = function(runner) {
    try {
      var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      var source = audioCtx.createBufferSource();
      if (!evaluate(source)) {
        throw 'No ' + name + '.';
      }
    } catch (e) {
      return runner.fail(e);
    }
    runner.succeed();
  }
};

createAudioBufferSourceNodeTest(null, function(source) {
  return !!source;
});
createAudioBufferSourceNodeTest('buffer', function(source) {
  return !!(typeof source.buffer);
});
createAudioBufferSourceNodeTest('onended', function(source) {
  return !!(typeof source.onended);
});
createAudioBufferSourceNodeTest(
    'playbackRate',
    function(source) {
      return (typeof source.playbackRate.defaultValue === 'number') &&
          (typeof source.playbackRate.value === 'number');
    },
    false);
createAudioBufferSourceNodeTest('start', function(source) {
  return !!(typeof source.start);
});
createAudioBufferSourceNodeTest('stop', function(source) {
  return !!(typeof source.stop);
});

/**
 * Validate the existence of AudioNode and its properties.
 */
var createAudioNodeTest = function(value, evaluate) {
  var name = value ? 'AudioNode.' + value : 'AudioNode';
  var test = createFunctionalTest(name, 'AudioNode');
  test.prototype.title = 'Test if ' + name + ' exists.';
  test.prototype.start = function(runner) {
    try {
      var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      var node = audioCtx.destination;
      if (!evaluate(node, audioCtx)) {
        throw 'No ' + name + '.';
      }
    } catch (e) {
      return runner.fail(e);
    }
    runner.succeed();
  }
};

createAudioNodeTest(null, function(node) {
  return !!(node);
});
createAudioNodeTest('context', function(node, audioCtx) {
  return node.context === audioCtx;
});
createAudioNodeTest('numberOfInputs', function(node) {
  return typeof node.numberOfInputs === 'number';
});
createAudioNodeTest('numberOfOutputs', function(node) {
  return typeof node.numberOfOutputs === 'number';
});
createAudioNodeTest('channelCountMode', function(node) {
  return typeof node.channelCountMode === 'string';
});
createAudioNodeTest('channelInterpretation', function(node) {
  return typeof node.channelInterpretation === 'string';
});
createAudioNodeTest('connect', function(node, audioCtx) {
  return (!!(audioCtx.createBufferSource().connect));
});
createAudioNodeTest('disconnect', function(node, audioCtx) {
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
    'NavigationURLLength', 'URL Length', false);
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
    'ImageSrcURLLength', 'URL Length');
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
var createVideoSrcURLTest = function(format, src) {
  var test = createFunctionalTest(
      'VideoSrcURLLength - ' + format, 'URL Length');
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

createVideoSrcURLTest('mp4', TEST_MEDIA_SRC.SslTestVideoMp4);


/**
 * Ensure super long XHR request URL is properly supported.
 */
var testXHRURLLength = createFunctionalTest('XHRURLLength', 'URL Length');
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
var testCORS = createFunctionalTest('CORS', 'Security');
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
var createLocalStorageTest = function(value, evaluate, cleanup) {
  var name = value ? 'localStorage.' + value : 'localStorage';
  var test = createFunctionalTest(name, 'localStorage');
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

createLocalStorageTest(null, function() {
  return Modernizr.localstorage;
});
createLocalStorageTest('setItem', function() {
  return Modernizr.prefixed('setItem', window.localStorage , false) != false;
});
createLocalStorageTest('getItem', function() {
  return Modernizr.prefixed('getItem', window.localStorage , false) != false;
});
createLocalStorageTest('removeItem', function() {
  return Modernizr.prefixed('removeItem', window.localStorage , false) != false;
});
createLocalStorageTest(
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
var testHTTPS = createFunctionalTest('HTTPS', 'HTTP');
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
var testXMLHTTPRequest = createFunctionalTest('XMLHTTPRequest', 'HTTP');
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
var testXMLHTTPRequestLevel2 = createFunctionalTest(
    'XMLHTTPRequest Level 2', 'HTTP');
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
var createFetchAPITest = function(value, evaluate) {
  var name = 'Fetch API - ' + value;
  var test = createFunctionalTest(name, 'Fetch API');
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

createFetchAPITest('fetch()', function() {
  return !!(window.fetch);
});
createFetchAPITest('Headers', function() {
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
var testFetchAPIRequest= createFunctionalTest(
    'Fetch API - Request', 'Fetch API');
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
var testFetchAPIResponse= createFunctionalTest(
    'Fetch API - Response', 'Fetch API');
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
var testFetchStreamAPIRequest = createFunctionalTest(
    'Fetch API - stream', 'Fetch API');
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
var testStreamsAPI= createFunctionalTest(
    'Streams API - ReadableByteStream', 'Assorted');
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
var testECMA262= createFunctionalTest('ECMA262-5 Strict Mode', 'Assorted');
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
var testAnimationFrame= createFunctionalTest(
    'RequestAnimationFrame', 'Assorted');
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
var testJSDateObject= createFunctionalTest(
    'JavaScript Date Object', 'Assorted');
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
var createImgTest = function(suffix) {
  var test = createFunctionalTest(suffix.toUpperCase(), 'Assorted');
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

createImgTest('Jpg');
createImgTest('Png');

/**
 * Validate the window height and width are in right size.
 */
var testWindowSize = createFunctionalTest('Window Size', 'Assorted');
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
var createWebPTest = function(name, uri) {
  var test = createFunctionalTest(name, 'WebP');
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
  'name': 'WebP Lossles'
}];

for (var i = 0; i < webpTests.length; i++) {
  createWebPTest(webpTests[i].name, webpTests[i].uri);
}

/**
 * Validate specified video format could be played.
 */
var createMediaFormatTest = function(name, stream, codec, mandatory) {
  var test = createFunctionalTest(name, 'Video / Audio', mandatory);
  test.prototype.title = 'Test if browser can play ' + name;
  test.prototype.start = function(runner, video) {
    try {
      if (!!(MediaSource.isTypeSupported &&
          MediaSource.isTypeSupported(
              stream + '; codecs="' + codec + '"'))) {
        return runner.succeed();
      }
      throw name + ' not supported.';
    } catch (e) {
      return runner.fail(e);
    }
  };
};

createMediaFormatTest('MP4 + H.264', 'video/mp4', 'avc1.4d401e');
createMediaFormatTest('WebM + VP9', 'video/webm', 'vp9');
createMediaFormatTest('WebM + VP9 Profile 2', 'video/webm', 'vp9.2');
createMediaFormatTest('WebM + Opus', 'audio/webm', 'opus', false);


/**
 * Ensure WebGL is correctly supported.
 */
var testWebGLSupport = createFunctionalTest(
    'WebGL Support Detected', 'WebGL', harnessConfig.support_webgl);
testWebGLSupport.prototype.title = 'Test if WebGL is correctly supported';
testWebGLSupport.prototype.start = function(runner) {
  try {
    if (window.WebGLRenderingContext) {
      var canvas = createElement('canvas');
      var ctx = canvas.getContext('webgl');
      if (!!(ctx)) {
        return runner.succeed();
      }
    }
    throw 'WebGL not correctly supported.'
  } catch (e) {
    return runner.fail(e);
  }
};

/**
 * Ensure WebGL is properly disabled if not supported.
 */
var testWebGLDisabled = createFunctionalTest(
    'WebGL Properly Disabled', 'WebGL', !harnessConfig.support_webgl);
testWebGLDisabled.prototype.title = 'Test if WebGL is properly disabled';
testWebGLDisabled.prototype.start = function(runner) {
  try {
    if (window.WebGLRenderingContext) {
      var canvas = createElement('canvas');
      var ctx = canvas.getContext('webgl');
      if (ctx) {
        throw 'WebGL not correctly disbabled.'
      }
    }
    return runner.succeed();
  } catch (e) {
    return runner.fail(e);
  }
};

/**
 * Test WebSpeech API through Modernizr.
 */
var testWebSpeechAPI = createFunctionalTest(
    'WebSpeech API', 'Assorted', harnessConfig.support_webspeech);
testWebSpeechAPI.prototype.title = 'Test WebSpeech API.';
testWebSpeechAPI.prototype.start = function(runner) {
  try {
    if (Modernizr.speechrecognition) {
      return runner.succeed();
    }
    throw 'WebSpeech not supported.';
  } catch (e) {
    return runner.fail(e);
  }
};

/**
 * Ensure video/x-flv is unsupported.
 */
var testNoVideoXFlv = createFunctionalTest(
    'video/x-flv is unsupported', 'Assorted');
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
var createMediaSourceTest = function(arg) {
  var test = createFunctionalTest('MediaSource.' + arg, 'MediaSource');
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

createMediaSourceTest('addSourceBuffer');
createMediaSourceTest('sourceBuffers');
createMediaSourceTest('activeSourceBuffers');
createMediaSourceTest('duration');
createMediaSourceTest('removeSourceBuffer');
createMediaSourceTest('readyState');
createMediaSourceTest('endOfStream');

/**
 * Test if specified type is supported through videoElement.isTypeSupported.
 */
var createEMETest = function(name, evaluate, mandatory) {
  var test = createFunctionalTest(name, 'EME Basic', mandatory);
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

createEMETest('Widevine', widevineTest);


var playreadyTest = function(videoElement) {
  return videoElement.canPlayType(
      util.createVideoFormatStr('mp4', 'avc1.42E01E'),
      'com.youtube.playready') != undefined;
};

createEMETest('PlayReady', playreadyTest, false);

createEMETest('DRM', function(videoElement) {
  return widevineTest || playreadyTest;
});

createEMETest(
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
var createMediaDevicesTest = function() {
  var name = 'EnumerateDevices';
  var test = createFunctionalTest(name, name, harnessConfig.support_webspeech);
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

createMediaDevicesTest();

/**
 * Create a UAString test that validates the format of current User Agent.
 */
var createUAStringTest = function() {
  var name = 'User Agent';
  var test = createFunctionalTest(name, name);
  test.prototype.title = 'Test if ' + name + ' format is correct';
  test.prototype.start = function(runner) {
    try{
      var re_2019 = new RegExp(
          [
            '([-.A-Za-z0-9\\\\\\/]*)_([-.A-Za-z0-9\\\\\\/]*)_([-.A-Za-z0-9\\',
            '\\\\/]*)_2019 ?\\/ ?[-_.A-Za-z0-9\\\\]* \\(([-_.A',
            '-Za-z0-9\\\\\\/ ]+), ?([^,]*), ?([WIREDLSwiredls\\\\\\/]*)\\)'
          ].join(''));
      var useragentParsed = re_2019.exec(navigator.userAgent);
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

createUAStringTest();

/**
 * Create a UAString test that validates version of certain items in user agent.
 */
var createCobaltVersionTest = function(regexp, version, name) {
  var title = 'User Agent';
  var test = createFunctionalTest(name + ' ' + title, title);
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
              if (useragentParsed && Number(useragentParsed[1].split('.')[1]) === buildVersion) {
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

createCobaltVersionTest(new RegExp(/19\.lts\.([0-9]\.[0-9]{6})/), 0, 'Cobalt');
createCobaltVersionTest(new RegExp(/Starboard\/([0-9]+)/), 10, 'Starboard');

/**
 * Create a CPU memory test that validates the size of memory allocation.
 */
var createMemoryTest = function(processor, size) {
  var title = processor + ' Memory Allocation';
  var test = createFunctionalTest(title, title);
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
        var a = new Array(size - 50 * 1024 * 1024).join('M');
        var f = function(arr){};
        f(a);
      }
      return runner.succeed();
    } catch (e) {
      return runner.fail(e);
    }
  };
};

createMemoryTest('CPU', 150 * 1024 * 1024);

/**
 * Ensure Same-origin Policy is enabled through accessing localStorage.
 */
var testSameOriginPolicy = createFunctionalTest(
    'Same-origin Policy', 'Assorted');
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
var createFontTest = function(format) {
  var test = createFunctionalTest('Fonts - ' + format, 'Fonts', false);
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

createFontTest('woff');
createFontTest('woff2');


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
var testSetCookie = createFunctionalTest('Set Cookie', 'Cookie');
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
var testSetExpiredCookie = createFunctionalTest('Set Expired Cookie', 'Cookie');
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
var createCookieStorageTest = function(name, count) {
  var test = createFunctionalTest(name, 'Cookie');
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

createCookieStorageTest('Min Cookie Storage', 50);
createCookieStorageTest('Max Cookie Storage', 150);

/**
 * Validate browser could correctly handle request from server with valid and
 * invalid certificates.
 */
var createSslTest = function(name, origin, shouldFail = false) {
  var test = createFunctionalTest(name, 'SSL');
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

createSslTest('Self-Signed', 'https://self-signed.badssl.com/', true);
createSslTest('expired', 'https://expired.badssl.com/', true);
createSslTest('sha256', 'https://sha256.badssl.com/');
createSslTest('TLS', 'https://tls-v1-2.badssl.com:1012/');

var testGlobalSignR2 = createFunctionalTest('GlobalSign RootCA R2', 'SSL');
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

var testGlobalSignR3 = createFunctionalTest('GlobalSign RootCA R3', 'SSL');
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

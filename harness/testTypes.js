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

(function() {

  window.testSuiteDescriptions = {
    'conformance-test': {
      name: 'MSE Conformance Tests',
      title: 'Media Source and Media Conformance Tests',
      heading: 'MSE Conformance Tests'
    },
    'msecodec-test': {
      name: 'MSE Codec Tests',
      title: 'Media Source and Media Conformance Tests for Codecs',
      heading: 'MSE Codec Tests'
    },
    'encryptedmedia-test': {
      name: 'EME Conformance Tests',
      title: 'Encrypted Media Extensions Conformance Tests',
      heading: 'EME Conformance Tests'
     },
    'progressive-test': {
      name: 'Progressive Tests',
      title: 'HTML Media Element Conformance Tests',
      heading: 'HTML Media Element Conformance Tests'
    },
    'playbackperf-sfr-vp9-test': {
      name: '[raptor] VP9 SFR Tests',
      title: '[raptor] Tests for performance of VP9 SFR video playback and decoding',
      heading: '[raptor] VP9 SFR Tests'
    },
    'playbackperf-sfr-h264-test': {
      name: '[raptor] H264 SFR Tests',
      title: '[raptor] Tests for performance of H264 SFR video playback and decoding',
      heading: '[raptor] H264 SFR Tests'
    },
    'playbackperf-sfr-av1-test': {
      name: '[raptor] AV1 SFR Tests',
      title: '[raptor] Tests for performance of AV1 SFR video playback and decoding',
      heading: '[raptor] AV1 SFR Tests',
    },
    'playbackperf-hfr-test': {
      name: '[raptor] HFR Tests',
      title: '[raptor] Tests for performance of HFR video playback and decoding',
      heading: '[raptor] HFR Tests'
    },
    'playbackperf-widevine-sfr-vp9-test': {
      name: '[raptor] VP9 Widevine SFR Tests',
      title: '[raptor] Tests for performance of VP9 DRM video playback and decoding',
      heading: '[raptor] VP9 Widevine SFR Tests'
    },
    'playbackperf-widevine-sfr-h264-test': {
      name: '[raptor] H264 Widevine SFR Tests',
      title: '[raptor] Tests for performance of H264 DRM video playback and decoding',
      heading: '[raptor] H264 Widevine SFR Tests'
    },
    'playbackperf-widevine-hfr-test': {
      name: '[raptor] Widevine HFR Tests',
      title: '[raptor] Tests for performance of HFR video playback and decoding',
      heading: '[raptor] Widevine HFR Tests'
    },
    'sphericalOnCobalt-test': {
      name: 'Cobalt Spherical Tests',
      title: 'Spherical video performance tests on Cobalt',
      heading: 'Spherical on Cobalt Tests'
    },
    // Begin non GitHub files
    'functional-test': {
      name: 'Functional Tests',
      title: 'Tests for required HTML/CSS/DOM/JS functionality',
      heading: 'Functional Tests'
    },
    'css-test': {
      name: 'CSS Conformance Tests',
      title: 'Tests for CSS Conformance functionalities',
      heading: 'CSS Conformance Tests'
    },
    'domelement-test': {
      name: 'HTML DOM Element Tests',
      title: 'Tests for various types of DOM Element',
      heading: 'HTML DOM ELement Tests'
    },
    'domcss-test': {
      name: 'DOM CSS Tests',
      title: 'Tests for DOM CSS element',
      heading: 'DOM CSS Tests'
    },
    'domdocument-test': {
      name: 'DOM Document Tests',
      title: 'Tests for DOM Document Event',
      heading: 'DOM Document & Event Tests'
    },
    'dommisc-test': {
      name: 'DOM chardata, window & Miscellaneous Tests',
      title: 'Tests for DOM chardata, window & Miscellaneous',
      heading: 'DOM chardata, window & Miscellaneous Tests'
    },
    'formatsupport-test': {
      name: 'Format Support Tests',
      title: 'Tests for Format Support',
      heading: 'Format Support Tests'
    },
    'manual-test': {
      name: 'Manual Tests',
      title: 'Links to all manual tests',
      heading: 'Manual Test Links',
    }
    // End non GitHub files
  };

  window.testSuiteVersions = {
    [testVersion] : {
      'testSuites' : [
        'conformance-test',
        'msecodec-test',
        'encryptedmedia-test',
        'sphericalOnCobalt-test',
        'progressive-test',
        'playbackperf-sfr-vp9-test',
        'playbackperf-sfr-h264-test',
        'playbackperf-sfr-av1-test',
        'playbackperf-hfr-test',
        'playbackperf-widevine-sfr-vp9-test',
        'playbackperf-widevine-sfr-h264-test',
        'playbackperf-widevine-hfr-test',
        // Begin non GitHub files
        'functional-test',
        'css-test',
        'domelement-test',
        'domcss-test',
        'domdocument-test',
        'dommisc-test',
        'formatsupport-test',
        'manual-test',
        // End non GitHub files
      ],
      'config' : {
        'defaultTestSuite': 'conformance-test',
        'enablewebm': true,
        'controlMediaFormatSelection': false
      }
    }
  };

})();

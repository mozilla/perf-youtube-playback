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
 * Format Support Test Suite.
 * @class
 */
var FormatsupportTest = function() {

  var tests = [];

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

  /**
   * Test if specified type is supported through MediaSource.isTypeSupported.
   */
  var createSupportTest = function(name, evaluate, mandatory) {
    var logResult = function(format, result) {
      this.runner.log('[' + this.desc + '] - isTypeSupported("' + format +
          '") returned: ' + result);
    };

    var test = createFunctionalTest(name, 'Support', mandatory);
    test.prototype.title = 'Test ' + name;
    test.prototype.start = function() {
      try {
        if (evaluate(logResult.bind(this)))
          this.runner.succeed();
        else
          throw name + ' failed.';
      } catch (e) {
        this.runner.fail(e);
      }
    }
  };

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
        !invalidVideoHeightSupported && !invalidAudioChannelsSupported)
      return true;
  };

  createSupportTest('isTypeSupported cryptoblockformat', function(logResult) {
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

  createSupportTest('isTypeSupported Extensions', isTypeSupportedTest);

  createSupportTest(
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
            !invalidH264Supported)
          return true;
      });

  createSupportTest(
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

        if (baselineVp9Supported && maxVp9Supported && !invalidVp9Supported)
          return true;
      });

  createSupportTest(
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
            !invalidH264Supported)
          return true;
      },
      false);

  createSupportTest(
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

        if (baselineVp9Supported && maxVp9Supported && !invalidVp9Supported)
          return true;
      },
      false);

  createSupportTest(
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
            hlgSupported && !invalidEOTFSupported)
          return true;
      },
      harnessConfig.support_hdr);

  createSupportTest(
      'SMPTE2084 Support',
      function(logResult) {
        var smpte2084Type =
            util.createSimpleVideoFormatStr('webm', 'vp9.2', 'eotf=smpte2084');
        var smpte2084Supported = MediaSource.isTypeSupported(smpte2084Type);
        logResult(smpte2084Type, smpte2084Supported);

        if (smpte2084Supported)
          return true;
      },
      harnessConfig.support_hdr);

  createSupportTest(
      'ARIB STD-B67 Support',
      function(logResult) {
        var hlgType =
            util.createSimpleVideoFormatStr('webm', 'vp9.2', 'eotf=arib-std-b67');
        var hlgSupported = MediaSource.isTypeSupported(hlgType);
        logResult(hlgType, hlgSupported);

        if (hlgSupported)
          return true;
      },
      harnessConfig.support_hdr);

  createSupportTest(
      'ITU-R BT.709 Support',
      function(logResult) {
        var bt709Type =
            util.createSimpleVideoFormatStr('webm', 'vp9.2', 'eotf=bt709');
        var bt709Supported = MediaSource.isTypeSupported(bt709Type);
        logResult(bt709Type, bt709Supported);

        if (bt709Supported)
          return true;
      },
      harnessConfig.support_hdr);

  createSupportTest(
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
   * Validate specified video format could be played.
   */
  var createMediaFormatTest = function(name, stream, codec, mandatory) {
    var test = createFunctionalTest(name, 'Video / Audio', mandatory);
    test.prototype.title = 'Test if browser can play ' + name;
    test.prototype.start = function() {
      try {
        var videoElement = document.createElement('video');
        if (!!(MediaSource.isTypeSupported &&
            MediaSource.isTypeSupported(
                stream + '; codecs="' + codec + '"'))) {
          this.runner.succeed();
        } else {
          throw name + ' not supported.';
        }
      } catch (e) {
        this.runner.fail(e);
      }
    };
  };

  createMediaFormatTest('MP4 + H.264', 'video/mp4', 'avc1.4d401e');
  createMediaFormatTest('WebM + VP9', 'video/webm', 'vp9');
  createMediaFormatTest('WebM + VP9 Profile 2', 'video/webm', 'vp9.2');
  createMediaFormatTest('WebM + Opus', 'audio/webm', 'opus', false);

  /**
   * Validate if VP9 live format can be played.
   */
  var createLivePlaybackSupportTest =
      function(videoStream, audioStream, expectedPlayTimeInS, sizeToFetch) {
    var test = createFunctionalTest(
        sizeToFetch ? 'PartialSegmentPlayback' : 'Playback', 'VP9 Live');
    test.prototype.title = 'Test if playback of VP9 live format is supported.';
    test.prototype.start = function(runner, video) {
      var ms = new MediaSource();
      var videoSb;
      var audioSb;

      ms.addEventListener('sourceopen', function() {
        videoSb = ms.addSourceBuffer(videoStream.mimetype);
        audioSb = ms.addSourceBuffer(audioStream.mimetype);
      });
      video.src = window.URL.createObjectURL(ms);

      var videoXhr = runner.XHRManager.createRequest(
          videoStream.src, function(e) {
        videoSb.appendBuffer(this.getResponseData());
        video.addEventListener('timeupdate', function(e) {
          if (!video.paused && video.currentTime > expectedPlayTimeInS) {
            runner.succeed();
          }
        }, 0, sizeToFetch);
        video.play();
      });
      var audioXhr = runner.XHRManager.createRequest(
          audioStream.src, function(e) {
        audioSb.appendBuffer(this.getResponseData());
        videoXhr.send();
      }, 0, sizeToFetch);
      audioXhr.send();
    };
  };

  createLivePlaybackSupportTest(
      Media.VP9.VideoLive, Media.AAC.AudioForVP9Live, 14);
  createLivePlaybackSupportTest(
      Media.VP9.VideoLive, Media.AAC.AudioForVP9Live, 3, 80000);

  return {tests: tests, viewType: 'default'};
};

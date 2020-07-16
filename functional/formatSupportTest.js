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

  var createFunctionalTest =
      function(testId, name, category = 'Functional', mandatory = true) {
    var t = createTest(name, category, mandatory, testId, 'Format Support Tests');
    t.prototype.index = tests.length;
    tests.push(t);
    return t;
  };

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
    test.prototype.start = function() {
      try {
        if (evaluate(logResult.bind(this), this.runner))
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

  createSupportTest(
      '20.1.1.1', 'isTypeSupported cryptoblockformat', function(logResult) {
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

  createSupportTest(
      '20.1.2.1', 'isTypeSupported Extensions', isTypeSupportedTest);

  createSupportTest(
      '20.1.3.1', 'isTypeSupported AV1 Codec', function(logResult, runner) {
    runner.checkEq(
        false, MediaSource.isTypeSupported('video/mp4; codecs="av1"'));
    runner.checkEq(
        false,
        MediaSource.isTypeSupported('video/mp4; codecs="av00.0.00M.00"'));
    runner.checkEq(
        true,
        MediaSource.isTypeSupported(
            util.createVideoFormatStr('mp4', util.av1Codec())));
    return true;
  }, util.requireAV1());

  var createHfrSupportTest =
      function(testId, format, container, codec, fps, mandatory) {
    createSupportTest(
        testId,
        `${format} ${fps}fps Support`,
        function(logResult) {
          if (!(isTypeSupportedTest(logResult))) return false;

          var maxSupportedWindow = (format => {
            if (format == 'H.264') return util.getMaxH264SupportedWindow();
            if (format == 'VP9') return util.getMaxVp9SupportedWindow();
            if (format == 'AV1') return util.getMaxAv1SupportedWindow();
            throw `Invalid format: ${format}`;
          })(format);
          var maxWidth = maxSupportedWindow[0];
          var maxHeight = maxSupportedWindow[1];

          var testTypeSupported = (width, height, fps) => {
            var type =
                util.createVideoFormatStr(container, codec, width, height, fps);
            var supported = MediaSource.isTypeSupported(type);
            logResult(type, supported);
            return supported;
          };

          var invalidTypeSupported = testTypeSupported(640, 360, 9999);
          var baselineTypeSupported = testTypeSupported(640, 360, fps);
          var maxResolutionTypeSupported =
              testTypeSupported(maxWidth, maxHeight, fps);
          return baselineTypeSupported &&
              maxResolutionTypeSupported &&
              !invalidTypeSupported;
        },
        mandatory);
  };

  createHfrSupportTest('20.1.4.1', 'H.264', 'mp4', 'avc1.4d401e', 60);
  createHfrSupportTest('20.1.5.1', 'VP9', 'webm', 'vp9', 60);
  createHfrSupportTest('20.1.6.1', 'AV1', 'mp4', util.av1Codec(), 60, false);
  createHfrSupportTest('20.1.7.1', 'H.264', 'mp4', 'avc1.4d401e', 120, false);
  createHfrSupportTest('20.1.8.1', 'VP9', 'webm', 'vp9', 120, false);
  createHfrSupportTest('20.1.9.1', 'AV1', 'mp4', util.av1Codec(), 120, false);

  createSupportTest(
      '20.1.10.1',
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
      '20.1.11.1',
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
      '20.1.12.1',
      'ARIB STD-B67 Support',
      function(logResult) {
        var hlgType = util.createSimpleVideoFormatStr(
            'webm', 'vp9.2', 'eotf=arib-std-b67');
        var hlgSupported = MediaSource.isTypeSupported(hlgType);
        logResult(hlgType, hlgSupported);

        if (hlgSupported)
          return true;
      },
      harnessConfig.support_hdr);

  createSupportTest(
      '20.1.13.1',
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
      '20.1.14.1',
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
      util.isCobalt() && !harnessConfig.novp9);

  /**
   * Validate specified video format could be played.
   */
  var createMediaFormatTest = function(testId, name, stream, codec, mandatory) {
    var test = createFunctionalTest(testId, name, 'Video / Audio', mandatory);
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

  createMediaFormatTest('20.2.1.1', 'MP4 + H.264', 'video/mp4', 'avc1.4d401e');
  createMediaFormatTest('20.2.2.1', 'WebM + VP9', 'video/webm', 'vp9');
  createMediaFormatTest(
      '20.2.3.1', 'WebM + VP9 Profile 2', 'video/webm', 'vp9.2');
  createMediaFormatTest('20.2.4.1', 'WebM + Opus', 'audio/webm', 'opus', false);
  createMediaFormatTest('20.2.5.1', 'MP4 + AC3', 'audio/mp4', 'ac-3', false);
  createMediaFormatTest('20.2.6.1', 'MP4 + EAC3', 'audio/mp4', 'ec-3', false);
  createMediaFormatTest('20.2.7.1', 'MP4 + AV1 (Level 4.1 SDR)', 'video/mp4',
      util.av1Codec('4.1'), util.requireAV1());
  createMediaFormatTest('20.2.8.1', 'MP4 + AV1 (Level 5.1 SDR)', 'video/mp4',
      util.av1Codec('5.1'), util.requireAV1());
  createMediaFormatTest('20.2.9.1', 'MP4 + AV1 (Level 5.1 HDR)', 'video/mp4',
      util.av1Codec('5.1', 10), util.requireAV1());
  createMediaFormatTest('20.2.10.1', 'MP4 + AV1 (Level 6.0 SDR)', 'video/mp4',
      util.av1Codec('6.0'), util.isGt4K());
  createMediaFormatTest('20.2.11.1', 'MP4 + AV1 (Level 6.0 HDR)', 'video/mp4',
      util.av1Codec('6.0', 10), util.isGt4K());

  /**
   * Validate if VP9 live format can be played.
   */
  var createLivePlaybackSupportTest = function(
      testId, videoStream, audioStream, expectedPlayTimeInS, sizeToFetch) {
    var test = createFunctionalTest(
        testId, sizeToFetch ? 'PartialSegmentPlayback' : 'Playback', 'VP9 Live');
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
      '20.3.1.1', Media.VP9.VideoLive, Media.AAC.AudioForVP9Live, 14);
  createLivePlaybackSupportTest(
      '20.3.2.1', Media.VP9.VideoLive, Media.AAC.AudioForVP9Live, 3, 80000);

  /**
   * Test HDR 10-bit VP9 Profile 2 (HLG and PQ).
   */
  var create10BitVp9Test = function(testId, videoStream, audioStream) {
    if (!audioStream) {
      audioStream = Media.AAC.AudioNormal;
    }
    var mandatory = util.isGt4K() ||
        (util.isGtFHD() && videoStream.get('fps') <= 30);
    var test = createFunctionalTest(
        testId,
        `VP9.Profile2.10Bit.${videoStream.get('transferFunction')}` +
            `.${videoStream.get('resolution')}${videoStream.get('fps')}`,
        'VP9 HDR',
        mandatory);
    test.prototype.title = 'Test playback of HDR 10-bit VP9 Profile 2.';
    test.prototype.start = function(runner, video) {
      if (!isTypeSupported(videoStream)) {
        runner.fail(`MIME type not supported: '${videoStream.mimetype}'`);
        return;
      }
      setupMse(video, runner, videoStream, audioStream);
      video.addEventListener('timeupdate', function(e) {
        if (!video.paused && video.currentTime > 5) {
          runner.succeed();
        }
      });
      video.play();
    };
  }

  // Transfer function: HLG
  create10BitVp9Test('20.4.1.1', Media.VP9.HdrHlgUltralow);
  create10BitVp9Test('20.4.2.1', Media.VP9.HdrHlgLow);
  create10BitVp9Test('20.4.3.1', Media.VP9.HdrHlgMed);
  create10BitVp9Test('20.4.4.1', Media.VP9.HdrHlgHigh);
  create10BitVp9Test('20.4.5.1', Media.VP9.HdrHlg720p);
  create10BitVp9Test('20.4.6.1', Media.VP9.HdrHlg1080p);
  create10BitVp9Test('20.4.7.1', Media.VP9.HdrHlg2k);
  create10BitVp9Test('20.4.8.1', Media.VP9.HdrHlg4k);
  create10BitVp9Test('20.4.9.1', Media.VP9.HdrHlgUltralowHfr);
  create10BitVp9Test('20.4.10.1', Media.VP9.HdrHlgLowHfr);
  create10BitVp9Test('20.4.11.1', Media.VP9.HdrHlgMedHfr);
  create10BitVp9Test('20.4.12.1', Media.VP9.HdrHlgHighHfr);
  create10BitVp9Test('20.4.13.1', Media.VP9.HdrHlg720pHfr);
  create10BitVp9Test('20.4.14.1', Media.VP9.HdrHlg1080pHfr);
  create10BitVp9Test('20.4.15.1', Media.VP9.HdrHlg2kHfr);
  create10BitVp9Test('20.4.16.1', Media.VP9.HdrHlg4kHfr);

  // Transfer function: PQ
  create10BitVp9Test('20.4.17.1', Media.VP9.HdrPqUltralow);
  create10BitVp9Test('20.4.18.1', Media.VP9.HdrPqLow);
  create10BitVp9Test('20.4.19.1', Media.VP9.HdrPqMed);
  create10BitVp9Test('20.4.20.1', Media.VP9.HdrPqHigh);
  create10BitVp9Test('20.4.21.1', Media.VP9.HdrPq720p);
  create10BitVp9Test('20.4.22.1', Media.VP9.HdrPq1080p);
  create10BitVp9Test('20.4.23.1', Media.VP9.HdrPq2k);
  create10BitVp9Test('20.4.24.1', Media.VP9.HdrPq4k);
  create10BitVp9Test(
      '20.4.25.1', Media.VP9.HdrPqUltralowHfr, Media.AAC.AudioMeridian);
  create10BitVp9Test(
      '20.4.26.1', Media.VP9.HdrPqLowHfr, Media.AAC.AudioMeridian);
  create10BitVp9Test(
      '20.4.27.1', Media.VP9.HdrPqMedHfr, Media.AAC.AudioMeridian);
  create10BitVp9Test(
      '20.4.28.1', Media.VP9.HdrPqHighHfr, Media.AAC.AudioMeridian);
  create10BitVp9Test(
      '20.4.29.1', Media.VP9.HdrPq720pHfr, Media.AAC.AudioMeridian);
  create10BitVp9Test(
      '20.4.30.1', Media.VP9.HdrPq1080pHfr, Media.AAC.AudioMeridian);
  create10BitVp9Test(
      '20.4.31.1', Media.VP9.HdrPq2kHfr, Media.AAC.AudioMeridian);
  create10BitVp9Test(
      '20.4.32.1', Media.VP9.HdrPq4kHfr, Media.AAC.AudioMeridian);

  /**
   * Validate specified mimetype is supported.
   */
  var createMimeTypeTest = function(testId, mimetype, desc, mandatory = true) {
    var test =
        createFunctionalTest(testId, desc + 'Support', 'MIME Type Support',
            mandatory);
    test.prototype.start = function(runner, video) {
      this.ms = new MediaSource();
      this.ms.addEventListener('sourceopen', this.onsourceopen.bind(this));
      if (this.ms.isWrapper)
        this.ms.attachTo(video);
      else
        this.video.src = window.URL.createObjectURL(this.ms);
    };
    test.prototype.title =
        'Test if we support ' + desc + ' with mimetype: ' + mimetype;
    test.prototype.onsourceopen = function() {
      try {
        this.log('Trying format ' + mimetype);
        var src = this.ms.addSourceBuffer(mimetype);
      } catch (e) {
        return this.runner.fail(e);
      }
      this.runner.succeed();
    };
  };

  createMimeTypeTest('20.5.1.1', Media.AAC.mimetype, 'AAC');
  createMimeTypeTest('20.5.2.1', Media.H264.mimetype, 'H264');
  createMimeTypeTest('20.5.3.1', Media.VP9.mimetype, 'VP9');
  createMimeTypeTest('20.5.4.1', Media.Opus.mimetype, 'Opus');
  createMimeTypeTest('20.5.5.1', Media.AC3.mimetype, 'AC3', false);
  createMimeTypeTest('20.5.6.1', Media.EAC3.mimetype, 'EAC3', false);

  var createAudio51Test = function(testId, audioStream, mandatory) {
    var test = createFunctionalTest(testId, `${audioStream.codec} 5.1`, 'Media',
        mandatory);
    test.prototype.start = function(runner, video) {
      this.ms = new MediaSource();
      this.ms.addEventListener('sourceopen', this.onsourceopen.bind(this));
      if (this.ms.isWrapper)
        this.ms.attachTo(video);
      else
        this.video.src = window.URL.createObjectURL(this.ms);
    };
    test.prototype.title = `Test 5.1-channel ${audioStream.codec}`;
    test.prototype.onsourceopen = function() {
      var runner = this.runner;
      var media = this.video;
      var videoStream = Media.H264.VideoNormal;
      try {
        var audioSb = this.ms.addSourceBuffer(audioStream.mimetype);
        var videoSb = this.ms.addSourceBuffer(videoStream.mimetype);
        var xhr = runner.XHRManager.createRequest(audioStream.src, function(e) {
          audioSb.appendBuffer(xhr.getResponseData());
          var xhr2 =
              runner.XHRManager.createRequest(videoStream.src, function(e) {
                videoSb.appendBuffer(xhr2.getResponseData());
                media.play();
                media.addEventListener('timeupdate', function(e) {
                  if (!media.paused && media.currentTime > 2) {
                    runner.succeed();
                  }
                });
              }, 0, 3000000);
          xhr2.send();
        });
      } catch (error) {
        runner.fail(error);
      }
      xhr.send();
    };
  };

  /**
   * Test different audio codecs with 5.1 surround sound (six channel surround
   * sound audio system).
   */
  createAudio51Test('20.6.3.1', Media.Opus.Audio51);
  createAudio51Test('20.6.4.1', Media.AAC.Audio51);
  createAudio51Test('20.6.5.1', Media.AC3.Audio51, false);
  createAudio51Test('20.6.6.1', Media.EAC3.Audio51, false);

  return {tests: tests, viewType: 'default'};
};

try {
  exports.getTest = FormatsupportTest;
} catch (e) {
  // do nothing, this function is not supposed to work for browser, but it's for
  // Node js to generate json file instead.
}

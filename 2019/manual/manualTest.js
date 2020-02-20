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
 * MSE Conformance Test Suite.
 * @class
 */
var ManualTest = function() {

    const YOUTUBE_BASE_URL = 'https://www.youtube.com/tv';
    const DASH_PLAYER_URL = 'https://ytlr-cert.appspot.com/demoplayer/2020/dash-player.html?manifest_url=assets/';

    var testVersion = 'Current Editor\'s Draft';

    var demoVideoLink = DASH_PLAYER_URL + 'waymo_vp9_opus.mpd';
    if (harnessConfig.novp9) {
        demoVideoLink = DASH_PLAYER_URL + 'waymo_h264_aac.mpd';
    }

    var tests = [];
    var info = 'Spec Version: ' + testVersion + ' | Default Timeout: ' +
        TestBase.timeout + 'ms';

    var fields = ['passes', 'failures', 'timeouts'];

    var createManualTest = function(testId, name, category, link,
        description = '', passingCriteria = '', instruction = '',
        mandatory = true) {
        var t = createTest(name, category, mandatory, testId, 'Manual Tests',
            '', passingCriteria, instruction, true, link, description);
        t.prototype.index = tests.length;
        t.prototype.title = link;
        t.prototype.start = function() {
            location.href = link;
        };
        tests.push(t);
        return t;
    };

    var ref = encodeURIComponent(window.location.href.split('#')[0]);
    var createUrlwithRefererParam = function(baseUrl) {
        return util.createUrlwithParams(baseUrl, ['referer=' + ref]);
    };

    var createYTDeeplink = function(params) {
        var params_array = [];
        for (var key in params) {
            params_array.push(key + '=' + params[key]);
        }
        var url = YOUTUBE_BASE_URL + '?' + params_array.join('&');
        return url;
    };


    createManualTest('21.1.1.1', '12H Endurance', 'In-APP', createYTDeeplink({ list: 'PLT2JIu9jdshr-q6fs7BCqAygvTHwnZUIt' }),
        'Testing that the device can play back 12 hours of continuous video.');
    createManualTest('21.1.2.1', 'LiveDRM', 'In-APP', createYTDeeplink({ list: 'PLT2JIu9jdshrFoCo9B81bRwsToEazVdpj' }),
        'Testing that Live videos using DRM display properly. ');
    createManualTest('21.1.3.1', 'FPS (Cobalt)', 'In-APP', createYTDeeplink({
        list: 'stats',
        env_showUIStats: 1,
        env_useZylon: 'false',
    }), 'Testing that the platform can sustain 60fps during UI navigation. ');
    createManualTest('21.1.4.1', 'FPS (Webkit)', 'In-APP', createYTDeeplink({
        list: 'fps',
        env_showFPS: 1,
        env_useZylon: 'false',
    }), 'Testing that the platform can sustain 60fps during UI navigation. ');
    createManualTest('21.1.5.1', 'HDR - 1', 'In-APP', createYTDeeplink({
        v: 'Ss75O8yllyc',
        list: 'PLT2JIu9jdshorooZOhIZJNIxa5hAVnToP'
    }), 'Testing that HDR10 is supported.');
    createManualTest('21.1.6.1', 'HDR - 2', 'In-APP', createYTDeeplink({ v: '5w58p6iVhPc' }), 'Testing that HLG is supported. ');
    createManualTest('21.1.7.1', '60FPS + devicePixelRatio', 'In-APP',
        createYTDeeplink({
            v: 'aqz-KE-bpKQ',
            list: 'PLT2JIu9jdshoBsbCTUq15c1554EoRNhj3'
        }), 'Testing that the device can properly play back content at ' +
    '60fps up to 4k (if supported)');
    createManualTest('21.1.8.1', '3D Video', 'In-APP', createYTDeeplink({ list: 'PLT2JIu9jdshqvVr-ZdjndoIYn_HggixZI' }),
        'Testing that 3D content is appropriately rendered if supported.');
    createManualTest('21.1.9.1', 'WebSpeech', 'In-APP', createYTDeeplink({ env_supportsVoiceSearch: 1 }),
        'Parameter to enable Voice Search within YouTube. Required for ' +
        'all devices with microphones. ');
    createManualTest('21.1.10.2', '21:9 Aspect Ratio', 'In-APP',
        createYTDeeplink({ v: 'L9szn1QQfas' }),
        'Testing that 21:9 content is rendered properly (Not cropped, ' +
        'stretched or zoomed)');
    createManualTest('21.1.11.1', '4:3 Aspect Ratio', 'In-APP', createYTDeeplink({ v: 'MJ62hh0a9U4' }),
        'Testing that 4:3 content is rendered properly (Not cropped, ' +
        'stretched or zoomed)');
    createManualTest('21.1.12.1', '16:9 Aspect Ratio', 'In-APP', createYTDeeplink({ v: 'yaqe1qesQ8c' }),
        'Testing that 16:9 content is rendered properly (Not cropped, ' +
        'stretched or zoomed)');
    createManualTest('21.1.13.1', '17:30 Aspect Ratio', 'In-APP', createYTDeeplink({ v: '-NfJS30FrXQ' }),
        'Testing that 17:30 content is rendered properly (Not cropped, ' +
        'stretched or zoomed)');
    createManualTest('21.1.14.1', 'High Bitrate', 'In-APP', createYTDeeplink({ v: 'n2hMafme3e0' }),
        'Testing that higher bitrate content is decoded and displayed ' +
        'properly.');
    createManualTest('21.1.15.1', 'Audio Sync', 'In-APP', createYTDeeplink({ v: 'cJsyMmC76aM' }),
        'Testing that AV sync is properly maintained during video' +
        ' playback. ');
    createManualTest('21.1.16.1', 'Live Channel', 'In-APP', createYTDeeplink({ c: 'UC4R8DWoMoI7CAwX8_LjQHig' }),
        'Testing that LIve content displays properly.');
    createManualTest(
        '21.1.17.1',
        'Device Authentication',
        'In-APP',
        createYTDeeplink({
            show_signature_verification_watermark: 1,
            cert_scope: harnessConfig.cert_scope,
            sig: harnessConfig.sig,
            start_time: harnessConfig.start_time
        }),
        'Testing that the device has a valid Lightweight Auth Key.');

    createManualTest('21.2.1.1', 'Cert Performance', 'In-APP Performance',
        createYTDeeplink({ loader: 'certperf' }), 'Testing device performance for normal in-app usage ' +
    'against technical specs');
    createManualTest('21.2.2.1', '12 Hours Key Input Stress', 'In-APP Performance',
        createYTDeeplink({
            automationRoutine: 'airstreamBrowseRoutine',
            env_useZylon: 'false'
        }),
        'Testing 12 hours in-app D-pad navigation browse endurance');
    createManualTest('21.2.3.1', '4 Hours Browse Watch', 'In-APP Performance',
        createYTDeeplink({
            automationRoutine: 'deviceCertRoutine',
            env_useZylon: 'false'
        }),
        'Testing 4 hours in-app navigation and watch endurance ');
    createManualTest('21.2.4.1', 'System Overlay', 'In-APP Performance',
        createYTDeeplink({
            automationRoutine: 'deviceCertRoutine',
            env_showUIStats: 'true',
            env_useZylon: 'false'
        }), 'Testing in-app focus/blur performance degration');

    createManualTest('21.3.1.1', 'Adaptive Bit Rate', 'Media', demoVideoLink,
        'Testing MediaSource Extension\'s Adaptive Bitrate playback.');
    createManualTest('21.3.2.2', 'Dual Video', 'Media',
        'manual/dual_video.html',
        'Testing dual video playback, one DRM and one 15fps non-DRM');
    createManualTest('21.3.3.1', 'Resizing', 'Media',
        'manual/resizing.html',
        'Testing video resizing and graphics layer alignment. ');
    createManualTest('21.3.4.1', 'Current Time', 'Media',
        'https://www.youtube.com/tv?env_showUIStats=true#/watch/video/' +
        'idle?v=RgodTgI2EDo&resume',
        'Testing that the video.currentTime is accurate within ' +
        '32ms of a paused frame of video. ');


    createManualTest('21.4.1.1', '0.25x', 'Playback Rate', demoVideoLink +
        '&playbackRate=0.25',
        'Testing that deeplinking into a video playback with a' +
        ' playbackRate set actually plays at the specified rate.');
    createManualTest('21.4.2.1', '0.5x', 'Playback Rate', demoVideoLink +
        '&playbackRate=0.5',
        'Testing that deeplinking into a video playback with a ' +
        'playbackRate set actually plays at the specified rate.');
    createManualTest('21.4.8.1', '0.75x', 'Playback Rate', demoVideoLink +
        '&playbackRate=0.75',
        'Testing that deeplinking into a video playback with a ' +
        'playbackRate set actually plays at the specified rate.');
    createManualTest('21.4.3.1', '1.0x', 'Playback Rate', demoVideoLink +
        '&playbackRate=1.0',
        'Testing that deeplinking into a video playback with a' +
        ' playbackRate set actually plays at the specified rate.');
    createManualTest('21.4.4.1', '1.25x', 'Playback Rate', demoVideoLink +
        '&playbackRate=1.25',
        'Testing that deeplinking into a video playback with a ' +
        'playbackRate set actually plays at the specified rate.');
    createManualTest('21.4.5.1', '1.5x', 'Playback Rate', demoVideoLink +
        '&playbackRate=1.5',
        'Testing that deeplinking into a video playback with a ' +
        'playbackRate set actually plays at the specified rate.');
    createManualTest('21.4.9.1', '1.75x', 'Playback Rate', demoVideoLink +
        '&playbackRate=1.75',
        'Testing that deeplinking into a video playback with a ' +
        'playbackRate set actually plays at the specified rate.');
    createManualTest('21.4.6.1', '2.0x', 'Playback Rate', demoVideoLink +
        '&playbackRate=2.0',
        'Testing that deeplinking into a video playback with a' +
        ' playbackRate set actually plays at the specified rate.');
    createManualTest('21.4.7.1', 'Runtime Change', 'Playback Rate', demoVideoLink,
        'Testing that after starting a video with a playbackRate of ' +
        '1.0, subsequent changes of playbackRate to other values are respected.');


    createManualTest('21.5.1.1', 'Widevine', 'DRM',
        'manual/widevine_license_request.html',
        'Testing that the Widevine settings meet the requirements ' +
        'for identification of the device and OEMCrypto version.');
    createManualTest('21.5.2.1', 'DRM', 'DRM',
        'https://ytlr-cert.appspot.com/demoplayer/2020/dash-player.html?' +
        'manifest_url=assets/oops_cenc_pssh.mpd',
        'Testing the combination of MediaSource Adaptive Bitrate' +
        ' playback and DRM.');
    createManualTest('21.5.3.1', 'Purchased Movie #1', 'DRM',
        'https://www.youtube.com/tv?env_isVideoInfoVisible=1&v=MeFoUwes8nE', '');
    createManualTest('21.5.4.1', 'Purchased Movie #2', 'DRM',
        'https://www.youtube.com/watch?env_isVideoInfoVisible=1&v=iNvUS1dnwfw', '');
    createManualTest('21.5.5.1', 'VP9 Subsample', 'DRM',
        'https://ytlr-cert.appspot.com/demoplayer/2020/dash-player.html?' +
        'manifest_url=assets/sintel_vp9_subsample.mpd',
        'Testing DRM Widevine & VP9');


    createManualTest('21.6.1.1', 'Non-animated WebP', 'WebP', 'manual/webp.html',
        'Testing that WebP images can be properly decoded and ' +
        'displayed on the device.');
    createManualTest('21.6.2.1', 'Animated WebP', 'WebP', 'manual/' +
        'webp_animated.html',
        'Testing that animated WebP images can be properly decoded ' +
        'and displayed on the device, at a framerate of 10fps. ');
    createManualTest('21.6.3.1', 'YouTube App with WebP', 'WebP',
        'https://www.youtube.com/tv?env_supportsAnimatedWebp=true#/',
        'Parameter that forces WebP thumbnails within the YouTube ' +
        'application. ');


    createManualTest('21.7.1.1', 'Map-To-Mesh 720P', 'Spherical - Cobalt',
        'manual/mtm720.html',
        'Testing that Cobalt\'s Map-to-Mesh feature appropriately ' +
        'decodes video to textures. Used for 360 video. ');
    createManualTest('21.7.2.1', 'Map-To-Mesh 1080P', 'Spherical - Cobalt',
        'manual/mtm1080.html',
        'Testing that Cobalt\'s Map-to-Mesh feature appropriately ' +
        'decodes video to textures. Used for 360 video. ');
    createManualTest('21.7.3.1', 'Map-To-Mesh 1440P', 'Spherical - Cobalt',
        'manual/mtm1440.html',
        'Testing that Cobalt\'s Map-to-Mesh feature appropriately ' +
        'decodes video to textures. Used for 360 video. ');
    createManualTest('21.7.4.1', 'Map-To-Mesh 2160P', 'Spherical - Cobalt',
        'manual/mtm2160.html',
        'Testing that Cobalt\'s Map-to-Mesh feature appropriately ' +
        'decodes video to textures. Used for 360 video. ');

    createManualTest('21.999.1.1', 'Key Event', 'ETC', 'manual/key_event.html',
        'Testing that the keyrepeat rate of the platform is ' +
        'appropriately set, per the requirements.');
    createManualTest('21.999.2.1', 'Fetch API', 'ETC', createUrlwithRefererParam(
        'https://qual-e.appspot.com/fetch.html'),
        'This tests that the Fetch API works properly. This page is ' +
        'provided for debugging.');
    createManualTest('21.999.3.1', 'Web Audio', 'ETC', 'manual/web_audio.' +
        'html', 'Testing that WebAudio works properly and can play audio ' +
    'while video playback occurs. ');
    createManualTest('21.999.4.1', 'Cookie', 'ETC', 'manual/cookie.html',
        'Testing that Cookies are stored properly and persist until ' +
        'cleared.\n' +
        'This test relies on Cookies being set, and remaining persistently in ' +
        'storage until they expire.');
    createManualTest('21.999.5.1', 'Fonts', 'ETC', 'manual/fonts.html',
        'Testing that all required font formats are supported by ' +
        'the device.');
    createManualTest('21.999.6.1', 'Localization', 'ETC', 'manual/localization.html',
        'Testing that the platform supports the required fonts to ' +
        'display all languages required.');
    createManualTest('21.999.7.1', 'Page Visibility API', 'ETC',
        'manual/page_visibility.html',
        'Testing that the Cobalt Application Lifecycle is appropriately ' +
        'implemented on the platform. ');
    createManualTest('21.999.8.1', 'Captions API', 'ETC', 'manual/caption.html',
        'Testing that the platform system settings supports closed captions ' +
        'is correctly linked with Cobalt settings');

    return { tests: tests, info: info, fields: fields, viewType: 'default' };
};

try {
    exports.getTest = ManualTest;
} catch (e) {
    // do nothing, this function is not supposed to work for browser, but it's for
    // Node js to generate json file instead.
}
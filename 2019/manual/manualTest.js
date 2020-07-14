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

var testVersion = 'Current Editor\'s Draft';

var tests = [];
var info = 'Spec Version: ' + testVersion + ' | Default Timeout: ' +
    TestBase.timeout + 'ms';

var fields = ['passes', 'failures', 'timeouts'];

var createManualTest = function(name, category, link) {
  var t = function() {};
  t.prototype.desc = name;
  t.prototype.index = tests.length;
  t.prototype.title = link;
  t.prototype.category = category;
  t.prototype.start = function () {
    location.href = link;
  }
  tests.push(t);
  return t;
};

var ref = encodeURIComponent(window.location.href.split("#")[0]);
var createUrlwithRefererParam = function(baseUrl) {
  return util.createUrlwithParams(baseUrl, ['referer=' + ref]);
};

var createYTDeeplink = function(params) {
  var params_array = [];
  for (var key in params) {
    params_array.push(key + '=' + params[key]);
  }
  var url = YOUTUBE_BASE_URL + '?' + params_array.join('&');
  console.log('url: ' +  url);
  return url;
};


createManualTest(
    '12H Endurance',
    'In-APP',
    createYTDeeplink({list: 'PLT2JIu9jdshr-q6fs7BCqAygvTHwnZUIt'}));
createManualTest(
    'LiveDRM',
    'In-APP',
    createYTDeeplink({list: 'PLT2JIu9jdshrFoCo9B81bRwsToEazVdpj'}));
createManualTest(
    'FPS (Cobalt)',
    'In-APP',
    createYTDeeplink({list: 'stats', env_showUIStats: 1}));
createManualTest(
    'FPS (Webkit)',
    'In-APP',
    createYTDeeplink({list: 'fps', env_showFPS: 1}));
createManualTest(
    'HDR - 1',
    'In-APP',
    createYTDeeplink(
        {v: 'Ss75O8yllyc', list: 'PLT2JIu9jdshorooZOhIZJNIxa5hAVnToP'}));
createManualTest(
    'HDR - 2',
    'In-APP',
    createYTDeeplink({v: '5w58p6iVhPc'}));
createManualTest(
    '60FPS + devicePixelRatio',
    'In-APP',
    createYTDeeplink(
        {v: 'aqz-KE-bpKQ', list: 'PLT2JIu9jdshoBsbCTUq15c1554EoRNhj3'}));
createManualTest(
    '3D',
    'In-APP',
    createYTDeeplink({list: 'PLT2JIu9jdshqvVr-ZdjndoIYn_HggixZI'}));
createManualTest(
    'WebSpeech',
    'In-APP',
    createYTDeeplink({env_supportsVoiceSearch: 1}));
createManualTest(
    '21:9 Aspect Ratio',
    'In-APP',
    createYTDeeplink(
        {v: '-xxLw7S6EaA', list: 'PLT2JIu9jdshqfVCbUd0YBKd64lCXZ-9vp'}));
createManualTest(
    '4:3 Aspect Ratio', 'In-APP', createYTDeeplink({v: 'MJ62hh0a9U4'}));
createManualTest(
    '16:9 Aspect Ratio', 'In-APP', createYTDeeplink({v: 'yaqe1qesQ8c'}));
createManualTest(
    'Audio Parse', 'In-APP', createYTDeeplink({v: 'eKyY8zfjBMQ'}));
createManualTest(
    'High Bitrate', 'In-APP', createYTDeeplink({v: 'n2hMafme3e0'}));
createManualTest(
    'Audio Sync', 'In-APP', createYTDeeplink({v: 'cJsyMmC76aM'}));
createManualTest(
    'Live Channel',
    'In-APP',
    createYTDeeplink({c: 'UC4R8DWoMoI7CAwX8_LjQHig'}));


createManualTest(
    'Performance',
    'In-APP Performance',
    createYTDeeplink({loader: 'certperf'}));
createManualTest(
    'Airstream Browse Routine',
    'In-APP Performance',
    createYTDeeplink({automationRoutine: 'airstreamBrowseRoutine'}));
createManualTest(
    'Airstream Browse Watch Routine',
    'In-APP Performance',
    createYTDeeplink({automationRoutine: 'airstreamBrowseWatchRoutine'}));
createManualTest(
    'Device Cert Routine',
    'In-APP Performance',
    createYTDeeplink(
        {automationRoutine: 'deviceCertRoutine', env_showUIStats: 'true'}));


createManualTest(
    'Adaptive Bit Rate',
    'Media',
    'https://ytlr-cert.appspot.com/demoplayer/2019/dash-player.html?manifest_url=assets/waymo_vp9_aac.mpd');
createManualTest('Dual Video (optional)', 'Media', 'manual/dual_video.html');
createManualTest(
    'Resizing',
    'Media',
    createUrlwithRefererParam('https://qual-e.appspot.com/scaling.html'));
createManualTest(
    'Current Time',
    'Media',
    'https://www.youtube.com/tv?env_showUIStats=true#/watch/video/idle?v=RgodTgI2EDo&resume');


createManualTest(
    '0.25x',
    'Playback Rate',
    'https://ytlr-cert.appspot.com/demoplayer/2019/dash-player.html?manifest_url=assets/waymo_vp9_opus.mpd&playbackRate=0.25');
createManualTest(
    '0.5x',
    'Playback Rate',
    'https://ytlr-cert.appspot.com/demoplayer/2019/dash-player.html?manifest_url=assets/waymo_vp9_opus.mpd&playbackRate=0.5');
createManualTest(
    '1.0x',
    'Playback Rate',
    'https://ytlr-cert.appspot.com/demoplayer/2019/dash-player.html?manifest_url=assets/waymo_vp9_opus.mpd&playbackRate=1.0');
createManualTest(
    '1.25x',
    'Playback Rate',
    'https://ytlr-cert.appspot.com/demoplayer/2019/dash-player.html?manifest_url=assets/waymo_vp9_opus.mpd&playbackRate=1.25');
createManualTest(
    '1.5x',
    'Playback Rate',
    'https://ytlr-cert.appspot.com/demoplayer/2019/dash-player.html?manifest_url=assets/waymo_vp9_opus.mpd&playbackRate=1.5');
createManualTest(
    '2.0x',
    'Playback Rate',
    'https://ytlr-cert.appspot.com/demoplayer/2019/dash-player.html?manifest_url=assets/waymo_vp9_opus.mpd&playbackRate=2.0');
createManualTest(
    'Runtime Change',
    'Playback Rate',
    'https://ytlr-cert.appspot.com/demoplayer/2019/dash-player.html?manifest_url=assets/waymo_vp9_opus.mpd');


createManualTest(
    'Widevine',
    'DRM',
    createUrlwithRefererParam(
        'https://qual-e.appspot.com/wv_license_request.html'));
createManualTest(
    'DRM',
    'DRM',
    'https://ytlr-cert.appspot.com/demoplayer/2019/dash-player.html?manifest_url=assets/oops_cenc_pssh.mpd');
createManualTest(
    'Purchased Movie',
    'DRM',
    'https://www.youtube.com/tv?env_isVideoInfoVisible=1&v=MeFoUwes8nE');
createManualTest(
    'VP9 Subsample',
    'DRM',
    'https://ytlr-cert.appspot.com/demoplayer/2019/dash-player.html?manifest_url=assets/sintel_vp9_subsample.mpd');


createManualTest('WebP', 'WebP', 'manual/webp.html');
createManualTest('Animated WebP', 'WebP', 'manual/webp_animated.html');
createManualTest(
    'YouTube App with WebP',
    'WebP',
    'https://www.youtube.com/tv?env_supportsAnimatedWebp=true#/');


createManualTest(
    'Map-To-Mesh 720P',
    'Spherical - Cobalt',
    createUrlwithRefererParam('https://qual-e.appspot.com/mtm720.html'));
createManualTest(
    'Map-To-Mesh 1080P',
    'Spherical - Cobalt',
    createUrlwithRefererParam('https://qual-e.appspot.com/mtm1080.html'));
createManualTest(
    'Map-To-Mesh 1440P',
    'Spherical - Cobalt',
    createUrlwithRefererParam('https://qual-e.appspot.com/mtm1440.html'));
createManualTest(
    'Map-To-Mesh 2160P',
    'Spherical - Cobalt',
    createUrlwithRefererParam('https://qual-e.appspot.com/mtm2048.html'));

createManualTest(
    'WebGL VP9',
    'Spherical - Non-Cobalt',
    'https://ytlr-cert.appspot.com/demoplayer/2019/dash-player.html?manifest_url=assets/spherical_vp9.mpd&spherical=true&disableScreenSizeCheck=true');
createManualTest(
    'WebGL VP9 (OES Texture)',
    'Spherical - Non-Cobalt',
    'https://ytlr-cert.appspot.com/demoplayer/2019/dash-player.html?manifest_url=assets/spherical_vp9.mpd&sphericaloestexture=true&disableScreenSizeCheck=true');


createManualTest('Key Event', 'ETC', 'manual/key_event.html');
createManualTest(
    'Fetch API',
    'ETC',
    createUrlwithRefererParam('https://qual-e.appspot.com/fetch.html'));
createManualTest('Web Audio', 'ETC', 'manual/web_audio.html');
createManualTest('Cookie', 'ETC', 'manual/cookie.html');
createManualTest('Fonts', 'ETC', 'manual/fonts.html');
createManualTest('Localization', 'ETC', 'manual/localization.html');
createManualTest(
    'Page Visibility API',
    'ETC',
    createUrlwithRefererParam(
        'https://qual-e.appspot.com/application-lifecycle.html'));


return {tests: tests, info: info, fields: fields, viewType: 'default'};
};

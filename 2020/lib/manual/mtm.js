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

var degreesPerSecond = 90;
// The following mappings are done in this order:
// Up, Down, Left, Right

// Direction keys
camera3D.createKeyMapping(38, camera3D.DOM_CAMERA_PITCH, degreesPerSecond);
camera3D.createKeyMapping(40, camera3D.DOM_CAMERA_PITCH, -degreesPerSecond);
camera3D.createKeyMapping(37, camera3D.DOM_CAMERA_YAW, degreesPerSecond);
camera3D.createKeyMapping(39, camera3D.DOM_CAMERA_YAW, -degreesPerSecond);

// DPAD
camera3D.createKeyMapping(0x800C, camera3D.DOM_CAMERA_PITCH, degreesPerSecond);
camera3D.createKeyMapping(0x800D, camera3D.DOM_CAMERA_PITCH, -degreesPerSecond);
camera3D.createKeyMapping(0x800E, camera3D.DOM_CAMERA_YAW, degreesPerSecond);
camera3D.createKeyMapping(0x800F, camera3D.DOM_CAMERA_YAW, -degreesPerSecond);

// Left joystick
camera3D.createKeyMapping(0x8011, camera3D.DOM_CAMERA_PITCH, degreesPerSecond);
camera3D.createKeyMapping(0x8012, camera3D.DOM_CAMERA_PITCH, -degreesPerSecond);
camera3D.createKeyMapping(0x8013, camera3D.DOM_CAMERA_YAW, degreesPerSecond);
camera3D.createKeyMapping(0x8014, camera3D.DOM_CAMERA_YAW, -degreesPerSecond);

// Right joystick
camera3D.createKeyMapping(0x8015, camera3D.DOM_CAMERA_PITCH, degreesPerSecond);
camera3D.createKeyMapping(0x8016, camera3D.DOM_CAMERA_PITCH, -degreesPerSecond);
camera3D.createKeyMapping(0x8017, camera3D.DOM_CAMERA_YAW, degreesPerSecond);
camera3D.createKeyMapping(0x8018, camera3D.DOM_CAMERA_YAW, -degreesPerSecond);

// Update the frame rate counter at a regular interval.
function UpdateFPS() {
  if ('h5vcc' in window && 'cVal' in window.h5vcc) {
    // Query Cobalt for the average amount of time between the start of
    // each frame.  Translate that into a framerate and then update a
    // framerate counter on the window.
    var average_frame_time_in_us =
        window.h5vcc.cVal.getValue('Renderer.Rasterize.DurationInterval.Avg');
    if (!average_frame_time_in_us || average_frame_time_in_us <= 0) {
      // In older versions of Cobalt use a different name for the framerate
      // counter, so try falling back to that if the first fails.
      average_frame_time_in_us =
          window.h5vcc.cVal.getValue('Renderer.Rasterize.Duration.Avg');
    }

    if (average_frame_time_in_us && average_frame_time_in_us > 0) {
      // Convert frame time into frame rate (by taking the inverse).
      // We also multiply by 1000000 to convert from microseconds to
      // seconds.
      var average_frames_per_second =
          Math.round(1000000.0 / average_frame_time_in_us);

      // Update the display with our calculated frame rate.
      var fps_counter = document.getElementById('fps');
      fps_counter.innerHTML = 'FPS: ' + average_frames_per_second;
    }
  }
}
window.setInterval(UpdateFPS, 1000);

document.addEventListener('keyup', function(event) {
  pushBackKeyToReturnManualPage(event);
});

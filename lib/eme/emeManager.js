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

goog.require('proto.yts_eme.LicenseRequest');

var EMEHandler = function() {};

EMEHandler.prototype.init = function(video, licenseManager) {
  this.video = video;
  this.licenseManager = licenseManager;
  this.keySystem = licenseManager.keySystem;
  this.keyUnusable = false;
  this.keyCount = 0;
  this.keySessions = [];
  this.licenseDelay = 10; // In milliseconds.
  this.messageEncrypted = false;
  this.serverCertificateRequested = false;
  this.setServerCertificateResult = '';
  this.certificateSrc;

  video.addEventListener('encrypted', this.onEncrypted.bind(this));

  return this;
};

EMEHandler.prototype.setCertificateSrc = function(cert) {
  this.certificateSrc = cert;
}

EMEHandler.prototype.addEventSpies = function(eventSpies) {
  for (var spy in eventSpies) {
    this['_' + spy] = this[spy];
    this[spy] = eventSpies[spy];
  }
};

/** @return Promise */
EMEHandler.prototype.checkKeySystem = function() {
  if (typeof navigator.requestMediaKeySystemAccess != 'function') {
    return new Promise((resolve, reject) => {
      reject('requestMediaKeySystemAccess is not defined (requires HTTPS)');
    });
  }
  var config = this.licenseManager.makeKeySystemConfig();
  return navigator.requestMediaKeySystemAccess(this.keySystem, config);
};

/**
 * Default callback for onEncrypted event from EME system.
 * @param {Event} e Event passed in by the EME system.
 */
EMEHandler.prototype.onEncrypted = function(event) {
  if (!this.keySystem) {
    throw 'Not initialized! Bad manifest parse?';
  }
  dlog(2, 'onEncrypted()');
  var self = this;
  var initData = this.licenseManager.getExternalPSSH();
  if (!initData) {
    initData = event.initData;
  }
  var initDataType = event.initDataType
  var video = event.target;

  this.checkKeySystem().then(function(keySystemAccess) {
    keySystemAccess.createMediaKeys().then(
      function(createdMediaKeys) {
        var mediaKeys = video.mediaKeys;
        if (!mediaKeys) {
          video.setMediaKeys(createdMediaKeys);
          mediaKeys = createdMediaKeys;
        }
        if (self.certificateSrc) {
          if (createdMediaKeys.setServerCertificate) {
            self.setServerCertificate(createdMediaKeys, self.certificateSrc);
          } else {
            self.setServerCertificateResult =
              'setServerCertificate() is not supported';
          }
        }
        var keySession = mediaKeys.createSession();
        keySession.addEventListener(
          'message', self.onMessage.bind(self), false);
        keySession.addEventListener(
          'keystatuseschange', self.onKeyStatusesChange.bind(self), false);
        keySession.generateRequest(initDataType, initData);
        self.keySessions.push(keySession);
      }
    );
  }).catch(function(error) {
    dlog(2, 'error requesting media keys system access');
  });
};

/**
 * Sends HTTP request to get the certification and apply it to
 * setServerCertificate.
 */
EMEHandler.prototype.setServerCertificate = function(mediaKeys, cert) {
  dlog(2, 'setServerCertificate()');
  var self = this;
  var xhr = new XMLHttpRequest();
  xhr.open('GET', cert);
  xhr.addEventListener('readystatechange', function(evt) {
    if (evt.target.readyState != 4) {
      return;
    }
    var responseStatus = evt.target.status;
    if (responseStatus < 200 || responseStatus > 299) {
      return;
    }
    mediaKeys.setServerCertificate(evt.target.response).then(
      (result) => {
        if (result != true) {
          self.setServerCertificateResult = `setServerCertificate failed`;
          dlog(2, self.setServerCertificateResult);
        }
      },
      (rejected) => {
        self.setServerCertificateResult =
            `setServerCertificate rejected ${rejected}`;
        dlog(2, self.setServerCertificateResult);
      });
  });
  xhr.responseType = 'arraybuffer';
  xhr.send();
}

/**
 * Default callback for onMessage event from EME system.
 * @param {Event} e Event passed in by the EME system.
 */
EMEHandler.prototype.onMessage = function(event) {
  dlog(2, 'onMessage()');

  var keySession = event.target;
  var message = event.message;
  var messageType = event.messageType;
  var licenseDelay = this.licenseDelay;

  var updateSession =  function(response) {
    setTimeout(function() {
      keySession.update(response).catch(() =>
          dlog(2, 'keySession.update failed'))
    }, licenseDelay);
  }
  if (messageType == 'individualization-request') {
    this.licenseManager.requestIndividualization(message, updateSession);
  } else if (messageType == 'license-request') {
    this.checkServerCertificateRequest(message);
    this.validateEncryptedMessage(message);
    this.licenseManager.acquireLicense(message, updateSession);
  } else {
    dlog(2, 'Unknown message:' + messageType);
  }
};

/**
 * Checks if the message is server certificate request.
 */
EMEHandler.prototype.checkServerCertificateRequest = function(message) {
  dlog(2, 'checkServerCertificateRequest()');
  var msg = proto.yts_eme.Message.deserializeBinary(message);
  if (msg.getId() == 4) {
    this.serverCertificateRequested = true;
  }
}

/**
 * Checks if the license request is encrypted.
 */
EMEHandler.prototype.validateEncryptedMessage = function(message) {
  dlog(2, 'validateEncryptedMessage()');
  var msg = proto.yts_eme.Message.deserializeBinary(message);
  if (msg.getId() != 1) {
    return;
  }
  var licenseRequest =
      proto.yts_eme.LicenseRequest.deserializeBinary(msg.getMsg());
  if (!licenseRequest.hasRequestInfo() && licenseRequest.hasRequestId()) {
    this.messageEncrypted = true;
  }
}

/**
 * Default callback for keystatuseschange event from EME system.
 * @param {Event} event Event passed in by the EME system.
 */
EMEHandler.prototype.onKeyStatusesChange = function(event) {
  dlog(2, 'onKeyStatusesChange()');
  var self = this;
  event.target.keyStatuses.forEach(function(status, kid) {
    self.keyCount++;
    if (status != 'usable') {
      self.keyUnusable = true;
    }
  });
};

EMEHandler.prototype.closeAllKeySessions = function (cb) {
  if (this.keySessions === undefined) {
    cb();
    return;
  }
  var self = this;
  var closeAllSessions = function() {
    if (self.keySessions.length == 0) {
      cb();
      return;
    }

    dlog(2, 'Closing key session');
    var keySession = self.keySessions.pop();
    var promise = keySession.close();
    promise.then(closeAllSessions);
  };
  closeAllSessions();
};

try {
  exports.EMEHandler = EMEHandler;
} catch (e) {
  // do nothing, this function is not supposed to work for browser, but it's for
  // Node js to generate json file instead.
}

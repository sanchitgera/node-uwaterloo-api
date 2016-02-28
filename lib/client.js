'use strict';

var request = require('request');
var BASE_URL = 'https://api.uwaterloo.ca/v2';

function _isValid(key) {
  return !!key;
}

function UWClient(opts) {
  if (!(this instanceof UWClient)) {
    return new UWClient(opts);
  }

  if (!opts.API_KEY || !_isValid(opts.API_KEY)) {
    throw new err('Invalid API key provided');
  }

  this.apiKey = opts.API_KEY;
}

UWClient.prototype.get = function(path, params, cb) {
  this._makeRequest('get', path, params, cb);
};

UWClient._buildEndpoint = function(path) {
  var endpoint = BASE_URL;
  endpoint += (path.charAt(0) === '/') ? path : '/' + path;
  endpoint = endpoint.replace(/\/$/, "");
  endpoint += (path.split('.').pop() !== 'json') ? '.json' : '';
  return endpoint;
};

UWClient.prototype._makeRequest = function(method, path, params, cb) {
  if (typeof(params) === 'function') {
    cb = params;
    params = {};
  }
  var endpoint = UWClient._buildEndpoint(path);
  request({
    method: method,
    url: endpoint,
    qs: {
      key: this.apiKey
    }
  }, function(err, response, data) {
    if (err) {
      cb(err, data, response);
    } else {
      try {
        data = JSON.parse(data);
      } catch (e) {
        cb(
          new Error('Status Code: ' + response.statusCode),
          data,
          response
        );
      }
      if (typeof data.errors !== 'undefined') {
        cb(data.errors, data, response);
      } else if (response.statusCode !== 200) {
        cb(
          new Error('Status Code: ' + response.statusCode),
          data,
          response
        );
      } else {
        cb(null, data, response);
      }
    }
  });
};

module.exports = UWClient;

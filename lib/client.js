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
    throw new Error('Invalid API key provided');
  }

  this.apiKey = opts.API_KEY;
}

UWClient.prototype.get = function(path, params, cb) {
  this._makeRequest('get', path, params, cb);
};

UWClient.prototype._buildEndpoint = function(path, params) {
  var endpoint = BASE_URL;

  var foundParams = path.match(/\{.*?\}/g);
  if (foundParams) {
    foundParams = foundParams.map(function(match) {
      return match.slice(1, -1);
    });

    foundParams.forEach(function(param) {
      var p = params[param];
      if(!p) {
        // Malformed query
      }

      path = path.replace('{' + param + '}', p);
      delete params[param];
    });
  }

  endpoint += (path.charAt(0) === '/') ? path : '/' + path;
  endpoint = endpoint.replace(/\/$/, "");
  endpoint += (path.split('.').pop() !== 'json') ? '.json' : '';

  return {
    url: endpoint,
    params: params
  };

};

UWClient.prototype._makeRequest = function(method, path, params, cb) {
  if (typeof(params) === 'function') {
    cb = params;
    params = {};
  }
  params.key = this.apiKey;

  var endpoint = this._buildEndpoint(path, params);

  request({
    method: method,
    url: endpoint.url,
    qs: endpoint.params
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

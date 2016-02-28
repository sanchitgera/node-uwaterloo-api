'use strict';

var url = require('url');
var request = require('request');
var BASE_URL = 'https://api.uwaterloo.ca/v2/';

function _isValid(key) {
  return !!key;
}

function UWClient(opts) {
  if (!(this instanceof UWClient)) {
    return new UWClient(opts);
  }

  if(!opts.API_KEY || !_isValid(opts.API_KEY)) {
    throw new Error('Invalid API key provided');
  }

  this.apiKey = opts.API_KEY;
}

UWClient.prototype.get = function(path, params, cb) {
  this._makeRequest('get', path, params, cb);
};

UWClient.prototype._makeRequest = function(method, path, params, cb) {
  var endpoint = url.resolve(BASE_URL, path);
  endpoint += '?key=' + this.apiKey;
  request({
    method : method,
    uri : endpoint
  }, function(err, res) {
    cb(err, res);
  });
};

module.exports = UWClient;

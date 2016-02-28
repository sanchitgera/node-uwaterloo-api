'use strict';

var should = require('should');
var api = require('../lib/client');
var client;

describe('Initializing API Client', function() {
  it('Throws an error with empty API key', function(done) {
    should(function() {
      client = new api({
        API_KEY : ''
      });
    }).throw();
    done();
  });

  it('Creates a client with a valid key', function(done) {
    should(function() {
      client = new api({
        API_KEY : process.env.uwApiToken
      });
    }).not.throw();
    done();
  });
});

describe('Queries', function() {
  it('GETS foodservices/menu endpoint successfully', function(done) {
    client.get('/foodservices/menu', function(err, res) {
      should.equal(err, null);
      res.should.have.property('meta');
      res.meta.status.should.eql(200);
      res.should.have.property('data');
      done();
    });
  });

  it('GETS feds/event endpoint', function(done) {
    client.get('/feds/events', function(err, res) {
      should.equal(err, null);
      res.should.have.property('meta');
      res.meta.status.should.eql(200);
      res.should.have.property('data');
      done();
    });
  });

  it('Return an error for invalid requests', function(done) {
    client.get('/this/url/does/not/exist', function(err, res) {
      err.should.not.be.null;
      res.should.be.null;
      done();
    });
  });
});

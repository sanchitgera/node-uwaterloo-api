'use strict';

var should = require('should');
var api = require('../lib/client');
var client;

describe('Initializing API Client', function() {
  it('Throws an error with empty API key', function(done) {
    should(function() {
      client = new api({
        API_KEY: ''
      });
    }).throw();
    done();
  });

  it('Creates a client with a valid key', function(done) {
    should(function() {
      client = new api({
        API_KEY: process.env.uwApiToken
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

  it('Parses a single embedded URL parameter', function(done) {
    var u = client._buildEndpoint('site/{site_id}', {
      site_id: '323122',
      sample_param : 2322
    });

    u.url.should.equal('https://api.uwaterloo.ca/v2/site/323122.json');
    u.params.should.not.have.property('site_id');
    u.params.should.have.property('sample_param');

    done();
  });

  it('Parses multiple embedded URL parameters', function(done) {
    var u = client._buildEndpoint('/{property_1}/{property_2}/property_3', {
      property_1: 'test',
      property_2 : 'test'
    });

    u.url.should.equal('https://api.uwaterloo.ca/v2/test/test/property_3.json');
    u.params.should.not.have.property('property_1');
    u.params.should.not.have.property('property_2');

    done();
  });

  it('Requests a url with embedded params', function(done) {
    client.get('/foodservices/{year}/{week}/menu', {
      year : 2015,
      week : 5
    }, function(err, res) {
      res.meta.status.should.eql(200);
      done();
    });
  });
});

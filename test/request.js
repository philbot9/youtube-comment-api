var expect = require('chai').expect;
var request = require('../lib/request');
var getSessionToken = require('../lib/youtube-session');

describe('Request', function () {
  it('Should export an object', function () {
    expect(request).to.be.an('object');
  });

  it('Should have a function \'get\'', function () {
    expect(request.get).to.be.a('function');
  });

  it('Should have a function \'post\'', function () {
    expect(request.post).to.be.a('function');
  });

  it('Should have an object \'CookieJar\'', function () {
    expect(request.CookieJar).to.be.an('object');
  });

  it('function \'get\' should send a GET request', function () {
    this.timeout(30000);
    return request.get('https://www.youtube.com/all_comments?v=MfM7Y9Pcdzw').then(function (responseText) {
      expect(responseText).to.be.a('string');
      expect(responseText).to.have.length.above(1);
    });
  });

  it('function \'get\' should receive a cookie', function () {
    this.timeout(30000);
    return request.get('https://www.youtube.com/all_comments?v=MfM7Y9Pcdzw').then(function (res) {
      expect(request.CookieJar).to.have.a.property('_jar')
        .which.has.a.property('store')
        .which.has.a.property('idx')
        .which.has.a.property('youtube.com')
        .which.is.an('object');
    });
  });

  it('should remember the cookie', function () {
    expect(request.CookieJar).to.have.a.property('_jar')
      .which.has.a.property('store')
      .which.has.a.property('idx')
      .which.has.a.property('youtube.com')
      .which.is.an('object');
  });

  it('function \'post\' should send a POST request', function () {
    this.timeout(30000);
    return getSessionToken('MfM7Y9Pcdzw').then(function (sessionToken) {
      return request.post('https://www.youtube.com/comment_ajax?action_load_comments=1&order_by_time=True&filter=MfM7Y9Pcdzw', {
        'session_token': sessionToken,
        'video_id': 'MfM7Y9Pcdzw'
      }).then(function (responseText) {
        expect(responseText).to.be.a('string');
        expect(responseText).to.have.length.above(1);
      });
    });
  });
});

var expect = require('chai').expect;
var getSessionToken = require('../lib/youtube-session.js');
describe('Youtube Session', function () {
  it('should export a function', function () {
    expect(getSessionToken).to.be.a('function');
  });

  it('should get a session token', function () {
    this.timeout(30000);
    return getSessionToken('eKEwL-10s7E').then(function (sessionToken) {
      expect(sessionToken).to.be.a('string');
      expect(sessionToken).to.have.length.above(1);
    });
  });

  it('should remember a session token', function () {
    this.timeout(30000);
    return getSessionToken('eKEwL-10s7E').then(function (sessionToken1) {
      return getSessionToken('eKEwL-10s7E').then(function (sessionToken2) {
        expect(sessionToken1).to.equal(sessionToken2);
      });
    });
  });
});

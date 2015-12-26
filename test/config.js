var expect = require('chai').expect;
var cheerio = require('cheerio');

describe('Configuration', function () {
  
  it('should export a function', function () {
    expect(require('../lib/config')).to.be.a('function');
  });
  
  it('should throw an error for invalid arguments', function () {
    var config = require('../lib/config');
    expect(function () { config('stuff') }).to.throw(Error);
  });
  
  it('should have default configuration values', function () {
    var config = require('../lib/config');
    expect(config()).to.deep.equal({
      includeReplies: true,
      includeVideoInfo: true,
      fetchRetries: 3,
      sessionTimeout: 60 * 30,
      cacheDuration: 60 * 30,
      cacheInterval: 60 * 5
    });
  });
  
  it('should retain new configuration values', function () {
    var config = require('../lib/config');
    config({sessionTimeout: 60 * 60, includeReplies: false, includeVideoInfo: true})
    expect(config()).to.deep.equal({
      includeReplies: false,
      includeVideoInfo: true,
      fetchRetries: 3,
      sessionTimeout: 60 * 60,
      cacheDuration: 60 * 30,
      cacheInterval: 60 * 5
    });
  });
    
  it('should retain old configuration values', function () {
    var config = require('../lib/config');
    config({sessionTimeout: 60 * 90});
    config({cacheDuration: 60 * 90, includeReplies: true, includeVideoInfo: false, fetchRetries: 4});
    
    expect(config()).to.deep.equal({
      includeReplies: true,
      includeVideoInfo: false,
      fetchRetries: 4,
      sessionTimeout: 60 * 90,
      cacheDuration: 60 * 90,
      cacheInterval: 60 * 5
    });
  });
  
  it('should retain configuration values across instances', function () {
    var config = require('../lib/config');
    config({
      includeReplies: true,
      includeVideoInfo: true,
      fetchRetries: 3,
      sessionTimeout: 60 * 90,
      cacheDuration: 60 * 90
    });
    
    expect(require('../lib/config')()).to.deep.equal({
      includeReplies: true,
      includeVideoInfo: true,
      fetchRetries: 3,
      sessionTimeout: 60 * 90,
      cacheDuration: 60 * 90,
      cacheInterval: 60 * 5
    });
  });
  
});

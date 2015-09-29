var expect = require('chai').expect;
var cheerio = require('cheerio');
var getCommentCount = require('../lib/comment-count');
describe('Comment Count', function () {
  it('should export a function', function () {
    expect(require('../lib/comment-count')).to.be.a('function');
  });

  it('should fetch the comment count', function (done) {
    this.timeout(10000);
    getCommentCount('eKEwL-10s7E').then(function (commentCount) {
      expect(commentCount).to.be.a('number');
      expect(commentCount).to.be.above(0);
      done();
    });
  });
});

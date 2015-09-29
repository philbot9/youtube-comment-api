var expect = require('chai').expect;
var cheerio = require('cheerio');
var fetchCommentsPage = require('../lib/comment-fetcher.js');

describe('Comment API', function () {
  it('should export a function', function () {
    expect(require('../lib/comment-fetcher.js')).to.be.a('function');
  });

  it('should throw an error if no video ID is provided', function () {
    expect(fetchCommentsPage).to.throw(Error);
    expect(function () {
      fetchCommentsPage(null, 'abc');
    }).to.throw(Error);
  });

  it('should give an error (400) for an invalid video ID', function (done) {
    this.timeout(20000);
    fetchCommentsPage('fakeID', null).then(function (page) {
      expect(page).not.to.exist;
      done();
    }).catch(function (error) {
      expect(error).to.exist;
      expect(error).to.have.a.property('status', 400);
      done();
    });
  });

  it('should get a comments page without a page token', function (done) {
    this.timeout(20000);
    fetchCommentsPage('eKEwL-10s7E', null).then(function (page) {
      expect(page).to.have.a.property('html');
      expect(page.html).to.be.a('string');
      expect(page.html).to.have.length.above(1);
      expect(page).to.have.a.property('nextPageToken');
      expect(page.nextPageToken).to.be.a('string');
      expect(page.nextPageToken).to.have.length.above(1);
      done();
    });
  });

  it('should get a different comments page with a page token', function (done) {
    this.timeout(20000);
    fetchCommentsPage('eKEwL-10s7E', null).then(function (page1) {
      fetchCommentsPage('eKEwL-10s7E', page1.nextPageToken).then(function (page2) {
        expect(page1.html).to.not.equal(page2.html);
        expect(page1.nextPageToken).to.not.equal(page2.nextPageToken);
        expect(page1).to.have.a.property('html');
        expect(page1.html).to.be.a('string');
        expect(page1.html).to.have.length.above(1);
        done();
      });
    });
  });

  it('should return valid HTML for comments', function (done) {
    this.timeout(20000);
    fetchCommentsPage('eKEwL-10s7E', null).then(function (page) {
      var $ = cheerio.load(page.html);
      expect($('.comment-item')).to.have.a.property('0');
      done();
    });
  });

  it('should return different videos\' comments', function (done) {
    this.timeout(20000);
    fetchCommentsPage('eKEwL-10s7E', null).then(function (page1) {
      expect(page1.html).to.exist;
      expect(page1.html).to.be.a('string');

      fetchCommentsPage('pkwOrteyQtY', null).then(function (page2) {
        expect(page2.html).to.exist;
        expect(page2.html).to.be.a('string');
        expect(page1.html).to.not.equal(page2.html);
        expect(page1.nextPgeToken).to.not.equal(page2.nextPageToken);
        done();
      });
    });
  });
});

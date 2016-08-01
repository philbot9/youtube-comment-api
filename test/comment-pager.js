var expect = require('chai').expect;
var getCommentsPage = require('../lib/comment-pager.js');

describe('Comment Pager', function () {
  it('should export a function', function () {
    expect(require('../lib/comment-pager.js')).to.be.a('function');
  });

  it('should throw an error if no video ID is provided', function () {
    expect(getCommentsPage).to.throw(Error);
    expect(function () {
      getCommentsPage(null, null);
    }).to.throw(Error);
  });

  it('should give an error for an invalid video ID', function () {
    this.timeout(180000);
    return getCommentsPage('fakeID', null).then(function (page) {
      expect(page).not.to.exist;
    }).catch(function (error) {
      expect(error).to.exist;
    });
  });

  it('should get a comments page without a page token', function () {
    this.timeout(180000);
    return getCommentsPage('pkwOrteyQtY', null).then(function (page) {
      expect(page).to.have.a.property('comments').that.is.an('array');
      expect(page.comments).to.have.length.above(1);
      expect(page).to.have.a.property('nextPageToken').that.is.a('string');
      expect(page.nextPageToken).to.have.length.above(5);

      page.comments.forEach(function (c) {
        expect(c).to.have.a.property('id').that.is.a('string');
        expect(c).to.have.a.property('user').that.is.a('string');
        expect(c).to.have.a.property('date').that.is.a('string');
        expect(c).to.have.a.property('timestamp').that.is.a('number');
        expect(c).to.have.a.property('commentText').that.is.a('string');
        expect(c).to.have.a.property('likes').that.is.a('number');
        expect(c).to.have.a.property('hasReplies').that.is.a('boolean');
        if (c.hasReplies) {
          expect(c).to.have.a.property('replies').that.is.an('array');
          expect(c.replies).to.have.length.above(0);
        }
      });
    });
  });

  it('should get a different comments page with a page token', function () {
    this.timeout(180000);
    return getCommentsPage('pkwOrteyQtY', null).then(function (page1) {
      return getCommentsPage('pkwOrteyQtY', page1.nextPageToken).then(function (page2) {
        expect(page1).to.not.deep.equal(page2);
        expect(page2).to.have.a.property('comments').that.is.an('array');
        expect(page2.comments).to.have.length.above(1);
        expect(page2).to.have.a.property('nextPageToken').that.is.a('string');
        expect(page2.nextPageToken).to.have.length.above(5);

        page2.comments.forEach(function (c) {
          expect(c).to.have.a.property('id').that.is.a('string');
          expect(c).to.have.a.property('user').that.is.a('string');
          expect(c).to.have.a.property('date').that.is.a('string');
          expect(c).to.have.a.property('timestamp').that.is.a('number');
          expect(c).to.have.a.property('commentText').that.is.a('string');
          expect(c).to.have.a.property('likes').that.is.a('number');
          expect(c).to.have.a.property('hasReplies').that.is.a('boolean');
          if (c.hasReplies) {
            expect(c).to.have.a.property('replies').that.is.an('array');
            expect(c.replies).to.have.length.above(0);
          }
        });

      });
    });
  });

  it('should include video information', function () {
    this.timeout(180000);
    return getCommentsPage('pkwOrteyQtY', null).then(function (page) {
      expect(page).to.exist;
      expect(page).to.have.a.property('videoCommentCount').that.is.a('number');
      expect(page.videoCommentCount).to.be.above(0);
      expect(page).to.have.a.property('videoTitle').that.is.a('string');
      expect(page.videoTitle.length).to.be.above(0);
      expect(page).to.have.a.property('videoThumbnail').that.is.a('string');
      expect(page.videoThumbnail.length).to.be.above(0);
    });
  });
});

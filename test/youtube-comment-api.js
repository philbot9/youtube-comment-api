var expect = require('chai').expect;
var fetchCommentPage = require('../index');

describe('YouTube Comment API', function () {
  it('should export a function', function () {
    expect(require('../index')).to.be.a('function');
  });

  it('should support callback functions', function () {
    this.timeout(60000);
    return fetchCommentPage('pkwOrteyQtY', function (err, page) {
      expect(err).not.to.exist;
      expect(page).to.exist;
      expect(page).to.have.a.property('videoTitle').which.is.a('string');
      expect(page).to.have.a.property('comments').which.is.a('array');
      expect(page.comments).to.have.length.above(0);
    });
  });

  it('should return errors for callback functions', function () {
    this.timeout(60000);
    return fetchCommentPage('fakeID', function (err, page) {
      expect(err).to.exist;
      expect(page).not.to.exist;
    });
  });

  it('should support promises', function () {
    this.timeout(60000);
    return fetchCommentPage('pkwOrteyQtY').then(function (page) {
      expect(page).to.exist;
      expect(page).to.have.a.property('videoTitle').which.is.a('string');
      expect(page).to.have.a.property('comments').which.is.a('array');
      expect(page.comments).to.have.length.above(0);
    });
  });

  it('should return errors for promises', function () {
    this.timeout(60000);
    return fetchCommentPage('fakeID').catch(function(err) {
      expect(err).to.exist;
    });
  });

  it('should throw an error if no video ID is provided', function () {
    expect(fetchCommentPage).to.throw(Error);
    expect(function () {
      fetchCommentPage(null);
    }).to.throw(Error);
  });

  it('should get a comments page without a page token', function () {
    this.timeout(60000);
    return fetchCommentPage('pkwOrteyQtY').then(function (page) {
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
    this.timeout(60000);
    return fetchCommentPage('pkwOrteyQtY', null).then(function (page1) {
      fetchCommentPage('pkwOrteyQtY', page1.nextPageToken).then(function (page2) {
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

  it('should get a different comments page with a page token using callbacks', function () {
    this.timeout(120000);
    return fetchCommentPage('pkwOrteyQtY', function (err, page1) {
      return fetchCommentPage('pkwOrteyQtY', page1.nextPageToken, function (err, page2) {
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
    this.timeout(60000);
    return fetchCommentPage('pkwOrteyQtY', null).then(function (page) {
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

var _ = require('lodash');
var getCommentPage = require('lib/comment-pager');

module.exports = function (videoID, pageToken, cb) {
  var useCallback = cb && _.isFunction(cb);
  if (!videoID) {
    var e = new Error('Cannot fetch comment page. No videoID provided.');
    if (useCallback) {
      return cb(e);
    }
    throw e;
  }
  getCommentPage(videoID, pageToken).then(function (page) {
    if (!page) {
      var e = new Error('Error fetching comment page from YouTube.');
      if (useCallback) {
        return cb(e);
      }
      throw e;
    }

    var commentPage = {
      pageToken: pageToken,
      nextPageToken: page.nextPageToken,
      videoCommentCount: page.videoCommentCount,
      comments: page.comments
    };

    if (useCallback) {
      return cb(null, commentPage);
    }
    return commentPage;
  });
};

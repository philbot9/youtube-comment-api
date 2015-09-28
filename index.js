var getCommentPage = require('lib/comment-pager');

module.exports = function(videoID, pageToken, cb) {
  if (!videoID) {
    throw new Error('Cannot fetch comment page. No videoID provided.');
  }

  getCommentPage(videoID, pageToken).then(function(page) {
    if (!page) {
      throw new Error('Error fetching comment page from YouTube.');
    }

    return {
      pageToken: req.body.pageToken,
      nextPageToken: page.nextPageToken,
      videoCommentCount: page.videoCommentCount,
      comments: page.comments
    };
  });
};

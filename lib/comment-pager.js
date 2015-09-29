var Promise = require('native-promise-only');
var debug = require('debug')('comment-pager');

var getCommentsPage = require('./comment-api');
var getCommentReplies = require('./replies-api');
var getCommentCount = require('./comment-count');
var parseComments = require('./comment-parser');

var videoID;

module.exports = function (vidID, pageToken, cb) {
  if (!vidID) {
    throw new Error('No video ID specified.');
  }
  videoID = vidID;
  return fetchPage(pageToken).then(fetchReplies).then(fetchCommentCount);
};

function fetchPage(pageToken) {
  debug('Fetching comment page for "%s" with Page Token "%s"', videoID, pageToken);
  return getCommentsPage(videoID, pageToken).then(function (response) {
    if (!response) {
      throw new Error('Did not receive a response from the comment-api');
    }

    return {
      comments: parseComments(response.html).comments,
      nextPageToken: response.nextPageToken
    };
  });
}
function fetchReplies(page) {
  debug('Fetching replies');
  return page.comments.reduce(function (previous, comment) {
    if (comment.hasReplies) {
      return previous.then(function () {
        return fetchCommentReplies(comment);
      });
    } else {
      return previous.then(function () {
        return comment;
      });
    }
  }, new Promise(function (res) {
    res();
  })).then(function () {
    return page;
  });
}

function fetchCommentReplies(comment) {
  return getCommentReplies(videoID, comment.id).then(function (replies) {
    var repliesArr = parseComments(replies.html, { includeReplies: true }).comments;
    if (!repliesArr || !repliesArr.length) {
      return comment;
    }
    comment.numberOfReplies = repliesArr ? repliesArr.length : 0;
    comment.replies = repliesArr;
    return comment;
  });
}

function fetchCommentCount(page) {
  return getCommentCount(videoID).then(function (commentCount) {
    page.videoCommentCount = commentCount;
    return page;
  });
}

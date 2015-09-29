var Promise = require('native-promise-only');
var debug = require('debug')('comment-pager');

var fetchCommentsPage = require('./comment-fetcher');
var fetchCommentReplies = require('./replies-fetcher');
var fetchCommentCount = require('./comment-count');
var parseComments = require('./comment-parser');

var videoID;

module.exports = function (vidID, pageToken, cb) {
  if (!vidID) {
    throw new Error('No video ID specified.');
  }
  videoID = vidID;
  return getPage(pageToken).then(getReplies).then(getCommentCount);
};

function getPage(pageToken) {
  debug('Fetching comment page for "%s" with Page Token "%s"', videoID, pageToken);
  return fetchCommentsPage(videoID, pageToken).then(function (response) {
    if (!response) {
      throw new Error('Did not receive a response from the comment-fetcher');
    }
    return {
      comments: parseComments(response.html).comments,
      nextPageToken: response.nextPageToken
    };
  });
}

function getReplies(page) {
  debug('Fetching replies');
  return page.comments.reduce(function (previous, comment) {
    if (comment.hasReplies) {
      return previous.then(function () {
        return getCommentReplies(comment);
      });
    } else {
      return previous.then(function () {
        return comment;
      });
    }
  }, Promise.resolve()).then(function () {
    return page;
  });
}

function getCommentReplies(comment) {
  return fetchCommentReplies(videoID, comment.id).then(function (replies) {
    var repliesArr = parseComments(replies.html, { includeReplies: true }).comments;
    if (!repliesArr || !repliesArr.length) {
      return comment;
    }
    comment.numberOfReplies = repliesArr ? repliesArr.length : 0;
    comment.replies = repliesArr;
    return comment;
  });
}

function getCommentCount(page) {
  return fetchCommentCount(videoID).then(function (commentCount) {
    page.videoCommentCount = commentCount;
    return page;
  });
}

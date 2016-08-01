var Promise = require('native-promise-only')
var debug = require('debug')('comment-pager')
var _ = require('lodash')

var fetchCommentsPage = require('./comment-fetcher')
var fetchCommentReplies = require('./replies-fetcher')
var fetchVideoInfo = require('./video-info')
var parseComments = require('./comment-parser')
var config = require('./config')

module.exports = function (videoID, pageToken, cb) {
  if (!videoID) {
    throw new Error('No video ID specified.')
  }
  debug('Fetching comment page')
  return fetchCommentsPage(videoID, pageToken).then(function (response) {
    if (!response) {
      throw new Error('No comment page received')
    }
    debug('Parsing comment page')
    return {
      comments: parseComments(response.html),
      nextPageToken: response.nextPageToken
    }
  }).then(function (commentsPage) {
    if (!config().includeReplies) {
      debug('Replies not required.')
      return commentsPage
    }

    debug('Fetching replies')
    return commentsPage.comments.reduce(function (previous, comment) {
      if (comment.hasReplies) {
        return previous.then(function () {
          return addReplies(videoID, comment)
        })
      } else {
        return previous.then(function () {
          return comment
        })
      }
    }, Promise.resolve()).then(function () {
      return commentsPage
    })
  }).then(function (commentsPage) {
    if (!config().includeVideoInfo) {
      debug('Video info not required.')
      return commentsPage
    }

    debug('Fetching video info')
    return fetchVideoInfo(videoID).then(function (videoInfo) {
      return _.defaults(commentsPage, videoInfo)
    })
  })
}

function addReplies (videoID, comment) {
  return fetchCommentReplies(videoID, comment.id).then(function (replies) {
    var repliesArr = parseComments(replies.html, { includeReplies: true })
    if (!repliesArr || !repliesArr.length) {
      return comment
    }
    comment.numberOfReplies = repliesArr ? repliesArr.length : 0
    comment.replies = repliesArr
    return comment
  })
}

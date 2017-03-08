var _ = require('lodash')
var debug = require('debug')('youtube-comment-api')

var config = require('./lib/config')
var getCommentPage = require('./lib/comment-pager')


console.error('WARNING: This module is deprecated. Please see https://github.com/philbot9/youtube-comment-api#deprecated for details. Pull requests welcome.')


module.exports = function (userConfig) {
  userConfig = userConfig || {}
  config(userConfig)
  return fetchCommentPage
}

var fetchCommentPage = function (videoID, pageToken, cb) {
  if (!cb && pageToken && _.isFunction(pageToken)) {
    cb = pageToken
    pageToken = null
  }

  var useCallback = !!cb && _.isFunction(cb)
  if (!videoID) {
    var e = new Error('Cannot fetch comment page. No video ID provided.')
    if (useCallback) {
      return cb(e)
    }
    throw e
  }

  var pendingPromise = getCommentPage(videoID, pageToken).then(function (page) {
    if (!page) {
      throw new Error('Error fetching comment page from YouTube.')
    }

    return _.defaults({
      pageToken: pageToken,
      nextPageToken: page.nextPageToken
    }, page)
  })

  if (useCallback) {
    pendingPromise.then(function (commentPage) {
      cb(null, commentPage)
    }).catch(function (err) {
      cb(err)
    })
    return
  }
  return pendingPromise
}

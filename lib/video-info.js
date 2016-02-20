var debug = require('debug')('video-info')
var fetchYoutubeVideoInfo = require('youtube-info')
var config = require('./config')
var _ = require('lodash')

var cache = {}

module.exports = function (videoID) {
  if (cache[videoID]) {
    debug('Using cached videoInfo %s', videoID)
    return Promise.resolve(cache[videoID].videoInfo)
  } else {
    return fetchYoutubeVideoInfo(videoID).then(function (youtubeVideoInfo) {
      var info = {
        videoCommentCount: youtubeVideoInfo.commentCount,
        videoTitle: youtubeVideoInfo.title,
        videoThumbnail: youtubeVideoInfo.thumbnailUrl
      }

      // cache the video info
      debug('Caching video info for %d seconds', config().cacheDuration)
      cache[videoID] = {
        videoInfo: info,
        expires: Date.now() + (config().cacheDuration * 1000)
      }

      return info
    })
  }
}

// check for expired cache entries
setInterval(cleanCache, config().cacheInterval * 1000)

function cleanCache () {
  debug('Cleaning cache')
  var now = Date.now()
  _.forIn(cache, function (values, videoID) {
    if (values.expires < now) {
      debug('Expired: %s', videoID)
      delete cache[videoID]
    }
  })
}

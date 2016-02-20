var debug = require('debug')('video-info')
var fetchYoutubeVideoInfo = require('youtube-info')
var config = require('./config')

var cache = {}
module.exports = function (videoID) {
  if (cache[videoID]) {
    if (cache[videoID].expires > Date.now()) {
      debug('Using cached videoInfo %s', videoID)
      return Promise.resolve(cache[videoID].videoInfo)
    }
    debug('Clearing cached video info for %s', videoID)
    delete cache[videoID]
  }

  return fetchYoutubeVideoInfo(videoID).then(function (youtubeVideoInfo) {
    var info = {
      videoCommentCount: youtubeVideoInfo.commentCount,
      videoTitle: youtubeVideoInfo.title,
      videoThumbnail: youtubeVideoInfo.thumbnailUrl
    }

    if (typeof config().cacheDuration === 'number') {
      // cache the video info
      debug('Caching video info for %d seconds', config().cacheDuration)
      cache[videoID] = {
        videoInfo: info,
        expires: Date.now() + (config().cacheDuration * 1000)
      }
    }

    return info
  })
}

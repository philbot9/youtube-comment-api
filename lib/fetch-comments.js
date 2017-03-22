var fetchComments = require('./youtube-comments-task-wrapper')

module.exports = function (videoId, pageToken) {
  return new Promise(function (resolve, reject) {
    if (!videoId) {
      reject('videoId parameter is required')
    }

    fetchComments(videoId, pageToken)
      .fork(reject, resolve)
  })
}

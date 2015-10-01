var cheerio = require('cheerio');
var Promise = require('native-promise-only');
var debug = require('debug')('video-info');
var _ = require('lodash');

var request = require('./request');

var YT_COMMENTS_URL = 'https://www.youtube.com/all_comments?v=';
var cache = {};

module.exports = function (videoID) {
  if (cache[videoID]) {
    debug('Using cached videoInfo %s', videoID);
    return Promise.resolve(cache[videoID].videoInfo);
  } else {
    debug('Fetching video info');
    return request.get(YT_COMMENTS_URL + videoID).then(function (responseText) {
      if(!responseText) {
        throw new Error('Fetching video info failed. Emtpy response.');
      }
      var $ = cheerio.load(responseText.trim());

      var videoTitle = $('.yt > a').text();
      videoTitle = videoTitle ? videoTitle.trim() : null;
      debug('Fetched video title %s', videoTitle);

      var commentCount = 0;
      var m = /\(([\d,]+)\)$/gi.exec($('.all-comments a').text().trim());
      if (m && m[1]) {
        commentCount = parseInt(m[1].replace(',', ''), 10);
      }
      debug('Fetched comment count %d', commentCount);

      var videoInfo = {
        videoCommentCount: commentCount,
        videoTitle: videoTitle,
        videoThumbnail: 'http://img.youtube.com/vi/' + videoID + '/0.jpg'
      }

      // cache the video info for 30 minutes
      cache[videoID] = {
        videoInfo: videoInfo,
        expires: Date.now() + (1000 * 60 * 30)
      };

      return videoInfo;
    });
  }
};

// check for expired cache entries
setInterval(cleanCache, 1000 * 60 * 5); // 5 minutes

function cleanCache() {
  debug('Cleaning cache');
  var now = Date.now();
  _.forIn(cache, function(values, videoID) {
    if(values.expires < now) {
      debug('Expired: %s', videoID);
      delete cache[videoID];
    }
  });
}

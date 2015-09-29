var cheerio = require('cheerio');
var Promise = require('native-promise-only');
var debug = require('debug')('comment-count');

var request = require('./request');

var YT_COMMENTS_URL = 'https://www.youtube.com/all_comments?v=';
var cached = {};

module.exports = function (videoID) {
  if (cached[videoID]) {
    debug('Using cached value %d', cached[videoID]);
    return new Promise(function (resolve, reject) {
      resolve(cached[videoID]);
    });
  } else {
    debug('Fetching count');
    return request.get(YT_COMMENTS_URL + videoID).then(function (responseText) {
      if(!responseText) {
        throw new Error('Fetching comment count failed. Emtpy response.');
      }
      var $ = cheerio.load(responseText.trim());
      var m = /\(([\d,]+)\)$/gi.exec($('.all-comments a').text().trim());
      if (!m || !m[1]) {
        throw new Error('Could not find number of comments on the page');
      }

      var commentCount = parseInt(m[1].replace(',', ''), 10);
      if (!commentCount || commentCount < 0) {
        throw new Error('Found an invalid comment count');
      }
      debug('Fetched comment count %d', commentCount);

      // cache the value for 30 minutes
      cached[videoID] = commentCount;
      setTimeout(function () {
        delete cached[videoID];
      }, 1000 * 60 * 30);

      return commentCount;
    });
  }
};

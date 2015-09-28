var cheerio = require('cheerio');
var Promise = require('bluebird');
var xhr = require('./xhr-helper');
var debug = require('debug')('comment-count');

var YT_COMMENTS_URL = "https://www.youtube.com/all_comments?v=";
var cached = {};

module.exports = function(videoID) {
	if(cached[videoID]) {
		debug('Using cached value %d', cached[videoID]);
    return new Promise(function(resolve, reject) {
			resolve(cached[videoID]);
		});
	} else {
		return xhr.get(YT_COMMENTS_URL + videoID).then(function(res) {
			debug('Fetching count');
      if(res.status !== 200 || !res.responseText) {
				var e = new Error('Unable to video page.');
				e.status = res.status;
				throw e;
			}
			
			var $ = cheerio.load(res.responseText.toString());
			var m = /\(([\d,]+)\)$/ig.exec($('.all-comments a').text().trim());
			if(!m || !m[1]) throw new Error('Could not find number of comments on the page');
			
      var commentCount = parseInt(m[1].replace(',', ''), 10);
      if(!commentCount || commentCount < 0) throw new Error('Found an invalid comment count');
      
      debug('Fetched comment count %d', commentCount);
      
      // cache the value for 30 minutes
      cached[videoID] = commentCount;
      setTimeout(function(){
        delete cached[videoID];
      }, 1000 * 60 * 30);
            
      return commentCount;
		});
	}
};
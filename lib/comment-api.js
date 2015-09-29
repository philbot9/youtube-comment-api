var debug = require('debug')('comment-api');
var xhr = require('./xhr-helper');
var requestSessionToken = require('./youtube-session');

var YT_AJAX_URL = 'https://www.youtube.com/comment_ajax?action_load_comments=1&order_by_time=True&filter=';
var MAX_ATTEMPTS = 3;
var numAttempts;

module.exports = function(videoID, pageToken) {
  if(!videoID) {
    throw new Error("No video ID provided.");
  }
  numAttempts = 0;
  return fetch(videoID, pageToken);
};

function fetch(videoID, pageToken) {
  return requestSessionToken(videoID).then(function(sessionToken) {
    var params = {
      'session_token': sessionToken
    };

    if(pageToken) {
      params['page_token'] = pageToken; // get a specific comment page
    } else {
      params['video_id'] = videoID; // get the first comment page
    }
    return params;
  })
  .then(function(params) {
    return xhr.post(YT_AJAX_URL + videoID, params);
  })
  .then(function(res) {
    if(!res) {
      throw new Error("Requesting comments utterly failed.");
    }
    debug('Received response: length %d, status %d', res.responseText.toString().length, res.status);
    if(res.status !== 200) {
      var e = new Error("Requesting comments failed.");
      e.status = res.status;
      throw e;
    }

    var commentsPage = {};
    try {
      var commentPageStr = res.responseText.toString().trim();
      commentsPage = JSON.parse(fixEscapeSequences(commentPageStr));
    } catch(e) {
      throw new Error("Error parsing Server response: " + e);
    }

    return {
      html: commentsPage.html_content,
      nextPageToken: commentsPage['page_token']
    };
  }).
  catch(function(error) {
    if(error.status && error.status !== 200) {
      if(numAttempts++ < MAX_ATTEMPTS) {
        debug('Error fetching comment page: %d Retrying...', error.status);
        return fetch(videoID, pageToken);
      }
    }
    throw error;
  });
}

// fix any invalid escape sequences in a JSON string
function fixEscapeSequences(str) {
  /*
   * Sometimes Youtube uses '\U' which should be '\u'. So try to replace
   * any invalid scape sequences with their lowercase versions.
   */
  var re = /[^\\](\\[^"\/\\bfnrtu])/g;
  return str.replace(re, function(m) {
    if(!re.test(m.toLowerCase()))
      return (m[0] + m.substring(1).toLowerCase());
    else
      return (m[0] + "");
  });
};

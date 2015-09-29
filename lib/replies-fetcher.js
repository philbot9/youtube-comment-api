var debug = require('debug')('replies-api');
var request = require('./request');
var initializeSession = require('./youtube-session');

var YT_AJAX_REPLY_URL = 'https://www.youtube.com/comment_ajax?action_load_replies=1&order_by_time=True&tab=inbox';
var MAX_ATTEMPTS = 3;
var numAttempts;

module.exports = function (videoID, commentID) {
  if (!videoID) {
    throw new Error('No video ID specified.');
  }
  if (!commentID) {
    throw new Error('No comment ID specified.');
  }
  numAttempts = 0;
  return fetch(videoID, commentID);
};

function fetch(videoID, commentID) {
  return initializeSession(videoID).then(function (sessionToken) {
    return {
      'session_token': sessionToken,
      'video_id': videoID,
      'comment_id': commentID
    };
  }).then(function (params) {
    return request.post(YT_AJAX_REPLY_URL, params);
  }).then(function (responseText) {
    if (!responseText) {
      throw new Error('Fetching replies failed, empty response.');
    }

    var replies;
    try {
      replies = JSON.parse(fixEscapeSequences(responseText.trim()));
    } catch (e) {
      throw new Error('Error parsing Server response: ' + e);
    }
    return { html: replies.html_content };
  }).catch(function (error) {
    debug('fetch failed: "%s", %d', error.message, error.status);
    if (error.status && error.status !== 200) {
      if (numAttempts++ < MAX_ATTEMPTS) {
        debug('Retry %d of %d', numAttempts, MAX_ATTEMPTS);
        return fetch(videoID, commentID);
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
  return str.replace(re, function (m) {
    if (!re.test(m.toLowerCase())) {
      return m[0] + m.substring(1).toLowerCase();
    } else {
      return m[0] + '';
    }
  });
}

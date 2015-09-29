var debug = require('debug')('comment-api');
var request = require('./request');
var initializeSession = require('./youtube-session');

var YT_AJAX_URL = 'https://www.youtube.com/comment_ajax?action_load_comments=1&order_by_time=True&filter=';
var MAX_ATTEMPTS = 3;
var numAttempts;

module.exports = function (videoID, pageToken) {
  if (!videoID) {
    throw new Error('No video ID provided.');
  }
  numAttempts = 0;
  return fetch(videoID, pageToken);
};

function fetch(videoID, pageToken) {
  return initializeSession(videoID).then(function (sessionToken) {
    var form = { 'session_token': sessionToken };
    if (pageToken) {
      form.page_token = pageToken;  // get a specific comment page
    } else {
      form.video_id = videoID;  // get the first comment page
    }
    return form;
  }).then(function (form) {
    return request.post(YT_AJAX_URL + videoID, form);
  }).then(function (responseText) {
    if (!responseText) {
      throw new Error('Fetching comments failed. Empty body.');
    }

    var commentsPage = {};
    try {
      commentsPage = JSON.parse(fixEscapeSequences(responseText.trim()));
    } catch (e) {
      throw new Error('Error parsing Server response: ' + e);
    }
    return {
      html: commentsPage.html_content,
      nextPageToken: commentsPage.page_token
    };
  }).catch(function (error) {
    debug('fetch failed: %s', error.message);
    if (numAttempts++ < MAX_ATTEMPTS) {
      debug('Retry %d of %d', numAttempts, MAX_ATTEMPTS);
      return fetch(videoID, pageToken);
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

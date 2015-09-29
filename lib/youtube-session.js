var Promise = require('native-promise-only');
var request = require('./request');

/*
 * IMPORTANT:
 * Youtube expects a session token AND a Cookie with each request.
 * The cookie is received when requesting the comment website (YT_COMMENTS_URL).
 */

module.exports = initializeSession;
var YT_COMMENTS_URL = 'https://www.youtube.com/all_comments?v=';
var sessionToken;

function initializeSession(videoID) {
  if (sessionToken) {
    return new Promise(function (resolve, reject) {
      resolve(sessionToken);
    });
  }
  return request.get(YT_COMMENTS_URL + videoID).then(function (responseText) {
    if(!responseText) {
      throw new Error('Fetching session token failed. Empty response from youtube.');
    }
    var re = /\'XSRF_TOKEN\'\s*\n*:\s*\n*"(.*)"/;
    var m = re.exec(responseText);
    if (!m || m.length <= 1) {
      throw new Error('Unable to find session token');
    }
    if (!request.CookieJar._jar.store) {
      throw new Error('No cookie received');
    }
    sessionToken = m[1],

    //set a timeout. The token or cookie will expire at some point
    setTimeout(function () {
      sessionToken = null;
    }, 1000 * 60 * 30);

    return sessionToken;
  });
}

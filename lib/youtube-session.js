var Promise = require('native-promise-only')
var request = require('./request')
var config = require('./config')

/*
 * IMPORTANT:
 * Youtube expects a session token AND a Cookie with each request.
 * The cookie is received when requesting the video site.
 */

var session = null
module.exports = function (videoID) {
  if (session && session.expires > Date.now()) {
    return Promise.resolve(session.token)
  }

  return request.get('https://www.youtube.com/watch?v=' + videoID).then(function (responseText) {
    if (!responseText) {
      throw new Error('Fetching session token failed. Empty response from youtube.')
    }

    var re = /\'XSRF_TOKEN\'\s*\n*:\s*\n*"(.*)"/
    var m = re.exec(responseText)
    if (!m || m.length <= 1) {
      throw new Error('Unable to find session token')
    }

    if (!request.CookieJar._jar.store) {
      throw new Error('No cookie received')
    }

    session = {
      token: m[1],
      expires: Date.now() + (config().sessionTimeout * 1000)
    }

    return session.token
  })
}

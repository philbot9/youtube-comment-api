var _ = require('lodash')

// if called with an argument, apply the userConf then return configuration
// if called without an argument just return the configuration

var configuration
module.exports = function (userConf) {
  if (userConf && !_.isObject(userConf)) {
    throw new Error('Configuration must be an object.')
  }

  if (!userConf && configuration) {
    return configuration
  }

  configuration = _.defaults({}, userConf, configuration, {
    includeReplies: true,
    includeVideoInfo: true,
    fetchRetries: 3,
    sessionTimeout: 60 * 30, // 30 minutes
    cacheDuration: 60 * 30 // 30 minutes
  })

  return configuration
}

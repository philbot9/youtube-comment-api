var expect = require('chai').expect
var td = require('testdouble')
var Task = require('data.task')
var clearRequire = require('clear-require')

describe('fetch-comments', function () {
  afterEach(function () {
    td.reset()
    clearRequire('../lib/fetch-comments')
  })

  it('exports a function', function () {
    var fetchComments = require('../lib/fetch-comments')
    expect(fetchComments).to.be.a('function')
  })

  it('function returns a promise', function () {
    var fetchComments = require('../lib/fetch-comments')
    const res = fetchComments().catch(function () {})
    expect(res).to.be.an.instanceof(Promise)
  })

  it('promise is rejected for missing videoId parameter', function () {
    var fetchComments = require('../lib/fetch-comments')
    return fetchComments()
      .then(function (x) {
        expect.fail('Should not resolve ' + x)
      })
      .catch(function (e) {
        expect(e).to.exist
      })
  })

  it('fetches a comment page without a pageToken', function () {
    var videoId = 'abc1234'
    var commentPage = { comment: 'page' }

    var fetchCommentsTask = td.replace('../lib/youtube-comments-task-wrapper')
    var fetchComments = require('../lib/fetch-comments')

    td.when(fetchCommentsTask(videoId), { ignoreExtraArgs: true })
      .thenReturn(Task.of(commentPage))

    return fetchComments(videoId)
      .then(function (p) {
        expect(p).to.deep.equal(commentPage)
      })
  })

  it('fetches a comment page with a pageToken', function () {
    var videoId = 'abc1234'
    var pageToken = 'pageToken'
    var commentPage = { comment: 'page2' }

    var fetchCommentsTask = td.replace('../lib/youtube-comments-task-wrapper')
    var fetchComments = require('../lib/fetch-comments')

    td.when(fetchCommentsTask(videoId, pageToken))
      .thenReturn(Task.of(commentPage))

    return fetchComments(videoId, pageToken)
      .then(function (p) {
        expect(p).to.deep.equal(commentPage)
      })
  })

  it('promise rejects if fetching comment page fails', function () {
    var videoId = 'abc1234'
    var expectedError = { error: 'here' }

    var fetchCommentsTask = td.replace('../lib/youtube-comments-task-wrapper')
    var fetchComments = require('../lib/fetch-comments')

    td.when(fetchCommentsTask(videoId), { ignoreExtraArgs: true })
      .thenReturn(Task.rejected(expectedError))

    return fetchComments(videoId)
      .then(function (p) {
        expect.fail('expected to fail ' + p)
      })
      .catch(function (e) {
        expect(e).to.deep.equal(expectedError)
      })
  })
})

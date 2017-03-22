var { expect } = require('chai')
var fetchComments = require('../lib/youtube-comments-task-wrapper')
var Task = require('data.task')

describe('youtube-comments-task-wrapper.js', function () {
  it('exports a function', function () {
    expect(fetchComments).to.be.a('function')
  })

  it('function returns a Task', function () {
    expect(fetchComments()).to.be.an.instanceof(Task)
  })
})

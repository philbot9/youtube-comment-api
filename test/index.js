var expect = require('chai').expect

describe('index.js', function () {
  it('exports a function', function () {
    var fetchComments = require('../index')
    expect(fetchComments).to.be.a('function')
  })

  it('function returns a promise', function () {
    var fetchComments = require('../index')
    const res = fetchComments().catch(function () {})
    expect(res).to.be.an.instanceof(Promise)
  })
})

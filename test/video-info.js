var expect = require('chai').expect
var cheerio = require('cheerio')
var fetchVideoInfo = require('../lib/video-info')

describe('Video Info', function () {
  it('should export a function', function () {
    expect(require('../lib/video-info')).to.be.a('function')
  })

  it('should fetch the video info', function () {
    this.timeout(30000)
    return fetchVideoInfo('eKEwL-10s7E').then(function (videoInfo) {
      expect(videoInfo).to.exist
      expect(videoInfo).to.have.a.property('videoCommentCount').that.is.a('number')
      expect(videoInfo.videoCommentCount).to.be.above(0)
      expect(videoInfo).to.have.a.property('videoTitle').that.is.a('string')
      expect(videoInfo.videoTitle.length).to.be.above(0)
      expect(videoInfo).to.have.a.property('videoThumbnail').that.is.a('string')
      expect(videoInfo.videoThumbnail.length).to.be.above(0)
    })
  })
})

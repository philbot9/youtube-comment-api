const fetchCommentPage = require('./index')
const videoId = 'h_tkIpwbsxY'

fetchCommentPage(videoId)
  .then(commentPage => {
    console.log(commentPage.comments)
    return fetchCommentPage(videoId, commentPage.nextPageToken)
  })
  .then(commentPage => {
    console.log(commentPage.comments)
  })

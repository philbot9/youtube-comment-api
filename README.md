# Youtube Comment API

[![Build Status](https://travis-ci.org/philbot9/youtube-comment-api.svg?branch=master)](https://travis-ci.org/philbot9/youtube-comment-api)

## Purpose

This package is a Promise wrapper for [youtube-comments-task](https://github.com/philbot9/youtube-comments-task) for anyone who wants to use Promises over Tasks.

## Usage

The module exports a single function:

`fetchComments(videoId[,pageToken])`

The function accepts the YouTube `videoId` and an optional `pageToken`, and returns a Promise that resolves to the corresponding page of comments. If the `pageToken` is not provided it fetches the first page of comments.

The result is an object with the following properties.

``` javascript
{
  comments: [ { comment }, { comment }, ... ],
  nextPageToken: 'nextpagetokenhere'
}
```

## Comment Data

```
{
  id: {{ comment id}},
  author: {{ comment author name }},
  authorLink: {{ comment author link (channel) }},
  authorThumb: {{ comment author avatar thumb url }},
  text: {{ comment text }},
  likes: {{ comment up-votes }},
  time: {{ how long ago the comment was posted (relative, e.g. '1 year ago') }},
  timestamp: {{ timestamp when comment was posted in milliseconds (absolute, e.g. 1457661439642 }},
  edited: {{ whether the comment was edited by the author (true/false) }},
  hasReplies: {{ whether the comment has replies (true/false) }},
  repliesToken: {{ token used to fetch replies for the comment }},
  numReplies: {{ number of replies }},
  replies: [ {{ reply objects (same fields as comments) }} ]
}
```

## Example

``` javascript
const fetchCommentPage = require('youtube-comment-api')
const videoId = 'h_tkIpwbsxY'

fetchCommentPage(videoId)
  .then(commentPage => {
    console.log(commentPage.comments)
    return fetchCommentPage(videoId, commentPage.nextPageToken)
  })
  .then(commentPage => {
    console.log(commentPage.comments)
  })
```

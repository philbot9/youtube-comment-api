# Youtube Comment API

**NOTE: Still a work in progress.**

## Purpose

[Node.js](https://nodejs.org/) API for the YouTube comment system. Scrapes comments and comment information from a given YouTube video on demand.

**This project is in no way affiliated with YouTube.**

## Installation

Install as a module via npm.

```bash
$ npm install youtube-comment-api
```

## Usage

`http//www.youtube.com/watch?v={videoID}`

``` javascript
var fetchCommentPage = require('youtube-comment-api');
fetchCommentPage(videoID, pageToken, cb);
```

| Parameter     | Meaning       |
| ------------- |---------------|
| videoID       | ID of youtube Video |
| pageToken     | (optional) token of page to be requested |
| callback      | (optional) callback function      |

### Promises API

``` javascript
var fetchCommentPage = require('youtube-comment-api');
// request first page of comments (most recent)
fetchCommentPage('{videoID}').then(function (commentPage) {
  console.log(commentPage);
  return commentPage.nextPageToken;
}).then(function (pageToken) {
  // request next page
  return fetchCommentPage('{videoID}', pageToken)
}).then(function (commentPage) {
  console.log(commentPage);
});
```

### Callback API

``` javascript
var fetchCommentPage = require('youtube-comment-api');
// request first page of comments (most recent)
fetchCommentPage('{videoID}', function (err, commentPage) {
  if (err) throw err;
  console.log(commentPage);
  // request next page
  fetchCommentPage('{videoID}', commentPage.nextPageToken, function(err, commentPage) {
    if (err) throw err;
    console.log(commentPage);
  });
});
```

## Result

``` json
{
  pageToken: {{ page token of current page }},
  nextPageToken: {{ page token of next page }},
  videoCommentCount: {{ number of comments on the video }},
  videoTitle: {{ video title }},
  videoThumbnail: {{ URL to video Thumbnail }},
  comments: [
	{
      id: {{ comment ID }},
      user: {{ username of author }},
      date: {{ how long ago the comment was posted }},
      commentText: {{ the comment }},
      timestamp: {{ timestamp based on date }},
      likes: {{ number of upvotes }},
      hasReplies: {{ whether this comment has replies }},
      numberOfReplies: {{ number of replies to the comment }},
      replies [
        {
          {{ ... same fields as comment }}
        },
        ...
      ],
      ...
    }
  ]
}

```

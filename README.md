# Youtube Comment API

[![Build Status](https://travis-ci.org/philbot9/youtube-comment-api.svg?branch=master)](https://travis-ci.org/philbot9/youtube-comment-api)

## Purpose

A Node.js API for the YouTube comment system. Scrapes comments and comment information from a given YouTube video on demand.

**This project is in no way affiliated with YouTube.**

## Installation

Install as a module via npm.

```bash
$ npm install youtube-comment-api
```

## Usage

`http//www.youtube.com/watch?v={videoID}`

``` javascript
var fetchCommentPage = require('youtube-comment-api')(config)
fetchCommentPage(videoID, pageToken, cb);
```

| Parameter     | Meaning       |
| ------------- |---------------|
| config        | (optional) module coniguration |
| videoID       | ID of youtube Video |
| pageToken     | (optional) token of page to be requested |
| callback      | (optional) callback function      |

### Promises API

``` javascript
var fetchCommentPage = require('youtube-comment-api')();
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
var fetchCommentPage = require('youtube-comment-api')();
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

### Configuration

Below are the possible configuration options and their default values.

```
var fetchCommentPage = require('youtube-comment-api')({
  includeReplies: true,
  includeVideoInfo: true,
  fetchRetries: 3,
  sessionTimeout: 60 * 30, // 30 minutes
  cacheDuration: 60 * 30 // 30 minutes
});
```

| Option              | Meaning       |
| ------------------- |---------------|
| includeReplies      | Fetch replies for each comment (default: true) |
| includeVideoInfo    | Fetch meta information about video (default: true) |
| fetchRetries        | The number of retries if a fetch fails (default: 3) |
| sessionTimeout      | Number of seconds after which the acquired session token expires. (default: 30 mins) |
| cacheDuration       | Number of seconds after which cached meta info expires. Set to false to disable caching. (default: 30 mins) |

## Result

```
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

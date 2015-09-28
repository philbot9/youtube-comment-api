var xhr = require('./xhr-helper');
var requestSessionToken = require('./youtube-session');

var YT_AJAX_REPLY_URL = "https://www.youtube.com/comment_ajax?action_load_replies=1&order_by_time=True&tab=inbox";
var MAX_ATTEMPTS = 3;
var numAttempts;

module.exports = function(videoID, commentID) {
  if(!videoID) throw new Error("No video ID specified.");
  if(!commentID) throw new Error("No comment ID specified.");

  numAttempts = 0;
  return fetch(videoID, commentID);
};

function fetch(videoID, commentID) {
  return requestSessionToken(videoID).then(function(sessionToken) {
    return {
      'session_token': sessionToken,
      'video_id': videoID,
      'comment_id': commentID
    }
  })
  .then(function(params) {
    return xhr.post(YT_AJAX_REPLY_URL, params)
  })
  .then(function(res) {
    if(!res) throw new Error('Requesting replies utterly failed.');
    if(res.status !== 200) {
      var e = new Error("Requesting replies failed.");
      e.status = res.status;
      throw e;
    }
    var repliesStr = res.responseText.toString().trim();
    var replies;

    try {
      replies = JSON.parse(fixEscapeSequences(repliesStr));
    } catch(e) {
      throw new Error("Error parsing Server response: " + e);
    }
    
    return {
      html: replies.html_content
    };
  }).
  catch(function(error) {
    if(error.status && error.status !== 200) {
      if(numAttempts++ < MAX_ATTEMPTS) {
        console.error('Error fetching replies: [STATUS ' + error.status + ']. Retrying...');
        return fetch(videoID, commentID);
      }
    }
    throw error;
  });
}

// fix any invalid escape sequences in a JSON string
function fixEscapeSequences(str) {
  /* 
   * Sometimes Youtube uses '\U' which should be '\u'. So try to replace any invalid 
   * escape sequences with their lowercase versions first.
   */
  var re = /[^\\](\\[^"\/\\bfnrtu])/g;
  return str.replace(re, function(m) {
    if(!re.test(m.toLowerCase()))
      return (m[0] + m.substring(1).toLowerCase());
    else
      return (m[0] + "");
  });
};
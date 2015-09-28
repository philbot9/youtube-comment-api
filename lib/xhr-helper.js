var xhrc = require('xmlhttprequest-cookie');
var XMLHttpRequest = xhrc.XMLHttpRequest;
var querystring = require('querystring');
var Promise = require('bluebird');

module.exports = {
  'get': xhrGet,
  'post': xhrPost,
  'CookieJar': xhrc.CookieJar
};

// XMLHttpRequest - GET
function xhrGet(url) {
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.debug = false;

    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        resolve(xhr);
      }
    };
    
    xhr.open("GET", url);
    xhr.send();
  }); 
}

// XMLHttpRequest - POST
function xhrPost(url, params) {
  return new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.debug = false;
    xhr.open("POST", url, true);
  
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        resolve(xhr);
      }
    };
    
    var requestBody;
    if (params) {
      requestBody = querystring.stringify(params, null, null, { encodeURIComponent: true });
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
    }
    xhr.send(requestBody);  
  });
}

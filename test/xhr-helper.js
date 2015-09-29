var expect = require('chai').expect;

var xhr = require('../lib/xhr-helper.js');
var getSessionToken = require('../lib/youtube-session.js');

describe("XHR-Helper", function() {	
	it("Should export an object", function(){
		expect(xhr).to.be.an('object');
	});
	it("Should have a function 'get'", function(){
		expect(xhr.get).to.be.a('function');
	});
	it("Should have a function 'post'", function(){
		expect(xhr.post).to.be.a('function');
	});
	it("Should have an object 'CookieJar'", function(){
		expect(xhr.CookieJar).to.be.an('object');
	});

	it("function 'get' should send a GET XMLHttpRequest", function(done){
		this.timeout(10000);
		xhr.get("https://www.youtube.com/all_comments?v=MfM7Y9Pcdzw")
    .then(function(res){
			expect(res).to.be.an('object');
			expect(res).to.have.a.property('status', 200);
			expect(res).to.have.a.property('responseText')
				.which.is.a("string");
			expect(res.responseText).to.have.length.above(1);
			done();
		});
	});
	it("function 'get' should receive a cookie", function(done){
		this.timeout(10000);
		xhr.get("https://www.youtube.com/all_comments?v=MfM7Y9Pcdzw")
  	.then(function(res){
			expect(xhr.CookieJar).to.have.a.property('cookieList').which.is.an('array');
			expect(xhr.CookieJar.cookieList).to.have.length.above(0);
			done();
		});
	});
  
	it("should remember the cookie", function(){
		expect(xhr.CookieJar).to.have.a.property('cookieList').which.is.an('array');
		expect(xhr.CookieJar.cookieList).to.have.length.above(0);
	});

	it("function 'post' should send a POST XMLHttpRequest", function(done){
		this.timeout(10000);
		getSessionToken("MfM7Y9Pcdzw")
    .then(function(sessionToken) {
			xhr.post("https://www.youtube.com/comment_ajax?action_load_comments=1&order_by_time=True&filter=MfM7Y9Pcdzw",
				{
					"session_token": sessionToken,
					"video_id": "MfM7Y9Pcdzw"
				})
      .then(function(res){
				expect(res).to.be.an('object');
				expect(res).to.have.a.property('status', 200);
				expect(res).to.have.a.property('responseText').which.is.a('string');
				expect(res.responseText).to.have.length.above(1);
				done();
			});
		});
	});
});
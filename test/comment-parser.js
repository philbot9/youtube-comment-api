var expect = require('chai').expect;
var fs = require('fs');

var parseComments = require('../lib/comment-parser.js');

describe("Comment Parser", function(){
	it("should export a function", function(){
		expect(parseComments).to.be.a('function');
	});

	it("should throw an error if no HTML is provided", function(){
		expect(parseComments).to.throw(Error);
		expect(function(){
			parseComments();
		}).to.throw(Error);
		expect(function(){
			parseComments("");
		}).to.throw(Error);
		expect(function(){
			parseComments("", {});
		}).to.throw(Error);
	});

	it("should parse comments", function(){
		var html = fs.readFileSync("./test/exampleCommentsHTML");
		var commentsPage = parseComments(html);

		expect(commentsPage).to.have.a.property('comments').that.is.an('array');
		expect(commentsPage.comments).to.have.length(39);

		commentsPage.comments.forEach(function(c){
			expect(c).to.have.a.property("id").that.is.a('string');
			expect(c).to.have.a.property("user").that.is.a('string');
			expect(c).to.have.a.property("date").that.is.a('string');
			expect(c).to.have.a.property("timestamp").that.is.a('number');
			expect(c).to.have.a.property("commentText").that.is.a('string');
			expect(c).to.have.a.property("likes").that.is.a('number');
			expect(c).to.have.a.property("hasReplies").that.is.a('boolean');
		});
		
		expect(commentsPage.comments[21].id).to.equal('z12gidbpxrnnilqax04cfrwi4rz2w1ppvvk0k');
		expect(commentsPage.comments[21].user).to.equal('CWright');
		expect(commentsPage.comments[21].commentText).to.equal('Pretty sweet to my ears!!! #RachealPrice Lake Street Dive in the Studio: Rachael Price Sings "What I\'m Doing Here...: http://youtu.be/lcUeothSPyc');
		expect(commentsPage.comments[21].likes).to.equal(12);
		expect(commentsPage.comments[21].hasReplies).to.equal(true);
	});

	it("should parse replies", function(){
		var html = fs.readFileSync("./test/exampleRepliesHTML");
		var commentsPage = parseComments(html, {includeReplies: true});

		expect(commentsPage).to.have.a.property('comments').that.is.an('array');
		expect(commentsPage.comments).to.have.length(9);

		commentsPage.comments.forEach(function(c){
			expect(c).to.have.a.property("id").that.is.a('string');
			expect(c).to.have.a.property("user").that.is.a('string');
			expect(c).to.have.a.property("date").that.is.a('string');
			expect(c).to.have.a.property("timestamp").that.is.a('number');
			expect(c).to.have.a.property("commentText").that.is.a('string');
			expect(c).to.have.a.property("likes").that.is.a('number');
			expect(c).not.to.have.a.property("hasReplies").that.is.a('boolean');	
		});
	});
});
/* jshint mocha:true  */

var fs = require('fs');
var path = require('path');
var postcss = require('postcss');
var assert = require('assert');
var plugin = require('../');

function test ( name, opts, done ) {
	var fixtureDir = './test/fixtures/';
	var baseName   = name.split(':')[0];
	var testName   = name.split(':').join('.');
	var inputPath  = path.resolve(fixtureDir + baseName + '.css');
	var actualPath = path.resolve(fixtureDir + testName + '.actual.css');
	var expectPath = path.resolve(fixtureDir + testName + '.expect.css');

	var inputCSS  = fs.readFileSync(inputPath, 'utf8');
	var expectCSS = fs.readFileSync(expectPath, 'utf8');

	postcss([plugin(opts)]).process(inputCSS, {
		from: inputPath
	}).then(function (result) {
		var actualCSS = result.css;

		fs.writeFileSync(actualPath, actualCSS);

		assert.equal(actualCSS, expectCSS);
		assert.equal(result.warnings().length, 0);

		done();
	}).catch(function (error) {
		done(error);
	});
}

describe('postcss-presence-transition', function () {

	it('simple', function ( done ) {
		test('simple', {}, done);
	});

	it('prefix: -x-', function ( done ) {
		test('prefix', { prefix: '-x-' }, done);
	});

});

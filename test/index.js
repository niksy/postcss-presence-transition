import fs from 'fs';
import path from 'path';
import assert from 'assert';
import postcss from 'postcss';
import plugin from '../index';

async function runTest(name, options) {
	const fixtureDir = './test/fixtures/';
	const baseName = name.split(':')[0];
	const testName = name.split(':').join('.');
	const inputPath = path.resolve(`${fixtureDir + baseName}.css`);
	const actualPath = path.resolve(`${fixtureDir + testName}.actual.css`);
	const expectPath = path.resolve(`${fixtureDir + testName}.expect.css`);

	const inputCSS = fs.readFileSync(inputPath, 'utf8');
	const expectCSS = fs.readFileSync(expectPath, 'utf8');

	const result = await postcss([plugin(options)]).process(inputCSS, {
		from: inputPath
	});
	const actualCSS = result.css;

	fs.writeFileSync(actualPath, actualCSS);

	assert.equal(actualCSS, expectCSS);
	assert.equal(result.warnings().length, 0);
}

it('simple', function() {
	return runTest('simple', {});
});

it('prefix: -x-', function() {
	return runTest('prefix', { prefix: '-x-' });
});

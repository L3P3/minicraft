#!/bin/env node
/* eslint-disable no-undef */

import * as fs from 'fs';
import {exec as child_process_exec} from 'child_process';
import cssnano from 'cssnano';

const {version} = JSON.parse(
	fs.readFileSync('./package.json', 'utf-8')
);

const exec = cmd => (
	new Promise(resolve =>
		child_process_exec(
			cmd,
			(...args) => resolve(args)
		)
	)
);

function env_set(version, debug) {
	fs.writeFileSync(
		'./src/etc/env.js',
`export const VERSION = '${version}';
export const DEBUG = ${debug};
`,
		'utf8'
	);
}

async function build() {
	env_set(version, false);

	console.log('css...');
	const code_css_promise = (
		cssnano()
		.process(
			fs.readFileSync('./src/app.css', 'utf8'),
			{from: undefined}
		)
	);

	console.log('pass 1...');
	console.log((await exec(
		'./node_modules/.bin/google-closure-compiler --' +
		[
			'assume_function_wrapper',
			'compilation_level ADVANCED',
			'dependency_mode PRUNE',
			'entry_point ./src/app.js',
			'js ./src',
			'js_output_file /tmp/app.js',
			'language_in ECMASCRIPT_NEXT',
			'language_out ECMASCRIPT6_STRICT',
			'module_resolution BROWSER',
			'rewrite_polyfills false',
			'strict_mode_input',
			'use_types_for_optimization',
			'warning_level VERBOSE'
		]
		.join(' --')
	))[2]);

	console.log('pass 2...');
	console.log((await exec(
		'./node_modules/.bin/google-closure-compiler --' +
		[
			'assume_function_wrapper',
			'compilation_level SIMPLE',
			'externs ./src/externs.js',
			'js /tmp/app.js',
			'js_output_file ./dist/app.js',
			'language_in ECMASCRIPT6_STRICT',
			'language_out ECMASCRIPT6_STRICT',
			'rewrite_polyfills false',
			'strict_mode_input',
			'warning_level VERBOSE'
		]
		.join(' --')
	))[2]);

	await exec('rm /tmp/app.js');

	fs.writeFileSync(
		'./dist/app.css',
		'' + await code_css_promise,
		'ascii'
	);
}

(async () => {

if(
	!(
		await exec('./node_modules/.bin/google-closure-compiler --version')
	)[1].includes('Version: v202')
) {
	console.log('google closure compiler required!');
	return;
}

await exec('mkdir -p ./dist');
await exec('rm ./dist/*');

console.log(`build ${version}...`);

await build();

console.log('done.');

})()
.catch(console.log)
.finally(() => {
	env_set('dev', true);
});

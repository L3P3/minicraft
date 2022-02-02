#!/bin/env node
/* eslint-disable no-undef */

import * as fs from 'fs';
import {exec as child_process_exec} from 'child_process';

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

	console.log((await exec(
		'./node_modules/.bin/google-closure-compiler --' +
		[
			'assume_function_wrapper',
			'charset UTF-8',
			'compilation_level ADVANCED',
			'dependency_mode PRUNE',
			'entry_point ./src/app.js',
			'js ./src',
			'js_output_file ./dist/app.js',
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
}

(async () => {

if(
	!(
		await exec('google-closure-compiler --version')
	)[1].includes('Version: v202')
) {
	console.log('newer closure compiler version required!');
	return;
}

await exec('mkdir -p ./dist');
await exec('rm ./dist/*');

console.log(`build ${version}...`);

await build();

})()
.catch(console.log)
.finally(() => {
	env_set('local', true);
});

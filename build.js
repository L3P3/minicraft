#!/bin/env node

import {
	readFile,
	writeFile,
} from 'fs/promises';
import {exec as child_process_exec} from 'child_process';
import cssnano from 'cssnano';

const GCC_COMMAND = './node_modules/.bin/google-closure-compiler --';
const TMP_FILE = '/tmp/app.js';

const {version} = JSON.parse(
	await readFile('./package.json', 'utf-8')
);

const exec = cmd => (
	new Promise(resolve =>
		child_process_exec(
			cmd,
			(...args) => resolve(args)
		)
	)
);

const env_set = (version, debug) => (
	writeFile(
		'./src/etc/env.js',
`export const VERSION = '${version}';
export const DEBUG = ${debug};
export const TEST = null;
`,
		'utf8'
	)
);

async function build_css() {
	const css_raw = await readFile('./src/app.css', 'utf8');

	console.log('css...');
	const css_minified = '' + await (
		cssnano()
		.process(
			css_raw,
			{from: undefined}
		)
	);
	console.log('css done.');

	await writeFile(
		'./dist/app.css',
		css_minified,
		'ascii'
	);
}

async function build_js() {
	await env_set(version, false);

	console.log('js pass 1...');
	console.log((await exec(
		GCC_COMMAND +
		[
			'assume_function_wrapper',
			'compilation_level ADVANCED',
			'dependency_mode PRUNE',
			'entry_point ./src/app.js',
			'js ./src',
			'js_output_file ' + TMP_FILE,
			'language_in ECMASCRIPT_NEXT',
			'language_out ECMASCRIPT6_STRICT',
			'module_resolution BROWSER',
			'rewrite_polyfills false',
			'strict_mode_input',
			'use_types_for_optimization',
			'warning_level VERBOSE',
		]
		.join(' --')
	))[2]);

	/*console.log('custom transformation...');
	await writeFile(
		TMP_FILE,
		(await readFile(TMP_FILE, 'ascii'))
		.split('const ').join('let '),
		'ascii'
	);*/

	console.log('js pass 2...');
	console.log((await exec(
		GCC_COMMAND +
		[
			'assume_function_wrapper',
			'compilation_level SIMPLE',
			'externs ./src/externs.js',
			'js ' + TMP_FILE,
			'js_output_file ./dist/app.js',
			'language_in ECMASCRIPT6_STRICT',
			'language_out ECMASCRIPT6_STRICT',
			'rewrite_polyfills false',
			'strict_mode_input',
			'warning_level VERBOSE',
		]
		.join(' --')
	))[2]);
	console.log('js done.');

	await exec('rm ' + TMP_FILE);
}

if(
	!(
		await exec(GCC_COMMAND + 'version')
	)[1].includes('Version: v202')
) {
	throw new Error('google closure compiler required!');
}

await exec('mkdir -p ./dist');
await exec('rm ./dist/*');

console.log(`build ${version}...`);

try {
	await Promise.all([
		build_css(),
		build_js(),
	]);
}
finally {
	await env_set('dev', true);
}

console.log('done.');

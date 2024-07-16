#!/bin/env node

import {
	readdir,
	readFile,
	writeFile,
} from 'fs/promises';
import {exec as child_process_exec} from 'child_process';
import cssnano from 'cssnano';

const GCC_COMMAND = './node_modules/.bin/google-closure-compiler --';
const TMP_FILE = '/tmp/app.js';

const prod = !!process.env.CI;
const {version} = JSON.parse(
	await readFile('./package.json', 'utf8')
);

let languages = ['de'];
if (prod) {
	const files = await readdir('./locales');
	languages = (
		files
		.filter(name => name.endsWith('.csv'))
		.map(name => name.split('.')[0])
	);
}

const exec = cmd => (
	new Promise(resolve =>
		child_process_exec(
			cmd,
			(...args) => resolve(args)
		)
	)
);

async function lang_generate(lang) {
	const csv = await readFile(`./locales/${lang}.csv`, 'utf8');
	let output = '';
	for (const line of csv.split('\n')) {
		if (!line) continue;
		const index_colon = line.indexOf(': ');
		const key = line.substring(0, index_colon);
		const value = line.substring(index_colon + 2);
		output += `export const locale_${key} = '${value}';\n`;
	}
	return output;
}

const env_set = async (version, debug, lang, api, api_download) => Promise.all([
	writeFile(
		'./src/etc/env.js',
`export const VERSION = '${version}';
export const DEBUG = ${debug};
export const LANG = '${lang}';
export const API = '${api}';
export const API_DOWNLOAD = '${api_download}';
`,
		'utf8'
	),
	writeFile(
		'./src/etc/locale.js',
		await lang_generate(lang),
		'utf8'
	),
]);

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

async function build_js(lang) {
	await env_set(
		prod ? version : 'dev',
		false,
		lang,
		prod ? '/api/minicraft/' : '//l3p3.de/api/minicraft/',
		prod ? '/static/minicraft/worlds/' : '//l3p3.de/static/minicraft/worlds/'
	);

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

	console.log('custom transformation...');
	await writeFile(
		TMP_FILE,
		(await readFile(TMP_FILE, 'ascii'))
		.split('actions').join('a')
		.split('content').join('c')
		.split('loaded').join('l'),
		'ascii'
	);

	console.log('js pass 2...');
	console.log((await exec(
		GCC_COMMAND +
		[
			'assume_function_wrapper',
			'compilation_level SIMPLE',
			'externs ./src/externs.js',
			'js ' + TMP_FILE,
			`js_output_file ./dist/app-${lang}.js`,
			'language_in ECMASCRIPT6_STRICT',
			'language_out ECMASCRIPT6_STRICT',
			'rewrite_polyfills false',
			'strict_mode_input',
			'warning_level VERBOSE',
		]
		.join(' --')
	))[2]);
	console.log(`js ${lang} done.`);

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

console.log(`build ${version} (${prod ? 'production' : 'dev'})...`);

try {
	const lang_first = languages.shift();
	await Promise.all([
		build_css(),
		build_js(lang_first),
	]);
	for (const lang of languages) await build_js(lang);
}
finally {
	await env_set('dev', true, 'de', '//l3p3.de/api/minicraft/', '//l3p3.de/static/minicraft/worlds/');
}

console.log('done.');

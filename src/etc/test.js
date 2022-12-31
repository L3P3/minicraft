import {
	test as test_lz,
} from './lz.js';

export const runTest = name => {
	console.log('Running test: ' + name);
	switch (name) {
		case 'lz': return test_lz();
	}
	console.log('test not found');
}

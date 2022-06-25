import { test } from 'uvu';
import * as assert from 'uvu/assert';
import { deep_merge, merge_vite_configs } from './utils.js';

test('basic test no conflicts', async () => {
	const merged = deep_merge(
		{
			version: 1,
			animalSounds: {
				cow: 'moo'
			}
		},
		{
			animalSounds: {
				duck: 'quack'
			},
			locale: 'en_US'
		}
	);

	assert.equal(merged, {
		version: 1,
		locale: 'en_US',
		animalSounds: {
			cow: 'moo',
			duck: 'quack'
		}
	});
});

test('three way merge no conflicts', async () => {
	const merged = deep_merge(
		{
			animalSounds: {
				cow: 'moo'
			}
		},
		{
			animalSounds: {
				duck: 'quack'
			}
		},
		{
			animalSounds: {
				dog: {
					singular: 'bark',
					plural: 'barks'
				}
			}
		}
	);
	assert.equal(merged, {
		animalSounds: {
			cow: 'moo',
			duck: 'quack',
			dog: {
				singular: 'bark',
				plural: 'barks'
			}
		}
	});
});

test('merge with conflicts', async () => {
	const merged = deep_merge(
		{
			person: {
				firstName: 'John',
				lastName: 'Doe',
				address: {
					line1: '123 Main St',
					city: 'Seattle',
					state: 'WA'
				}
			}
		},
		{
			person: {
				middleInitial: 'Q',
				address: '123 Main St, Seattle, WA'
			}
		}
	);
	assert.equal(merged, {
		person: {
			firstName: 'John',
			middleInitial: 'Q',
			lastName: 'Doe',
			address: '123 Main St, Seattle, WA'
		}
	});
});

test('merge with arrays', async () => {
	const merged = deep_merge(
		{
			paths: ['/foo', '/bar']
		},
		{
			paths: ['/alpha', '/beta']
		}
	);
	assert.equal(merged, {
		paths: ['/foo', '/bar', '/alpha', '/beta']
	});
});

test('empty', async () => {
	const merged = deep_merge();
	assert.equal(merged, {});
});

test('mutability safety', () => {
	const input1 = {
		person: {
			firstName: 'John',
			lastName: 'Doe',
			address: {
				line1: '123 Main St',
				city: 'Seattle'
			}
		}
	};
	const input2 = {
		person: {
			middleInitial: 'L',
			lastName: 'Smith',
			address: {
				state: 'WA'
			}
		}
	};
	const snapshot1 = JSON.stringify(input1);
	const snapshot2 = JSON.stringify(input2);

	const merged = deep_merge(input1, input2);

	// Mess with the result
	merged.person.middleInitial = 'Z';
	merged.person.address.zipCode = '98103';
	merged.person = {};

	// Make sure nothing in the inputs changed
	assert.snapshot(snapshot1, JSON.stringify(input1));
	assert.snapshot(snapshot2, JSON.stringify(input2));
});

test('merge buffer', () => {
	const merged = deep_merge(
		{
			x: Buffer.from('foo', 'utf-8')
		},
		{
			y: 12345
		}
	);
	assert.equal(Object.keys(merged), ['x', 'y']);
});

test('merge including toString', () => {
	const merged = deep_merge(
		{
			toString: () => '',
			constructor: () => ''
		},
		{
			y: 12345
		}
	);
	assert.equal(Object.keys(merged), ['toString', 'constructor', 'y']);
});

test('merge resolve.alias', () => {
	const merged = merge_vite_configs(
		{
			resolve: {
				alias: [{ find: /foo/, replacement: 'bar' }]
			}
		},
		{
			resolve: {
				alias: {
					alpha: 'beta'
				}
			}
		}
	);
	assert.equal(merged, {
		resolve: {
			alias: [
				{ find: /foo/, replacement: 'bar' },
				{ find: 'alpha', replacement: 'beta' }
			]
		}
	});
});

test.run();
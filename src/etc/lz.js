/**
	Based on this:
	https://gist.github.com/dbezrukov/0cb5cb03eb1cedf1a205b0effcec00e1
*/

import {
	Map_,
	String_fromCharCode,
	Uint8Array_,
} from './helpers.js';

/*
	basic ranges of printable UTF16 values (as found in LZ-string): 
		[32, 127), [160, 55296), [63744, 65536)
	We also have filter out string characters like:
	" (34)
	' (39)
	` (44)
	(Forward tick is safe: ´ (96))
	So:
	32, 33, [35, 39), [40, 44), [45, 127), [160, 55296), [63744, 65536)
*/

// integer to unicode:
const itou = i => {
	i += 32;
	if (i > 33 && i < 39) {
		i++;
	} else if (i > 38 && i < 44) {
		i += 2;
	} else if (i > 43 && i < 127) {
		i += 3;
	} else if (i > 126 && i < 55258) {
		i += 37; // === 160 - 128 + 3
	} else if (i > 55295) {
		i += 8485; // === 63744 - 55296 + 37  
	}
	return String_fromCharCode(i);
}

const utoi = i => (
	i - (
		i > 63743
		?	8517
		: i > 159
		?	69
		: i > 46 && i < 130
		?	35
		: i > 40 && i < 46
		?	34
		: i > 34 && i < 40
		?	33
		:	32
	)
);

const TOKEN_BYTE_NEW = 0;
const TOKEN_END_OF_STREAM = 1;

/**
	@param {Uint8Array} input
	@return {string}
*/
export const compress = input => {
	const input_length = input.length;

	const tree = new Map_;

	const node_create = () => ({
		id: node_id_counter++,
		childs: new Map_,
	});

	const bit_add = bit => {
		bits = bits << 1 | bit & 1;
		if (++bits_count === 15) {
			output += itou(bits);
			bits = bits_count = 0;
		}
	}
	const bits_fill = () => {
		for (let i = 0; i < bits_left; ++i) {
			bit_add(0);
		}
	}
	const byte_add = byte => {
		bit_add(byte);
		bit_add(byte >> 1);
		bit_add(byte >> 2);
		bit_add(byte >> 3);
		bit_add(byte >> 4);
		bit_add(byte >> 5);
		bit_add(byte >> 6);
		bit_add(byte >> 7);
	}
	const token_assert = () => {
		if (--bits_left_b === 0) {
			bits_left_b = 1 << bits_left++;
		}
	}
	const prefix_write = () => {
		if (node_fresh) {
			// character token already written to output
			node_fresh = false;
		} else {
			// write out the prefix token
			let id = node.id;
			for (let i = 0; i < bits_left; i++) {
				bit_add(id >> i);
			}
		}
	}

	let input_item = input[0];
	let output = '';

	let bits = 0;
	let bits_count = 2;
	let bits_left = 2;
	let bits_left_b = 2;

	let node_id_counter = 2;
	let node = node_create();
	let node_fresh = true;

	// add first item bits
	byte_add(input_item);
	// add first item to the tree
	tree.set(input_item, node);

	for (let input_index = 1; input_index < input_length; ++input_index) {
		// does the new item match an existing prefix?
		const node_next = node.childs.get(
			input_item = input[input_index]
		);
		if (node_next) {
			// continue with next prefix
			node = node_next;
		}
		else {
			// Prefix+input_item does not exist in tree yet.
			// We write the prefix to the bitstream, and add
			// the new item to the tree if it's new
			// Then we set `node` to the root node matching the item.

			prefix_write();

			// new item?
			if (!tree.has(input_item)) {
				// insert new byte token
				token_assert();
				bits_fill();
				byte_add(input_item);
				tree.set(input_item, node_create());
				// item token written already
				node_fresh = true;
			}
			// add node representing prefix + new item to tree
			node.childs.set(input_item, node_create());
			// set node to first item of new prefix
			node = tree.get(input_item);

			token_assert();
		}
	}

	// write last prefix to output
	prefix_write();

	// new item?
	if (!tree.has(input_item)) {
		token_assert();
		bits_fill();
		byte_add(input_item);
	}

	// mark the end of the stream
	token_assert();
	bit_add(TOKEN_END_OF_STREAM);
	--bits_left;

	bits_fill();

	// flush the last item
	return (
		output += itou(
			bits << 15 - bits_count
		)
	);
}

/**
	@param {string?} compressed
	@param {Uint8Array} result
	@return {Uint8Array?}
*/
export const decompress = (compressed, result) => {
	if (!compressed) return null;

	const compressed_length = compressed.length;
	const getValue = () => utoi(compressed.charCodeAt(data_index++));

	const bit_read = () => {
		bits += (data_val >> --data_position & 1) << power++;
		if (data_position === 0) {
			data_position = 15;
			data_val = getValue();
		}
	}

	let dictionary = [0, 1],
		enlargeIn = 1,
		dictSize = 3,
		numBits = 2,
		bytes = null,
		bytes_concat = null,
		result_index = 0,
		bits = 0,
		maxPower = 2,
		power = 0,
		data_index = 0,
		data_val = getValue(),
		data_position = 15;

	// get first token, either new byte or end of stream
	while (power < maxPower) {
		bit_read();
	}

	if (bits === TOKEN_END_OF_STREAM) {
		return null;
	}

	// else, get byte value
	bits = power = 0;
	while (power < 8) {
		bit_read();
	}
	bytes = [bits];
	dictionary[2] = bytes;
	result[result_index++] = bits;

	// read rest of string
	while (data_index <= compressed_length) {
		// read out next token
		maxPower = numBits;
		bits = power = 0;
		while (power < maxPower) {
			bit_read();
		}

		// new byte token
		if (bits === TOKEN_BYTE_NEW) {
			bits = power = 0;
			while (power < 8) {
				bit_read();
			}
			dictionary[dictSize] = [bits];
			bits = dictSize++;
			if (--enlargeIn === 0) {
				enlargeIn = 1 << numBits++;
			}
		}
		// end of stream token
		else if (bits === TOKEN_END_OF_STREAM) {
			return result;
		}

		// if (bits > dictionary.length) break;

		bytes_concat = bits < dictionary.length ? dictionary[bits] : bytes.concat(bytes[0]);
		for (let i = 0; i < bytes_concat.length; i++) {
			result[result_index++] = bytes_concat[i];
		}
		dictionary[dictSize++] = bytes.concat(bytes_concat[0]);
		bytes = bytes_concat;

		if (--enlargeIn === 0) {
			enlargeIn = 1 << numBits++;
		}
	}
	return null;
}

export const testCompression = () => {
	console.log('Testing utoi/itou functions');
	let utoiMismatches = [];
	for (let i = 0; i < 1 << 15; i++) {
		let j = utoi(itou(i).charCodeAt(0));
		if (i !== j) {
			utoiMismatches.push({itou: i, utio: j});
		}
	}

	if (utoiMismatches.length) {
		console.log("Errors in itou/utoi conversion detected:", utoiMismatches);
	} else {
		console.log('No errors in itou/utoi conversion detected');
	}

	let input = new Uint16Array(1 << 15);
	for (let i = 0; i < input.length; i++) {
		input[i] = i>>4;
	}
	let inputUint8 = new Uint8Array_(input.buffer);
	let compressed = compress(inputUint8);
	let decompressed = new Uint16Array(
		decompress(
			compressed,
			new Uint8Array_(inputUint8.length)
		).buffer
	);
	let mismatches = [];
	for (let i = 0; i < input.length; i++) {
		if (input[i] !== decompressed[i]) {
			mismatches.push({index: i, input: input[i], decompressed: decompressed[i]});
		}
	}
	console.log({
		compressed,
		mismatches,
		length: compressed.length,
		inputLength: input.length,
	});
}

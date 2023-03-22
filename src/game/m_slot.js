import {
	Math_min,
} from '../etc/helpers.js';

import {
	stack_create,
} from './m_stack.js';

/**
	@typedef {{
		amount: number,
		data: Object,
		id: number,
	}}
*/
var Stack;

/**
	@typedef {{
		content: ?Stack,
		filter: ?function(number): boolean,
		capacity: number,
	}}
*/
var Slot;

/**
	@param {Stack?} content
	@param {(function(number): boolean)?} filter
	@param {number} capacity
	@return {Slot}
*/
export const slot_create = (content, filter = null, capacity = 64) => ({
	content,
	filter,
	capacity,
});

/**
	moves n items from source to target, swaps if possible
	@param {Slot} source
	@param {Slot} target
	@param {number} amount
*/
export const slot_transfer = (source, target, amount = source.content.amount) => {
	// IF TARGET OCCUPIED:
	if (target.content) {
		// IF ID IDENTICAL:
		if (source.content.id === target.content.id) {
			// ADD/SUBTRACT
			const space_available = target.capacity - target.content.amount;
			const amount_to_transfer = Math_min(amount, space_available);
			source.content.amount -= amount_to_transfer;
			target.content.amount += amount_to_transfer;
			if (source.content.amount <= 0) source.content = null;
		}
		// IF NO SUBSET AND TARGET FITS IN SOURCE AND SOURCE FITS IN TARGET:
		else if (
			source.content.amount <= amount &&
			source.content.amount <= target.capacity &&
			target.content.amount <= source.capacity &&
			(!source.filter || source.filter(target.content.id)) &&
			(!target.filter || target.filter(source.content.id))
		) {
			// SWAP
			[target.content, source.content] = [source.content, target.content];
		}
	}
	// IF SOURCE ALLOWED IN TARGET:
	else if (
		!target.filter ||
		target.filter(source.content.id)
	) {
		// IF NO SUBSET AND SOURCE FITS IN TARGET:
		if (
			source.content.amount <= amount &&
			source.content.amount <= target.capacity
		) {
			// SWAP
			[target.content, source.content] = [source.content, target.content];
		}
		else {
			// ADD/SUBTRACT
			const amount_to_transfer = Math_min(amount, target.capacity);
			source.content.amount -= amount_to_transfer;
			target.content = stack_create(source.content.id, amount_to_transfer);
			if (source.content.amount <= 0) source.content = null;
		}
	}
}

/**
	tries to add stack to inventory
	@param {!Array<Slot>} slots
	@param {Stack} stack do not use after calling this function
	@return {Stack?} rest
*/
export const slots_collect = (slots, stack) => {
	// try to merge with existing stacks
	for (const slot of slots) {
		if (
			slot.content &&
			slot.content.id === stack.id
		) {
			const space_available = slot.capacity - slot.content.amount;
			const amount_to_transfer = Math_min(stack.amount, space_available);
			slot.content.amount += amount_to_transfer;
			if ((
				stack.amount -= amount_to_transfer
			) <= 0) return null;
		}
	}

	// try to find empty slots
	for (const slot of slots) {
		if (
			!slot.content &&
			(!slot.filter || slot.filter(stack.id))
		) {
			const amount_to_transfer = Math_min(stack.amount, slot.capacity);
			if (amount_to_transfer <= stack.amount) {
				slot.content = stack_create(stack.id, amount_to_transfer);
				if ((
					stack.amount -= amount_to_transfer
				) <= 0) return null;
			}
			else {
				slot.content = stack;
				return null;
			}
		}
	}

	return stack;
}

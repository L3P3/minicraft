/**
	@typedef {{
		amount: number,
		data: Object,
		id: number,
	}}
*/
var Stack;

/**
	stack of items
	@param {number} id
	@param {number} amount
	@param {Object} data
	@return {Stack}
*/
export const stack_create = (id, amount = 1, data = null) => ({
	amount,
	data,
	id,
});

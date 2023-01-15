/**
	stack of items
	@param {number} id
*/
export const stack_create = (id, amount = 1, data = null) => ({
	amount,
	data,
	id,
});

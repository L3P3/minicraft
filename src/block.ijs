/**
	gets a block
	@return {number}
*/
const world_block_get=function(
	/** World */world,
	/** number */x,
	/** number */y,
	/** number */z
){
	return
		chunk_block_get(
			world_chunk_get(
				world,
				world_chunk_num_get(x),
				world_chunk_num_get(z)
			),
			chunk_rel_get(x),
			y,
			chunk_rel_get(z)
		);
}

/**
	gets a block, checks if possible
	@return {number}
*/
const world_block_get_s=function(
	/** World */world,
	/** number */x,
	/** number */y,
	/** number */z
){
	const
		chunk=
			world_chunk_get_s(
				world,
				world_chunk_num_get(x),
				world_chunk_num_get(z)
			);
	
	if(
		chunk!==null&&
		0<=y&&
		y<chunk_height
	)
		return
			chunk_block_get(
				chunk,
				chunk_rel_get(x),
				y,
				chunk_rel_get(z)
			);
	
	return block_air;
}

/**
	sets a block
*/
const world_block_set=function(
	/** World */world,
	/** number */x,
	/** number */y,
	/** number */z,
	/** number */id
){
	chunk_block_set(
		world_chunk_get(
			world,
			world_chunk_num_get(x),
			world_chunk_num_get(z)
		),
		chunk_rel_get(x),
		y,
		chunk_rel_get(z),
		id
	);
}

/**
	sets a block, checks if possible
	@return {boolean}
*/
const world_block_set_s=function(
	/** World */world,
	/** number */x,
	/** number */y,
	/** number */z
){
	const
		chunk=world_chunk_get_s(
			world,
			world_chunk_num_get(x),
			world_chunk_num_get(z)
		);
	
	if(
		chunk!==null&&
		0<=y&&
		y<chunk_height
	){
		chunk_block_set(
			chunk,
			chunk_rel_get(x),
			y,
			chunk_rel_get(z),
			id
		);
		return true;
	}
	
	return false;
}

/**
	checks if there is a solid block present
	@return {number}
*/
const world_block_check_solid=function(
	/** World */world,
	/** number */x,
	/** number */y,
	/** number */z
){
	return
		world_block_get_s(
			world,
			x,y,z
		)!==block_air
}
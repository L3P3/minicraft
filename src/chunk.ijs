/**
@constructor
*/
const Chunk=function(){}

/**
@return {Chunk}
*/
const chunk_create=function(
/** World */world,
/** number */x,
/** number */z
){
const
	chunk=new Chunk(),
	offset_x=
		chunk.offset_x=(
			chunk.x=x
		)<<chunk_width_l,
	offset_z=
		chunk.offset_z=(
			chunk.z=z
		)<<chunk_width_l,
	data=
		chunk.data=
		new _Uint8Array(chunk_data_length),
	entities=
		chunk.entities=
		new Set(),
	storage_data=
		chunk_storage_load(
			world,
			x,
			z
		);

//chunk data present?
if(
	storage_data!==null
){
	const
		storage_data_length=storage_data.length;
	var
		j=chunk_data_length>>>3;
	
	//blocks
	do{
		var char=
			storage_data.charCodeAt(--j)|
			storage_data.charCodeAt(--j)<<16;
		
		if(
			char===0
		)
			continue;
		
		var i=j<<3;
		
		data[--i]=char&0xf;
		data[--i]=(char>>>=4)&0xf;
		data[--i]=(char>>>=4)&0xf;
		data[--i]=(char>>>=4)&0xf;
		data[--i]=(char>>>=4)&0xf;
		data[--i]=(char>>>=4)&0xf;
		data[--i]=(char>>>=4)&0xf;
		data[--i]=char>>>=4;
	}
	while(
		j!==0
	);
	
	j=(chunk_data_length>>>3);
	
	//entities
	while(
		j<storage_data_length
	){
		const
			flags=storage_data.charCodeAt(j),
			label_length=(flags&0xf0)>>>4,
			entity=entity_create(flags&0xf);
		
		entity.gravity=flags&(1<<8)!==0;
		
		entity.position_x=bin2float(storage_data,++j);
		entity.position_y=bin2float(storage_data,++j);
		entity.position_z=bin2float(storage_data,++j);
		
		entity.velocity_x=bin2float(storage_data,++j);
		entity.velocity_y=bin2float(storage_data,++j);
		entity.velocity_z=bin2float(storage_data,++j);
		
		++j;
		
		if(
			label_length===0
		)
			continue;
		
		entity.label=storage_data.substring(j,j+=label_length);
	}
}
//chunk has to be generated?
else{
	const
		seed=world.seed,
		wgf=world.wgf,
		wgf_length=wgf.length;
	var
		i=0,
		i_x=0;
	
	//x
	do{
		const
			p_x=offset_x+i_x;
		var
			i_z=0;
		
		//z
		do{
			const
				p_z=offset_z+i_z;
			var
				j=i,
				p_y=1,
				floor_height=wgf[0],
				k=1;
			
			i+=chunk_height;
			
			//waves
			do
				floor_height+=
					(
						Math_sin(
							p_x*wgf[k]+
							wgf[k+2]
						)+
						Math_sin(
							p_z*wgf[k]+
							wgf[k+3]
						)
					)*wgf[k+1];
			while(
				(k+=4)<wgf_length
			);
			
			//bedrock
			data[j]=block_bedrock;
			
			//stone
			do
				data[++j]=block_stone;
			while(
				++p_y<floor_height
			);
			
			//dirt
			data[++j]=block_dirt;
			data[++j]=block_dirt;
			data[++j]=block_dirt;
			data[++j]=block_dirt;
			data[++j]=block_dirt;
			data[++j]=block_dirt;
			data[++j]=block_dirt;
			data[++j]=block_dirt;
			
			//grass
			data[++j]=block_grass;
			
			//fill up with air if plain arrays are used
			if(
				!env_natarray_use
			)
				while(
					++j<i
				)
					data[j]=block_air;
		}
		while(
			++i_z<chunk_width
		);
	}
	while(
		++i_x<chunk_width
	);
}
}

/**
save chunk
*/
const chunk_save=function(
/** World */world,
/** Chunk */chunk
){
const data=chunk.data;
var
	data_string='',
	i=0;

//blocks
do
	data_string+=
		String_fromCharCode(
			data[i]<<12|
			data[++i]<<8|
			data[++i]<<4|
			data[++i]
		)+
		String_fromCharCode(
			data[++i]<<12|
			data[++i]<<8|
			data[++i]<<4|
			data[++i]
		)+
		String_fromCharCode(
			data[++i]<<12|
			data[++i]<<8|
			data[++i]<<4|
			data[++i]
		)+
		String_fromCharCode(
			data[++i]<<12|
			data[++i]<<8|
			data[++i]<<4|
			data[++i]
		);
while(
	++i<chunk_data_length
);

//entities
for(
	var entity of chunk.entities
)
	if(
		entity.type!==entity_type_player
	){
		data_string+=
			String_fromCharCode(
				(entity.gravity?1<<8:0)|
				
				(entity.label===null?0:entity.label.length<<4)|
				(entity.type)
			)+
			float2bin(entitiy.position_x)+
			float2bin(entitiy.position_y)+
			float2bin(entitiy.position_z)+
			
			float2bin(entitiy.velocity_x)+
			float2bin(entitiy.velocity_y)+
			float2bin(entitiy.velocity_z)+
			
			entity.label===null
				?''
				:entitiy.label
	}

chunk_storage_save(
	world,
	chunk.x,
	chunk.z,
	data_string
);
}

/**
calculates index of a voxel
@return {number}
*/
const chunk_data_index_get=function(
/** number */x,
/** number */y,
/** number */z
){
return(
	(x&chunk_width_m1)<<(chunk_height_l+chunk_width_l)|
	(z&chunk_width_m1)<<chunk_height_l|
	y&chunk_height_m1
);
}

/**
gets the id of a block
@return {number}
*/
const chunk_block_get=function(
/** Chunk */chunk,
/** number */x,
/** number */y,
/** number */z
){
return(
	chunk.data[
		chunk_data_index_get(
			x,
			y,
			z
		)
	]
);
}

/**
sets a block to an id
*/
const chunk_block_set=function(
/** Chunk */chunk,
/** number */x,
/** number */y,
/** number */z,
/** number */id
){
chunk.data[
	chunk_data_index_get(
		x,
		y,
		z
	)
]=id;
}

/**
calculate chunk-relative distance
@return {number}
*/
const chunk_rel_get=function(
/** number */n
){
if(n>=0)
	return n%chunk_width;

return chunk_width_m1+(n+1)%chunk_width_m1;
}

/**
	get chunk by absolute chunk position
	@return {Chunk}
*/
const world_chunk_get=function(
	/** World */world,
	/** number */x,
	/** number */z
){
	const
		key=x+'.'+z,
		chunk_loaded=
			world.chunks_loaded['get'](key);
	
	if(
		chunk_loaded!==undefined
	)
		return chunk_loaded;
	
	const
		chunk=chunk_create(
			world,
			x,
			z
		);
	
	world.chunks_loaded['set'](key,chunk);
	
	return chunk;
}

const world_chunk_unload=function(
	/** World */world,
	/** Chunk */chunk
){
	chunk_save(world,chunk);
	
	world.chunks_loaded['delete'](x+'.'+z);
	
	for(
		var entity of chunk.entities
	)
		world.entities['delete'](entity);
}

/**
	unload all invisible chunks
*/
const world_chunks_loaded_cleanup=function(
	/** World */world
){
	chunks:for(
		var chunk of world.chunks_loaded
	){
		//check if any player is near
		for(
			var player of world.players
		){
			if(
				Math_abs(player.position_x-chunk.offset_x)>view_distance_cache||
				Math_abs(player.position_z-chunk.offset_z)>view_distance_cache
			)
				continue;
			
			//if player is near
			continue chunks;
		}
		
		//if no player is near
		world_chunk_unload(world,chunk);
	}
}
const world_entity_add=function(
	/** World */world,
	/** Entity */entity
){
	world.entities['add'](entity);
	
	world_chunk_get(
		world,
		entity.chunk_x=
			world_chunk_num_get(
				entity.position_x
			),
		entity.chunk_z=
			world_chunk_num_get(
				entity.position_z
			)
	)
		.entities['add'](entity);
}

/**
	@constructor
*/
const Entity=function(){}
Entity.prototype={
	type:0,
	
	rotation_x:0.0,
	rotation_y:0.0,
	
	position_x:0.0,
	position_y:0.0,
	position_z:0.0,
	
	velocity_x:0.0,
	velocity_y:0.0,
	velocity_z:0.0,
	
	chunk_x:0,
	chunk_z:0,
	
	gravity:false,
	ground:false,
	stuck:false,
	jumps:false,
	
	chunk:null,
	label:null
}

const entity_tick=function(
	/** World */world,
	/** Entitiy */entity,
	/** number */time_delta
){
	if(
		entity.type===entity_type_player
	){
		//player movement
		const
			velocity_fact=time_delta*0.002,
			
			rotation_y=entity.rotation_y,
			rotation_y_cos=Math_cos(rotation_y),
			rotation_y_sin=Math_sin(rotation_y);
		
		//forward/backward
		entity.velocity_z+=velocity_fact*(
			+rotation_y_cos*input_key_move_z
			-rotation_y_sin*input_key_move_x
			-entity.velocity_z
		);
		
		//sideways
		entity.velocity_x+=velocity_fact*(
			+rotation_y_cos*input_key_move_x
			+rotation_y_sin*input_key_move_z
			-entity.velocity_x
		);
		
		//vertical
		if(
			entity.gravity
		)
			entity.jumps=(input_key_move_y!==0);
		else
			entity.velocity_y+=velocity_fact*(
				+input_key_move_y
				-entity.velocity_y
			);
	}
	
	const
		fact=time_delta*0.02;
		m1fact=Math.max(1-fact,0);
	
	//Velocity
	entity.velocity_x*=m1fact;
	entity.velocity_y*=m1fact;
	entity.velocity_z*=m1fact;
	
	//Position
	var
		position_x_new=entity.position_x+fact*entity.velocity_x,
		position_y_new=entity.position_y+fact*entity.velocity_y,
		position_z_new=entity.position_z+fact*entity.velocity_z;
	
	//Gravity
	if(entity.gravity)
		position_y_new-=fact;
	
	//Collision
	//if(position_x_new<
	//Ground
	//y... entity.ground=;
	
	//Jump
	if(
		entity.ground&&
		entity.jumps
	)
		entity.velocity+=1.4;
	
	//Apply
	entity.position_y=position_y_new;
	
	//Chunk
	var
		chunk=entity.chunk;
	const
		cxo=entity.chunk_x,
		czo=entity.chunk_z,
		cx=world_chunk_num_get(
			entity.position_x=position_x_new
		),
		cz=world_chunk_num_get(
			entity.position_z=position_z_new
		),
		cxd=cxo-cx,
		czd=czo-cz;
	
	//same?
	if(
		cxd|czd===0
	){}
	//different?
	else{
		chunk.entities['delete'](entity);
		
		(
			chunk=
			entity.chunk=
			world_chunk_get(
				world,
				entity.chunk_x=cx,
				entity.chunk_z=cz
			)
		)
			.entities['add'](entity);
		
		//player?
		if(
			entity.type===entity_type_player
		){
			//movement?
			if(
				false&&
				Math_max(
					Math_abs(cxd),
					Math_abs(czd)
				)<=view_distance
			){
				//TODO
			}
			//far teleport?
			else
				player_chunks_view_generate(entity);
		}
	}
	
	const
		position_y_int=
			Math_round(position_y_new),
		index=
			chunk_data_index_get(
				chunk_rel_get(
					Math_round(position_x_new)
				),
				position_y_int,
				chunk_rel_get(
					Math_round(position_z_new)
				)
			);
	
	//Suffocation
	entity.stuck=
		position_y_int>chunk_height+64||
		position_y_int<-64||
		(
			position_y_int>-1&&
			position_y_int<chunk_height&&
			chunk.data[index]!==block_air
		)||
		(
			position_y_int>-2&&
			position_y_int<chunk_height_m1&&
			chunk.data[index+1]!==block_air
		);
}
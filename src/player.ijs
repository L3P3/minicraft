const world_player_add=function(
	/** World */world,
	/** Player */player
){
	if(
		player.world!==null
	)
		world_player_remove(
			player.world,
			player
		);
	
	player.world=world;
	
	const data=
		storage_load(
			'w.'+world.label+'.p.'+player.label
		);
	
	//player was in world before
	if(
		data!==null
	){
		player.position_x=(data.charCodeAt(0)-(1<<15)*0.125);
		player.position_y=(data.charCodeAt(1)-(1<<15)*0.125);
		player.position_z=(data.charCodeAt(2)-(1<<15)*0.125);
		player.spawn_x=(data.charCodeAt(3)-(1<<15)*0.125);
		player.spawn_y=(data.charCodeAt(4)-(1<<15)*0.125);
		player.spawn_z=(data.charCodeAt(5)-(1<<15)*0.125);
	}
	//player is in world the first time
	else{
		player.position_x=player.spawn_x=world.spawn_x;
		player.position_y=player.spawn_y=world.spawn_y;
		player.position_z=player.spawn_z=world.spawn_z;
	}
	
	world.players['add'](player);
	world_entity_add(world,player);
	
	player_chunks_view_generate(player);
}

const world_player_save=function(
	/** World */world,
	/** Player */player
){
	storage_save(
		'w.'+world.label+'.p.'+player.label,
		float2bin(player.position_x)+
		float2bin(player.position_y)+
		float2bin(player.position_z)+
		int2bin(player.spawn_x)+
		int2bin(player.spawn_y)+
		int2bin(player.spawn_z)
	);
}

const world_player_remove=function(
	/** World */world,
	/** Player */player
){
	world.players['remove'](player);
	world.entities['remove'](player);
	player.chunk.entities['delete'](entity);
	
	world_player_save(world,player);
	
	player.world=null;
}

/**
	@constructor
*/
const Player=function(){}

/**
	@return {Player}
*/
const player_create=function(
	/** string */label
){
	const player=new Player();
	
	player.type=entity_type_player;
	player.gravity=true;
	player.label=label;
	player.world=null;
	player.chunks_view=null;
	
	player.gamemode=gamemode_creative;
	
	player.block_focus=[
		0,//type
		0,//x
		0,//y
		0,//z
		0//face
	];
	
	player.action_cooldown=0;
	player.action_left=false;
	player.action_right=false;
	
	game_players['set'](
		label,
		player
	);
}
Player.prototype=new Entity();

/**
	load all visible chunks
*/
const player_chunks_view_generate=function(
	/** Player */player
){
	const
		world=player.world,
		chunks_view=player.chunks_view,
		cx=player.chunk_x,
		cz=player.chunk_z,
		p_x_e=cx-view_distance-1,
		p_z_e=cz-view_distance-1,
		p_z_c=cz+view_distance+1;
	var
		p_x=cx+view_distance+1,
		i=view_distance_chunk_count;
	
	//x
	do{
		//z
		var p_z=p_z_c;
		
		do
			chunks_view[--i]=
				world_chunk_get(
					world,
					p_x,
					p_z
				);
		while(
			--p_z>p_z_e
		);
	}
	while(
		--p_x>p_x_e
	);
}

/**
	get relative chunk
	@return {Chunk}
*/
const player_chunk_get_rel=function(
	/** Player */player,
	/** number */x,
	/** number */z
){
	return
		player.chunks_visible[
			x<<view_distance_d_p1|
			z
		];
}

/**
	get chunk
	@return {Chunk}
*/
const player_chunk_get=function(
	/** Player */player,
	/** number */x,
	/** number */z
){
	return
		player_chunk_get_rel(
			player,
			x-player.chunk_x,
			z-player.chunk_z
		);
}

const player_spawn=function(
	/** Player */player
){
	player.position_x=player.spawn_x;
	player.position_y=player.spawn_y;
	player.position_z=player.spawn_z;
}
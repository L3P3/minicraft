/**
	@constructor
*/
const World=function(
	/** string */label
){
	var
		world=this,
		wgf=world.wgf=
			[
				//floor height avg
				5.0,
				//wave a
				PI_d*0.1,//freq
				1.0,//amp
				PI,//offset x
				PI,//offset z
				//wave b
				PI_d*0.07,//freq
				7.0,//amp
				PI,//offset x
				PI,//offset z
				//wave c
				PI_d*0.01,//freq
				17.0,//amp
				PI,//offset x
				PI//offset z
			],
		i=wgf.length,
		data,
		temp;

	world.players=new _Set;
	world.entities=new _Set;
	world.chunks_loaded=new _Map;
	world.save_time=
		(
			world.now=Date_now()
		)+autosave_delay;

	//world already existing?
	if(
		(
			data=storage_load(
				'w.'+
				(
					world.label=
					label
				)
			)
		)!==null
	){
		world.gamemode_creative=
			(
				(
					temp=bin2int(data,2)
				)&
				(1<<15)
			)!==0;
		world.sky_color=temp&0xffffff;
		world.seed=temp=bin2int(data,0);
		world.spawn_x=bin2float(data,4);
		world.spawn_y=bin2float(data,5);
		world.spawn_z=bin2float(data,6);
	}
	//new world?
	else{
		world.gamemode_creative=true;
		world.sky_color=0x84b1ff;
		world.seed=temp=prng(world.now);

		world.spawn_y=chunk_height_h*1.0;//TODO
		world.spawn_x=world.spawn_z=chunk_width_h*1.0;

		world_save_meta(world);
	}

	while(
		i
	)
		wgf[--i]*=
			rntf(
				temp=prng(temp)
			);

	wgf[0]+=20;

	world_all['set'](
		label,
		world
	);
}

const world_all=new _Set;

const world_tick=function(
	/** World */world,
	/** number */now
){
	//time
	var
		time_delta=now-world.now,
		entity;

	world.now=now;

	//physics
	for(
		entity of world.entities
	)
		entity_tick(
			world,
			entity,
			time_delta
		);

	//autosave
	if(
		world.save_time<now
	)
		world_save_chunks(world);
}

const world_save_meta=function(
	/** World */world
){
	storage_save(
		'w.'+world.label,
		int2bin(world.seed)+
		int2bin(
			world.sky_color
		)+
		float2bin(world.spawn_x)+
		float2bin(world.spawn_y)+
		float2bin(world.spawn_z)
	);
}

const world_save_chunks=function(
	/** World */world
){
	world_chunks_loaded_cleanup(world);

	for(
		var itm of world.chunks_loaded
	)
		chunk_save(
			world,
			itm
		);

	for(
		itm of world.players
	)
		world_player_save(world,itm);

	world.save_time=world.now+autosave_delay;
}

/**
	calculate chunk number from block number
	@return {number}
*/
const world_chunk_num_get=function(
	/** number */n
){
	return n>>chunk_width_l;
}

/**
	load chunk data from storage
	@return {?string}
*/
const chunk_storage_load=function(
	/** World */world,
	/** number */x,
	/** number */z
){
	return storage_load(
		'w.'+world.label+'.c.'+x+'/'+z
	);
}

/**
	save chunk data to storage
*/
const chunk_storage_save=function(
	/** World */world,
	/** number */x,
	/** number */z,
	/** string */data
){
	storage_save(
		chunk_storage_key(
			world,
			x,
			z
		),
		data
	);
}

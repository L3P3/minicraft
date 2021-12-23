const world_tree_create=function(
	/** World */world,
	/** number */x,
	/** number */y,
	/** number */z
){
	//stem
	var l=3+(Math.random()*4)|0;
	for(var iy=0;iy<l;iy++)
		world_block_set(world,x,y+iy,z,block_log);
	//leaves
	l+=2;
	for(var iy=(l*0.4)|0;iy<l;iy++){
		const ay=y+iy;
		for(var ix=-2;ix<3;ix++){
			const ax=x+ix;
			for(var iz=-2;iz<3;iz++){
				const az=z+iz;
				if(
					world_block_get(world,ax,ay,az)===block_air&&
					Math.sqrt(
						Math.abs(4-iy)*0.8+
						Math.sqrt(Math.abs(ix)+Math.abs(iz))
					)<1.8&&
					Math.random()>0.1
				)
					world_block_set(world,ax,ay,az,block_leaves);
			}
		}
	}
}
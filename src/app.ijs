const game_worlds=new Map();
const game_players=new Map();

setInterval(function(){
	const now=Date_now();
	
	for(var world of game_worlds)
		world_tick(world,now);
},50);
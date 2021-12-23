document.onmousemove=function(e){
	const
		input_cursor_x=(e.clientX/window.innerWidth)-0.5,
		input_cursor_y=(e.clientY/window.innerHeight)-0.5;
		player=world.player;
		
	player.rotation_x=input_cursor_y*PI;
	player.rotation_y=input_cursor_x*PI*2;
}

//Maustaste
var input_cursor_button_primary=false;
var input_cursor_button_secondary=false;
document.onmousedown=function(e){
	switch(e.button){
		case 0:
			input_cursor_button_primary=true;
			break;
		case 2:
			input_cursor_button_secondary=true;
			break;
	}
	return false;
}
document.onmouseup=function(e){
	switch(e.button){
		case 0:
			input_cursor_button_primary=false;
			break;
		case 2:
			input_cursor_button_secondary=false;
			break;
	}
	return false;
}

//Tastendruck
var input_key_move_x=0;
var input_key_move_y=0;
var input_key_move_z=0;
document.onkeydown=function(e){
	switch(e.keyCode){
		case 65://left
			input_key_move_x=-1;
			break;
		case 68://right
			input_key_move_x=1;
			break;
		
		case 16://down
			if(player.gravity)break;
			input_key_move_y=-1;
			break;
		case 32://up
			input_key_move_y=1;
			break;
		
		case 83://backward
			input_key_move_z=-1;
			break;
		case 87://forward
			input_key_move_z=1;
			break;
		
		case 88://bauen
			if(player_block_focus_enabled){
				chunk_block_set(
					player_block_focus_x,
					player_block_focus_y+1,
					player_block_focus_z,
					block_brick
				);
				player_action_cooldown=500;
			}
			break;
		case 89://abreißen
			if(player_block_focus_enabled){
				chunk_block_set(
					player_block_focus_x,
					player_block_focus_y,
					player_block_focus_z,
					block_air
				);
				player_action_cooldown=500;
			}
			break;
		
		case 33://zoom in
			player_view_range=3;
			break;
		case 34://zoom out
			player_view_range=0.5;
			break;
	}
}
document.onkeyup=function(e){
	switch(e.keyCode){
		case 65://left
		case 68://right
			input_key_move_x=0;
			break;
		case 16://down
			if(player.gravity)break;
		case 32://up
			input_key_move_y=0;
			break;
		case 83://backward
		case 87://forward
			input_key_move_z=0;
			break;
		
		case 107:
			location.href='#'+(resmult+1);
			location.reload();
			break;
		case 109:
			location.href='#'+(resmult-1);
			location.reload();
			break;
		//Schwärzen
		case 70:
			player_view_fog=!player_view_fog;
			player_view_distance=player_view_fog?64:256;
			break;
		//Zoom
		case 33:
		case 34:
			player_view_range=1;
			break;
		//Debug
		case 113:
			show_debug=!show_debug;
			break;
	}
}
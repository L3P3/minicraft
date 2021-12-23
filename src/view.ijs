const canvas_html=document.getElementById('canvas');

var resmult=Number(location.hash.substring(1));
if(isNaN(resmult)||!resmult)resmult=4;

const canvas_sx=canvas_html.width=Math.max(Math.round(window.innerWidth/resmult),1);
const canvas_sy=canvas_html.height=Math.max(Math.round(window.innerHeight/resmult),1);
const canvas_sy_break=1/canvas_sy;

const canvas_center_x=(canvas_sx*0.5)|0;
const canvas_center_y=(canvas_sy*0.5)|0;

const canvas_context=canvas_html.getContext('2d');
const canvas_pixels=canvas_context.createImageData(canvas_sx,canvas_sy);
const canvas_pixels_data=canvas_pixels.data;

canvas_context.font='12px "Courier New",Courier,monospace';

//Bild solid machen
(function(){
	const length=canvas_sx*canvas_sy*4+3;
	var index=3;
	do{
		canvas_pixels_data[index]=0xff;
	}
	while(
		index+=4<length
	);
})();

var view_fog=false;

/**
	draw ingame image
*/
const game_render=function(){
	//player
	const
		player=game_player,
		world=player.world;
	
	//if nothing changed yet TODO
	if(
		!world.ticked
	)
		return;
	
	const
		rotation_x_cos=Math_cos(player.rotation_x),
		rotation_x_sin=Math_sin(player.rotation_x),
		rotation_y_cos=Math_cos(player.rotation_y),
		rotation_y_sin=Math_sin(player.rotation_y);
	
	//Abkühlung
	player_action_cooldown=Math.max(0,player_action_cooldown-time_delta);
	
	if(player_action_cooldown===0){
		//Graben, falls primäre Taste gedrückt
		if(input_cursor_button_primary){
			if(player_block_focus_enabled){
				chunk_block_set(
					player_block_focus_x,
					player_block_focus_y,
					player_block_focus_z,
					block_air
				);
				player_action_cooldown=500;
			}
		}
		//Bauen, falls sekundäre Taste gedrückt
		else if(input_cursor_button_secondary){
			if(player_block_focus_enabled){
				chunk_block_set(
					player_block_focus_x,
					player_block_focus_y+1,
					player_block_focus_z,
					block_brick
				);
				player_action_cooldown=500;
			}
		}
	}
	
	//Ausgabestrom-Index
	var canvas_pixels_data_index=0;
	//Pixelkoordinaten
	var canvas_x=0;
	var canvas_y=0;
	//Sichtlinienparameter
	var canvas_x_relative;
	var canvas_y_relative;
	var canvas_z_relative;
	//Dimensionslänge
	var canvas_x_length;
	var canvas_y_length;
	var canvas_z_length;
	//Pixeleigenschaften
	var pixel_color;
	var pixel_brightness;
	var pixel_ddist;
	
	player_block_focus_enabled=false;
	var center_is_x=false;
	var center_is_y=false;
	var center_is=false;
	
	var id;
	var background_color;

	//Alle Pixel durchgehen
	do{
		center_is_y=(canvas_y===canvas_center_y);
		
		canvas_y_relative=(canvas_sy*0.5-canvas_y)*canvas_sy_break;
		canvas_z_relative=(
			player_rotation_x_cos*player_view_range+
			player_rotation_x_sin*canvas_y_relative
		);
		
		background_color=0;
		if(true)background_color=world_sky_color;
		
		canvas_x=0;
		do{
			center_is_x=(canvas_x===canvas_center_x);
			
			center_is=(center_is_x&&center_is_y);
			
			canvas_x_relative=(canvas_x-canvas_sx*0.5)*canvas_sy_break;
			
			canvas_x_length=(
				player_rotation_y_cos*canvas_x_relative+
				player_rotation_y_sin*canvas_z_relative
			);
			canvas_y_length=(
				player_rotation_x_cos*canvas_y_relative-
				player_rotation_x_sin*player_view_range
			);
			canvas_z_length=(
				player_rotation_y_cos*canvas_z_relative-
				player_rotation_y_sin*canvas_x_relative
			);
			
			pixel_color=background_color;
			pixel_brightness=255;
			pixel_ddist=0;
			
			//Sichtlinie für Pixel ablaufen
			var closest=player_view_distance;
			var dimLength,initial;
			for(var d=0;d<3;d++){
				if(d===0)dimLength=canvas_x_length;
				else if(d===1)dimLength=canvas_y_length;
				else if(d===2)dimLength=canvas_z_length;

				var ll=1/Math.abs(dimLength);
				var xd=(canvas_x_length)*ll;
				var yd=(canvas_y_length)*ll;
				var zd=(canvas_z_length)*ll;
				
				if(d===0)initial=player.position_x-(player.position_x|0);
				else if(d===1)initial=player.position_y-(player.position_y|0);
				else if(d===2)initial=player.position_z-(player.position_z|0);
	
				if(dimLength>0)initial=1-initial;

				var dist=ll*initial;

				var xp=player.position_x+xd*initial;
				var yp=player.position_y+yd*initial;
				var zp=player.position_z+zd*initial;

				if(dimLength<0){
					if(d===0)xp--;
					else if(d===1)yp--;
					else if(d===2)zp--;
				}

				while(dist<closest){
					if(yp>=0&&yp<chunk_height){
						id=chunk_block_get(xp,yp,zp);
					}
					else{
						if(yp<0){
							if(yd<0)break;
							id=block_air;
						}
						else if(yp>=chunk_height){
							if(yd>0)break;
							id=block_air;
						}
					}
					
					if(id>block_air){
						if(center_is){
							player_block_focus_x=xp;
							player_block_focus_y=yp;
							player_block_focus_z=zp;
							player_block_focus_enabled=true;
						}
						
						var u=((xp+zp)*texture_resolution)&0xf;
						var v=((yp*texture_resolution)&0xf)+texture_resolution;
						if(d===1){
							u=(xp*texture_resolution)&0xf;
							v=(zp*texture_resolution)&0xf;
							if(yd<0)v+=32;
						}

						var cc=texture_map[
							id*texture_resolution*texture_resolution*3+
							v*texture_resolution+
							u
						];
						if(cc>0){
							pixel_color=cc;
							pixel_ddist=0xff-((dist/32*0xff)|0);
							pixel_brightness=0xff-((d+2)%3)*50;
							closest=dist;
						}
						//Ansonsten: Transparenter Pixel!
					}
					
					xp+=xd;
					yp+=yd;
					zp+=zd;
		
					dist+=ll;
				}
			}
			
			var cfact=pixel_brightness/255;
			if(player_view_fog)cfact*=pixel_ddist/255;
			
			//Zielkreuz
			if(
				(center_is_y&&Math.abs(canvas_center_x-canvas_x)<6)||
				(center_is_x&&Math.abs(canvas_center_y-canvas_y)<6)
			){
				canvas_pixels_data[canvas_pixels_data_index]=0xff;
				canvas_pixels_data[++canvas_pixels_data_index]=0xff;
				canvas_pixels_data[++canvas_pixels_data_index]=0xff;
				canvas_pixels_data_index+=2;
				
				continue;
			}
			
			//Rot
			canvas_pixels_data[canvas_pixels_data_index]=((pixel_color>>16)&0xff)*cfact;
			//Grün
			canvas_pixels_data[++canvas_pixels_data_index]=((pixel_color>>8)&0xff)*cfact;
			//Blau
			canvas_pixels_data[++canvas_pixels_data_index]=(pixel_color&0xff)*cfact;

			canvas_pixels_data_index+=2;
		}
		while(++canvas_x<canvas_sx);
	}
	while(++canvas_y<canvas_sy);

	canvas_context.putImageData(canvas_pixels,0,0);
	
	if(show_debug){
		canvas_context.fillText(
			(
				'Minicraft '+version+'\n'+
				fps+' fps, T: inf vsync\n'+
				'C: '+view_distance_chunk_count+', D: '+view_distance+'\n'+
				'E: 0/'+entities.size+'\n\n'+
				'X/Y/Z: '+player.position_x+' / '+player.position_y+' / '+player.position_z+'\n'+
				'Block: '+(player.position_x|0)+' '+(player.position_y|0)+' '+(player.position_z|0)+'\n'+
				'Chunk: - - - in - - -\n'+
				'Facing: -'
			),
			5,
			5
		);
	}
}
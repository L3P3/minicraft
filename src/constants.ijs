<?
	if(vars.app_mode_client===undefined)
		vars.app_mode_client=false;
?>

const version=0.0;

const block_air=0;
const block_stone=1;
const block_grass=2;
const block_dirt=3;
const block_cobblestone=4;
const block_planks=5;
const block_bedrock=6;
const block_log=7;
const block_leaves=8;
const block_brick=9;
const block_wool=10;

const face_top=0;
const face_bottom=1;
const face_north=2;
const face_east=3;
const face_south=4;
const face_west=6;

const entity_type_player=1;

const gamemode_survival=0;
const gamemode_creative=1;
const gamemode_spectator=2;

const world_width_l=13;
const world_width_h_l=world_width_l-1;
const world_width_h=1<<world_width_h_l;

const chunk_width_l=4;
const chunk_width_l_d=chunk_width_l<<1;
const chunk_height_l=chunk_width_l+2;
const chunk_width=1<<chunk_width_l;
const chunk_height=1<<chunk_height_l;
const chunk_width_h_l=chunk_width_l-1;
const chunk_width_h=1<<chunk_width_h_l;
const chunk_height_h_l=chunk_height_l-1;
const chunk_height_h=1<<chunk_height_h_l;
const chunk_width_m1=chunk_width-1;
const chunk_height_m1=chunk_height-1;

const chunk_data_length_l=chunk_width_l_d+chunk_height_l;
const chunk_data_length=1<<chunk_data_length_l;
const view_distance_l=2;
const view_distance=1<<view_distance_l;
const view_distance_d_l=view_distance_l-1;
const view_distance_d=1<<view_distance_d_l;
const view_distance_d_p1=view_distance_d+1;
const view_distance_chunk_count=view_distance_d_p1*view_distance_d_p1;
const view_distance_cache=view_distance+24;

const autosave_delay=10*6e4;

var show_debug=false;
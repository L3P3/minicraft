const texture_count=16;
const texture_resolution=16;
const texture_map=new _Uint32Array(texture_count*texture_resolution*texture_resolution*3);

(function(){
	for(var id=1;id<texture_count;++id){
		var br=255-((Math.random()*96)|0);
		for(var y=0;y<texture_resolution*3;y++){
			for(var x=0;x<texture_resolution;x++){
				var color=0x966C4A;
				if(id===block_stone)
					color=0x7F7F7F;
				if(id!==block_stone||((Math.random()*3)|0)<1)
					br=0xff-((Math.random()*96)|0);
				if(id===block_grass){
					if((16*3-y)<(((x*x*3+x*81)>>2)&3)+18)
						color=0x6AAA40;
					else if((16*3-y)<(((x*x*3+x*81)>>2)&3)+19)
						br*=2/3;
				}
				if(id===block_log){
					color=0x675231;
					if(x>0&&x<15&&((y>0&&y<15)||(y>32&&y<47))){
						color=0xBC9862;
						var xd=(x-7);
						var yd=((y&15)-7);
						if(xd<0)
							xd=1-xd;
						if(yd<0)
							yd=1-yd;
						if(yd>xd)
							xd=yd;
						
						br=196-((Math.random()*32)|0)+xd%3*32;
					}
					else if(((Math.random()*2)|0)===0)
						br*=(150-(x&1)*100)/100;
				}
				if(id===block_brick) {
					color=0xB53A15;
					if((x+(y>>2)*4)%8===0||y%4===0)
						color=0xBCAFA5;
				}
				if(id===block_wool)
					color=0x4040ff;
				var brr=br;
				if(y>=32)
					brr*=0.5;
				
				if(id===block_leaves){
					color=0x50D937;
					if(((Math.random()*2)|0)===0){
						color=0;
						brr=0xff;
					}
				}
				else if(id===block_bedrock){
					color=0x353535;
					if(((Math.random()*2)|0)===0){
						color=0x010101;
						brr=0xFF;
					}
				}
				
				texture_map[
					id*texture_resolution*texture_resolution*3+
					y*texture_resolution+
					x
				]=(
					((((color>>16)&0xff)*brr/0xff)<<16)|
					((((color>>8)&0xff)*brr/0xff)<<8)|
					(((color)&0xff)*brr/0xff)
				);
			}
		}
	}
})();
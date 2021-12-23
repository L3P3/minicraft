const window_requestAnimationFrame=(
	window.requestAnimationFrame||
	window.mozRequestAnimationFrame||
	window.webkitRequestAnimationFrame||
	function(f){setTimeout(f,1);}
);

var
	clock_f=0,
	clock_fps=0,
	time_now=0,
	time_last=(new Date).getTime();

const clock=function(){
	++clock_f;
	//Zeit berechnen
	const time_delta=(
		time_now=(new Date).getTime()
	)-time_last;
	time_last=time_now;
	
	world_physics(world,time_delta);
	
	render();

	document.title='Minicraft*'+resmult;
	
	window_requestAnimationFrame(clock);
}

setTimeout(clock,1);
setInterval(function(){
	clock_fps=clock_f;
	clock_f=0;
},1000);
/**
	xorshift
	@return {number}
*/
const prng=function(
	/** number */n
){
	n^=n<<13;
	n^=n>>17;
	n^=n<<5;
	return n;
}

/**
	-1.0 to 1.0
	@return {number}
*/
const rntf=function(
	/** number */n
){
	return n/(1<<31);
}

/**
	0.0 to 1.0
	@return {number}
*/
const rntfp=function(
	/** number */n
){
	return (n>>>1)/(1<<30);
}
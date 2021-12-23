/**
	@return {string}
*/
const float2bin=function(
	/** number */n
){
	return
		String_fromCharCode(
			(
				n*8.0
				+(1<<15)
			)|0
		);
}

/**
	@return {number}
*/
const bin2float=function(
	/** string */s,
	/** number */i
){
	return
		(
			(
				s.charCodeAt(i)|0
			)
			-(1<<15)
		)*0.125;
}

/**
	converts an int32 to binary string
	@return {string}
*/
const int2bin=function(
	/** number */n
){
	return
		String_fromCharCode(
			(n<0?0x8000:0)|
			(n&0x7fffffff)>>16
		)+
		String_fromCharCode(
			n&0xffff
		);
}

/**
	converts binary string to int32
	@return {number}
*/
const bin2int=function(
	/** string */s,
	/** number */i
){
	return
		(
			s.charCodeAt(i)<<16|
			s.charCodeAt(++i)
		);
}
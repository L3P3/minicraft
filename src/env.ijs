const env_natarray_use=true;

/// ALIASES ///
const _Uint8Array=env_natarray_use?Uint8Array:Array;
const _Uint32Array=env_natarray_use?Uint32Array:Array;
const storage=localStorage;
const storage_load=function(key){return storage['getItem'](key);}
const storage_save=function(key,value){storage['setItem'](key,value);}
const String_fromCharCode=String['fromCharCode'];
const JSON_=JSON;
const JSON_stringify=JSON_['stringify'];
const JSON_parse=JSON_['parse'];
const Date_now=Date['now'];
const Math_=Math;
const Math_log=Math_['log'];
const Math_sin=Math_['sin'];
const Math_abs=Math_['abs'];
const Math_floor=Math_['floor'];
const PI=Math_['PI'];
const PI_d=PI*2.0;

const _Set=Set;
const _Map=Map;

const data = [
	{in: 1.3, out: 2, room: 's'},
	{in: 3, out: 4, room: 's'},
	{in: 15.3, out: 16, room: 's'},
	{in: 16, out: 16.3, room: 's'},
	{in: 17, out: 18, room: 's'}
];

function getMap(intervals){

	var map = [];
	for(var i=0;i<intervals;i++){
		map.push({index: i, flag: true});
	}
	return map;
}

function isAvailable(sampleIN, sampleOUT, room){
	var i, j, _in, _out, flag=true, local=[];
	var map = getMap(48);

	for(i=0;i<data.length;i++){
		if(data[i].room===room){
			local.push(data[i]);
		}
	}

	if(local.length<1){
		return true;
	}

	for(i=0;i<local.length;i++){
		_in = Math.ceil(local[i].in * 2);
		_out = Math.ceil(local[i].out * 2) - 1;

		for(j=_in;j<=_out;j++){
			map[j].flag = false;
		}
	}

	_in = Math.ceil(sampleIN * 2);
	_out = Math.ceil(sampleOUT * 2) - 1;

	for(i=_in;i<=_out;i++){
		if(!map[i].flag){
			flag=false;
			break;
		}
	}
	return flag;
}

module.exports = function(){
	var i, j, keys = [], others=['c', 's', 'j'];
	for(i=0;i<data.length;i++){
		if(keys.indexOf(data[i].room) === -1){
        	keys.push(data[i].room);        
    	} 
	}
	for(i=0;i<keys.length;i++){
		console.log(keys[i], isAvailable(17, 18, keys[i]));
	}
	if(keys.length !== others.length){
		for(i=0;i<keys.length;i++){
			for(j=0;j<others.length;j++){
				if(keys[i]!==others[j]){
					console.log(others[j], true);
				}
			}
	}
	}
}();
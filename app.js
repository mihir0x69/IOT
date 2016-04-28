module.exports = function(){

	var keys = [{name: 'a', age: 15}, {name: 'a', age: 17}, {name: 'b', age: 17}], clean = [];

	for(var i in keys){

		flag = true;

		if(i==0){
			clean.push(keys[i]);
		}
		for(j=0;j<clean.length;j++){
			if(clean[j].name === keys[i].name){
				flag=false;
			}
		}
		if(flag){
			clean.push(keys[i]);
			flag=!flag;
		}
	}
	console.log(clean);

}();
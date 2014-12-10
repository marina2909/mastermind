$(document).ready(function(){
	var options = Options();
	var playGround;
	
	reCreate();
	options.setOnSelect(function(){
		reCreate();
	});
	options.setOnReset(function(){
		reCreate();
	});
	options.setOnGiveUp(function(){
		playGround.giveUp();
	});
	
	
	function reCreate(){
		if (playGround) playGround.clear();
		playGround = new PlayGround(options.colorNumber, options.placeNumber);
		playGround.setOnAgain(reCreate);
	}

});
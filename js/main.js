$(document).ready(function(){
	var options = Options();
	var playGround = PlayGround();
	
	reCreate();
	
	options.setOnStart(reCreate);
	options.setOnGiveUp(playGround.giveUp);
	
	function reCreate(){
		playGround.createNewGame(options.colorNumber, options.placeNumber);
		playGround.setOnAgain(reCreate);
	}

});
function Options(){
	var place = $(".selector.placeNumber");
	var color = $(".selector.colorNumber");
	var reset = $(".options .reset");
	var giveup = $(".options .giveup");
	var placeNumber = place.val();
	var colorNumber = color.val();
	
	
	var onSelect = function(){};
	var onReset = function(){};
	var onGiveUp = function(){};
	
	place.change(function(){
		placeNumber = place.val();
		onSelect();
	});
	
	color.change(function(){
		colorNumber = color.val();
		onSelect();
	});
	
	reset.click(function(){onReset();});
	giveup.click(function(){onGiveUp();});
	
	return{
		get colorNumber() {return colorNumber},
		get placeNumber() {return placeNumber},
		setOnSelect: function(handler){
			onSelect = handler; 
		},
		setOnReset: function(handler){
			onReset = handler;
		},
		setOnGiveUp: function(handler){
			onGiveUp = handler;
		}
	};
}
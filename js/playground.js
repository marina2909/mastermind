function PlayGround(numberColors, numberPlaces){
	var playground = $(".main-playground");
	var numberOfTries = 10;
	var guessPattern = [];
	var dialog = $(".dialog");
	var onAgain;
	var rows;
	
	createRows();
	generateGuessPattern();
	
	$(".code-peg").click(function(e){
		
		$(".code-peg-group.selected").removeClass("blink");
		$(".message").empty();
		var peg = $(this);
		
		if (peg.parent().hasClass("selected")){
		
			// fetch current color
			var currentColor = peg.data("color");
			peg.removeClass("color"+currentColor);
			
			//  set next color
			var newColor = (currentColor == (numberColors-1)) ? 0 : ++currentColor;
			peg.addClass("color"+newColor).data("color", newColor);
			
			previousTile = peg;
			
		}
	});
	
	$(".check-button").click(function(e){
		
		var parent = $(this).parent();
		var codePegs = parent.find(".code-peg-group").find(".code-peg");
		
		if (!isCurrentPopulated(codePegs)){
			$(".code-peg-group.selected").addClass("blink");
			$(".message").html("Insert all colors before checking and going to the next line");
			return;
		}
		
		if (parent.data("row") == numberOfTries){
			showDialog("You lost!");
			return;
		}
		
		var keyPegs = parent.find(".key-peg-group").find(".key-peg"); 	
		
		// set black and white key Pegs
		var circlesCount = calculateBlackAndWhite(keyPegs, codePegs);
		setKeyPegs(keyPegs, codePegs, circlesCount.blackCount, circlesCount.whiteCount);
		
		if (circlesCount.blackCount == numberPlaces){
			showDialog("You won!");
			return;
		}
		
		// remove from current row
		parent.find(".check-button").removeClass("selected");
		parent.find(".code-peg-group").removeClass("selected");
		
		// set next row
		var nextParent = $(rows[rows.length - parent.data("row") - 1]); 
		nextParent.find(".check-button").addClass('selected');
		nextParent.find(".code-peg-group").addClass('selected');
		
	});
	
	function showDialog(msg){
		dialog.empty().append(msg).append($('<button/>', { 
			html: 'Play Again',
			click: function(){
				onAgain();
				dialog.hide();
			}
		}));
		dialog.show();
	}
	
	function giveUp(){
		var guessPegs = $(".guess").find(".code-peg");
		for (var i=0; i<numberPlaces; i++){
			$(guessPegs[i]).addClass("color"+guessPattern[i]);
		}	
		
		// make last peg unclicable
		$(".code-peg-group").removeClass("selected");
	}
	
	function isCurrentPopulated(codePegs){
		for (var i=0; i<numberPlaces; i++){
			if($(codePegs[i]).data("color") == -1)
				return false;
		}
		return true;
	}
	
	
	function calculateBlackAndWhite(keyPegs, codePegs){
		
		// count black
		var blackCount = 0;
		for (var i=0; i<numberPlaces; i++){
			if ($(codePegs[i]).data("color") == guessPattern[i]){
				blackCount++;
			}
		}
		
		// count white
		var blackWhite = 0;
		var guess = {};
		var curr = {};
		for(var i=0; i<numberColors; i++){
			curr[i] = 0;
			guess[i] = 0;
		}
		for(var i=0; i<numberPlaces; i++){
			curr[$(codePegs[i]).data("color")]++;
			guess[guessPattern[i]]++;
		}
		for (var i=0; i<numberColors; i++){
			blackWhite += Math.min(curr[i], guess[i]);
		}
		whiteCount = blackWhite - blackCount;
		
		return {
			blackCount : blackCount,
			whiteCount : whiteCount
		};
	}
	
	function setKeyPegs(keyPegs, codePegs, blackCount, whiteCount){
		
		// set black
		for (var i=0; i<blackCount; i++){
			$(keyPegs[i]).addClass("black");
		}	
		
		// set white
		for (var i=0; i<whiteCount; i++){
			$(keyPegs[i + blackCount]).addClass("white");
		}
		
	}
	
	function createRows(){
		createFirstRow();
		var row;
		for(var i=numberOfTries; i>0; i--){
			row = $('<div/>', {
				'class': 'row'
			}).data('row', i);
			row.append(createRowNumber(i));
			row.append(createCodePegs());
			row.append(createKeyPegs());
			row.append(createCheckBtn());
			playground.append(row);
		}
		row.find(".check-button").addClass("selected"); // show check button
		row.find(".code-peg-group").addClass("selected"); // set border arounf code pegs
		rows = $(".row");
	}

	function createFirstRow(){
		var row = $('<div/>', {
			'class': 'guess'
		});
		for (var j=0; j<numberPlaces; j++){
			var tile = $('<div/>', {
				'class': 'code-peg',
				html: '?'
			});
			row.append(tile);
		}
		playground.append(row);
	}
	
	function createRowNumber(i){
		var rowNumber = $('<div/>', {
			'class': 'row-number',
			html: i
		});
		return rowNumber;
	}
	
	function createCodePegs(){
		var codePegs = $('<div/>', {
				'class': 'code-peg-group'
			});
		for(var j=0; j<numberPlaces; j++){
			var peg = $('<div/>', {
				'class': 'code-peg'
			}).data('color', -1);
			codePegs.append(peg);
		}
		return codePegs;
	}
	
	function createKeyPegs(){
		var keyPegs = $('<span/>', {
			'class': 'key-peg-group'
		});
		for(var j=0; j<numberPlaces; j++){
			var peg = $('<div/>', {
				'class': 'key-peg'
			});
			keyPegs.append(peg);
		}
		return keyPegs;
	}
	
	function createCheckBtn(){
		var btn = $('<button/>', {
			'class': 'check-button',
			html: 'Check'
		});
		return btn;
	}
	
	function generateGuessPattern(){
		guessPattern = [];
		for(var i=0; i<numberPlaces; i++){
			var randomColor = Math.floor(Math.random() * numberColors);
			guessPattern.push(randomColor);
		}
	}
	
	return {
		clear: function(){
			playground.empty();
		},
		giveUp: giveUp,
		setOnAgain: function(handler){
			onAgain = handler;
		}
	}

}
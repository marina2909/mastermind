function PlayGround(){
	var numberColors;
	var numberPlaces;
	var board = $('.main-playground');
	var numberOfTries = 10;
	var guessPattern = [];
	var dialog = $('.dialog');;
	var onAgain = function(){};
	var rows;

	$('.main').click(function(e){
		if ($(e.target).closest(".check-button.active").length > 0) return;
		$('.message').empty();
	});
	
	function createNewGame(numColors, numPlaces){
		numberColors = numColors;
		numberPlaces = numPlaces;
		board.empty();
		generateGuessPattern(numberColors, numberPlaces);
		createRows(numberColors, numberPlaces);
	}
	
	function generateGuessPattern(numberColors, numberPlaces){
		guessPattern = [];
		for(var i=0; i<numberPlaces; i++){
			var randomColor = Math.floor(Math.random() * numberColors);
			guessPattern.push(randomColor);
		}
	}
	
	function createRows(numberColors, numberPlaces){
		createGuessRow(numberPlaces);
		for(var i=numberOfTries; i>0; i--){
			var row = $('<div class="row"></div>').data('row', i);
			
			row.append('<div class="row-number">' + i + '</div>');
			
			row.append(createCodePegs(numberPlaces));
			row.append(createKeyPegs(numberPlaces));
			
			var checkButton = $('<button class="check-button">Check</button>');
			checkButton.click(onCheckButtonClick);
			row.append(checkButton);
			
			board.append(row);
		}
		board.find('.check-button:last').addClass('active'); // show check button
		board.find('.code-peg-group:last').addClass('active'); // set border around code pegs
		rows = $('.row');
	}

	
	function onCodePegClick(){
		
		$('.code-peg-group.active').removeClass('blink');
		$('.message').empty();
		var peg = $(this);
		
		if (peg.parent().hasClass('active')){
		
			// fetch current color
			var currentColor = peg.data('color');
			peg.removeClass('color' + currentColor);
			
			//  set next color
			var newColor = (currentColor + 1) % numberColors;
			peg.addClass('color' + newColor).data('color', newColor);
			
		}
	};
	
	
	function showDialog(msg){
		$('.dialogCover').show();
		dialog.empty().append(msg).append($('<button/>', { 
			html: 'Play Again',
			click: function(){
				onAgain();
				dialog.hide();
				$('.dialogCover').hide();
			}
		}));
		dialog.show();
	}
	
	function giveUp(){
		
		showSolution();
		
		// make last peg unclicable
		$('.code-peg-group.active').removeClass('active');
		$('.check-button.active').removeClass('active');
	}
	
	function showSolution(){
		var guessPegs = $('.guess .code-peg');
		// show solution
		for (var i=0; i<numberPlaces; i++){
			$(guessPegs[i]).addClass('color'+guessPattern[i]);
		}	
	}
	
	function isRowPopulated(codePegs){
		for (var i=0; i<codePegs.length; i++){
			if($(codePegs[i]).data('color') == -1) return false;
		}
		return true;
	}
	
	
	function calculateBlackAndWhite(keyPegs, codePegs, numberPlaces){
		
		// count black
		var blackCount = 0;
		codePegs.each(function(i){
			if ($(this).data('color') == guessPattern[i]){
				blackCount++;
			}
		});
		
		// count white
		var blackWhite = 0;
		var guess = {};
		var curr = {};
		for(var i=0; i<numberColors; i++){
			curr[i] = 0;
			guess[i] = 0;
		}
		
		codePegs.each(function(i){
			curr[$(this).data('color')]++;
			guess[guessPattern[i]]++;
		});
		
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
		
		keyPegs.filter(function(i){return i<blackCount}).addClass('black');
		keyPegs.filter(function(i){return (i>=blackCount && i<(blackCount+whiteCount))}).addClass('white');
		
	}

	function createGuessRow(numberPlaces){
		var row = $('<div class="guess"></div>');
		for (var j=0; j<numberPlaces; j++){
			row.append('<div class="code-peg">?</div>');
		}
		board.append(row);
	}
	
	function createCodePegs(numberPlaces){
		var codePegs = $('<div class="code-peg-group"></div>');
		codePegs.on('animationend webkitAnimationEnd', function(){
			$('.code-peg-group.blink').removeClass('blink');
		});
		for(var j=0; j<numberPlaces; j++){
			var peg = $('<div/>', {
				'class': 'code-peg',
				click: onCodePegClick
			}).data('color', -1);
			codePegs.append(peg);
		}
		return codePegs;
	}
	
	function createKeyPegs(numberPlaces){
		var keyPegs = $('<div class="key-peg-group"></div>');
		for(var j=0; j<numberPlaces; j++){
			keyPegs.append('<div class="key-peg"></div>');
		}
		return keyPegs;
	}
	
	function onCheckButtonClick(){
		
		var parent = $(this).parent();
		var codePegs = parent.find('.code-peg-group .code-peg');
		
		if (!isRowPopulated(codePegs)){
			$('.code-peg-group.active').addClass('blink');
			$('.message').html('Insert all colors before checking and going to the next line');
		} else if (parent.data('row') == numberOfTries){
				showDialog('You lost!');
		} else {
			
			var keyPegs = parent.find('.key-peg-group .key-peg'); 	
			
			// set black and white key Pegs
			var keyPegsCount = calculateBlackAndWhite(keyPegs, codePegs, numberPlaces);
			setKeyPegs(keyPegs, codePegs, keyPegsCount.blackCount, keyPegsCount.whiteCount);
			
			if (keyPegsCount.blackCount == numberPlaces){
				showDialog('You won!');
				showSolution();	
			} else {
			
				// remove from current row
				parent.find('.check-button').removeClass('active');
				parent.find('.code-peg-group').removeClass('active');
				
				// set next row
				var nextParent = $(rows[rows.length - parent.data('row') - 1]); 
				nextParent.find('.check-button').addClass('active');
				nextParent.find('.code-peg-group').addClass('active');
			}
		}
	};

	
	return {
		giveUp: giveUp,
		setOnAgain: function(handler){
			onAgain = handler;
		},
		createNewGame: createNewGame
	}

}
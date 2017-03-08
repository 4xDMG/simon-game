$(document).ready(function() {
	
	//Click event for power switch
	$("#powerBtnToggle").click(function() {
		if ($(this).hasClass("powerBtnOff")) {
			$(this).removeClass("powerBtnOff");
			$(this).addClass("powerBtnOn");
			$("#counterText").text("- -");
		} else {
			$(this).removeClass("powerBtnOn");
			$(this).addClass("powerBtnOff");
			$("#counterText").text("");
			movesMadeArray = [];
			moveCounter = 0;
			gameInProgress = false;
			strictMode = false;
			$("#strictIndicator").removeClass("strictIndicatorActive");
		}
	});
	
	//Initialise variables
	var moveCounter = 0;
	var moveSelectionArray = ["redBtn", "blueBtn", "yellowBtn", "greenBtn"];
	var movesMadeArray = [];
	var gameInProgress = false;
	var playbackCount = 0;
	var playbackInProgress = false;
	var strictMode = false;
	var clickDisabled = false;
	
	//Code to start game running
	$("#startBtn").click(function() {
		if ($("#powerBtnToggle").hasClass("powerBtnOn") && gameInProgress === false) {
			moveSelection();
			movesMadePlayback();
			gameInProgress = true;
		}
	});
	
	//Handles click events for colored game buttons
	$('.gameBtn').click(function(event) {
		if (gameInProgress && playbackInProgress === false && clickDisabled === false) {
			clickDisabled = true;
			var currentBtn = event.target.id;
			if (movesMadeArray[moveCounter] == currentBtn) {
				btnPush(currentBtn);
				moveCounter++;
			}else if (strictMode) {
				btnPush(currentBtn);
				setTimeout(function() {
					wrongMove();
				}, 800);
				setTimeout(function() {
					movesMadeArray = [];
					moveCounter = 0;
					moveSelection();
					movesMadePlayback();
				}, 1700);
			} else {
				moveCounter = 0;
				wrongMove();
				setTimeout(function() {
					updateCounterDisplay(movesMadeArray.length);
					movesMadePlayback();
				}, 1500);
				
			}
			if (moveCounter > movesMadeArray.length - 1) {
				updateCounterDisplay(moveCounter);
				setTimeout(function() {
					moveCounter = 0;
					moveSelection();
					movesMadePlayback();
				}, 800);
			}
		} 		
	});
	
	//Plays back the moves before the player has to repeat the sequence
	function movesMadePlayback() {
		setTimeout(function() {
			playbackInProgress = true;
			var currentIdInArr = movesMadeArray[playbackCount];
			btnPush(currentIdInArr);
			playbackCount++;
			updateCounterDisplay(movesMadeArray.length);
			if (movesMadeArray.length - 1 >= playbackCount) {
				movesMadePlayback();
			} else {
				playbackCount = 0;
				playbackInProgress = false;
			}
			clickDisabled = false;
		}, 1000);
	}
	
	//Select a random move to add to the movesMadeArray
	function moveSelection() {
		if (movesMadeArray.length < 20) {
			var index = Math.floor(Math.random()*4);
			movesMadeArray.push(moveSelectionArray[index]);		
		} else {
			alert("You win!");
			movesMadeArray = [];
			moveCounter = 0;
			setTimeout(function() {
				moveSelection();
				movesMadePlayback();
			}, 1500);
		}
	}
	
	//Handles events of 'button pushes' for computer and player turns
	function btnPush(id) {
		var currentId = "#" + id;
		var currentClass = id + "Push";
		var audioId = id + "Audio";
		$(currentId).addClass(currentClass);
		playAudio(audioId);
		setTimeout(function() {
			$(currentId).removeClass(currentClass);
			clickDisabled = false;
		}, 600);
	}
	
	//Plays audio - needs fixing to making tone play for 1-2 seconds and while button is held down
	function playAudio(audioId) {
		document.getElementById(audioId).play();
	}
	
	
	//Updates the counter display to the current total number of moves
	function updateCounterDisplay(numOfMoves) {
		if (numOfMoves < 10) {
			$("#counterText").text("0 " + numOfMoves);
		} else if (numOfMoves < 20){
			numOfMoves = String(numOfMoves);
			$("#counterText").text("1 " + numOfMoves.charAt(1));
		} else {
			$("#counterText").text("2 0");
		}
	}
	
	
	//If a player makes a wrong move this function will trigger twice as a notification
	var wrongCount = 0;
	
	function wrongMove() {
		setTimeout(function() {		
			playAudio('yellowBtnAudio');
			$("#counterText").text("- -");
			wrongCount++;
			if (wrongCount < 3) {
				wrongMove();
			} else {
				wrongCount = 0;				
			}
		}, 350);
	}
	
	//Enables or disables strict mode
	$("#strictBtn").click(function() {
		if ($("#powerBtnToggle").hasClass("powerBtnOn") && strictMode === false) {
			strictMode = true;
			$("#strictIndicator").addClass("strictIndicatorActive");
		} else if ($("#powerBtnToggle").hasClass("powerBtnOn") && strictMode === true){
			strictMode = false;
			$("#strictIndicator").removeClass("strictIndicatorActive");
		}
	});
	
});

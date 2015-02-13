window.onload = function(){
	var step = 0;
	var timeStart = null;
	var touchPos = 0;
	var despl = 0;
	var width = window.innerWidth;
	var timeOutId = null;
	var maxStep = null;

	var element = document.getElementById("wrapper-panels");
	element.style.width = widthWrapperPanels(element)+'px';
	maxStep = element.querySelectorAll('.panel').length;
	
	element.addEventListener("touchstart", function(event){
		element.classList.remove('transition');
		timeStart = event.timeStamp;
		touchPos = event.touches[0].clientX;
	}, false);
	
	element.addEventListener("touchmove", function(event){
		var target = event.target;
		var newTouchPos = event.touches[0].clientX;
		var diffTouchPos = newTouchPos - touchPos;
		touchPos = newTouchPos;
		despl = despl + diffTouchPos;
		console.log(despl);
		element.style.transform = 'translateX('+despl+'px)';
	}, false);

	element.addEventListener("touchend", function(event){
		var timeEnd = event.timeStamp; 
		var timeDiff = timeEnd - timeStart;
		console.log(timeEnd +' - '+ timeStart+' = '+timeDiff);
		fastSwipe = false;
		if(timeDiff < 250){
			fastSwipe = true;

		} 
		var goToNextStep = nextStep(despl, step, maxStep, fastSwipe);
		console.log(goToNextStep);
		
		touchPos = goToNextStep.start;
		despl = goToNextStep.start;
		step = goToNextStep.step;
		element.classList.add('transition');
		element.style.transform = 'translateX('+despl+'px)';
	}, false);

	/*element.addEventListener("touchcancel", function(event){
		console.log('cancel');
	}, false);
	element.addEventListener("touchleave", function(event){
		console.log('leave');
	}, false);*/
	element.addEventListener('transitionend', function(){
		element.classList.remove('transition');
	}, false);
}

function widthWrapperPanels(wrapper){
	var panels = wrapper.querySelectorAll('.panel');
	var lengthPanels = panels.length;
	var widthWrapper = lengthPanels * window.innerWidth
	var widthPanels = widthWrapper/lengthPanels;
	for(var i=0; i < lengthPanels; i++){
		panels[i].style.width = widthPanels+'px';
	}
	return widthWrapper;
}

function nextStep(despl, step, maxStep, fastSwipe){
	var start = window.innerWidth * (step*-1);
	var end = start - window.innerWidth;
	var width = window.innerWidth;
	var relativeDespl = Math.abs(despl - (start*-1));
	var percentage = relativeDespl*100/width;
	console.log('Start: '+start+' - End: '+end+' - Width: '+width+' - Despl '+despl);
	var relativeDespl = Math.abs(despl - start);
	var percentage = relativeDespl*100/width;
	console.log('RelativeDespl: '+relativeDespl+' - Perc '+percentage);
	console.log('rightDesplacement');
	//the direcction is to negative values, for that is necessary to change some values to negative
	if(despl < start ){
		//right
		console.log(percentage +'> 60 && '+ maxStep +' < '+ step+1);
		if( (fastSwipe || percentage > 60) && maxStep > step+1){
			return {start: end, step: step+1};
		}
	}else{
		//left
		console.log(percentage +'> 60');
		if( (fastSwipe || percentage > 60) && step > 0){
			return {start: start+width, step: step-1};
		}
	}
	return {start: start, step: step};
}
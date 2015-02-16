window.onload = function(){
	carrousel('wrapper-panels', 'counter');
}

var carrousel = (function (idWrapperPanels, idCounter){
	var step = 0;
	var maxStep = null;
	var timeStart = null;
	var touchPos = 0;
	var despl = 0;
	var width = window.innerWidth;
	var timeOutId = null;

	var element = null;
	var counter = null;

	element = document.getElementById(idWrapperPanels);
	element.style.width = widthWrapperPanels(element)+'px';
	maxStep = element.querySelectorAll('.panel').length;
	if(idCounter){
		counter = document.getElementById(idCounter);
	}
	
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
		element.style.transform = 'translateX('+despl+'px)';
	}, false);

	element.addEventListener("touchend", function(event){
		var timeEnd = event.timeStamp; 
		var timeDiff = timeEnd - timeStart;
		fastSwipe = false;
		if(timeDiff < 250){
			fastSwipe = true;
		}

		var goToNextStep = nextStep(despl, step, maxStep, fastSwipe);
		
		touchPos = goToNextStep.start;
		despl = goToNextStep.start;
		step = goToNextStep.step;
		element.classList.add('transition');
		element.style.transform = 'translateX('+despl+'px)';
		if(counter){
			element.dataset.step = step;
			counter.textContent = step;
		}
	}, false);

	element.addEventListener('transitionend', function(){
		element.classList.remove('transition');
	}, false);


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
		var relativeDespl = Math.abs(despl - start);
		var percentage = relativeDespl*100/width;
		
		if(despl < start ){
			//right
			if( (fastSwipe || percentage > 35) && maxStep > step+1){
				return {start: end, step: step+1};
			}
		}else{
			//left
			if( (fastSwipe || percentage > 35) && step > 0){
				return {start: start+width, step: step-1};
			}
		}
		return {start: start, step: step};
	}
});
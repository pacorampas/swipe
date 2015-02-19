window.onload = function(){
	carrousel('wrapper-panels', 'counter');
}

var carrousel = (function (idWrapperPanels, idCounter){
	var step = 0;
	var maxStep = null;
	var timeStart = null;
	var touchPos = 0;
	var despl = 0;
	var timeOutId = null;

	var element = null;
	var counter = null;

	element = document.getElementById(idWrapperPanels);
	widthWrapperAndPanels(element);
	maxStep = element.querySelectorAll('.panel').length;
	if(idCounter){
		counter = document.getElementById(idCounter);
	}
	
	element.addEventListener("touchstart", function(event){
		element.classList.remove('transition');
		timeStart = event.timeStamp;
		touchPos = event.touches[0].pageX;
	}, false);
	
	element.addEventListener("touchmove", function(event){
		var target = event.target;
		var newTouchPos = event.touches[0].pageX;
		var diffTouchPos = newTouchPos - touchPos;
		touchPos = newTouchPos;
		despl = despl + diffTouchPos;
		element.style.transform = 'translate3d('+despl+'px, 0px, 0px)';
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
		element.style.transform = 'translate3d('+despl+'px, 0px, 0px)';

		if(counter){
			element.dataset.step = step;
			counter.textContent = step;
		}
	}, false);

	element.addEventListener('transitionend', function(){
		element.classList.remove('transition');
		//to force relayout else the touch events are lost
		//http://stackoverflow.com/questions/16703157/android-4-chrome-hit-testing-issue-on-touch-events-after-css-transform
		element.innerHTML = element.innerHTML;
	}, false);

	window.addEventListener("resize", function(){
		widthWrapperAndPanels(element);
		var start = window.innerWidth * (step*-1);
		touchPos = start;
		despl = start;
		element.classList.add('transition');
		element.style.transform = 'translateX('+start+'px)';
	});

	function widthWrapperAndPanels(wrapper){
		var panels = wrapper.querySelectorAll('.panel');
		var lengthPanels = panels.length;
		var widthWrapper = lengthPanels * window.innerWidth;
		var widthPanels = widthWrapper/lengthPanels;
		wrapper.style.width = widthWrapper+'px';
		for(var i=0; i < lengthPanels; i++){
			panels[i].style.width = widthPanels+'px';
		}
	}

	function nextStep(despl, step, maxStep, fastSwipe){
		var start = window.innerWidth * (step*-1);
		var end = start - window.innerWidth;
		var width = window.innerWidth;
		var relativeDespl = Math.abs(despl - start);
		var percentage = relativeDespl*100/width;
		
		if(despl < start ){
			console.log('¡yeah');
			//right
			if( (fastSwipe || percentage > 35) && maxStep > step+1){
				return {start: end, step: step+1};
			}
		}else{
			console.log('¡yeah2');
			//left
			if( (fastSwipe || percentage > 35) && step > 0){
				return {start: start+width, step: step-1};
			}
		}
		return {start: start, step: step};
	}
});
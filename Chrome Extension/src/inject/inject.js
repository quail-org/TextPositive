chrome.extension.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);

		// ----------------------------------------------------------
		// This part of the script triggers when page is done loading
		inject();
		// ----------------------------------------------------------

	}
	}, 10);
});


setInterval(function() {
	updateMask();

	let act = document.activeElement;
	console.log(typeof act);

	if(act && act.tagName.toLowerCase() == 'textarea') {
		if(act != NODES.cloning) {
			console.log('new element focus');
			getMask(act);
		}
	}
}, 100);


function inject() {
	console.log('ok');
}

var MASK_DIV;
var MASK = 'MASK';
var NODES = {};

// this is just for textareas atm

function getMask(cloning) {
	NODES.cloning = cloning;
	console.log('getting mask');
	let mask = document.createElement('div');
	NODES.mask = mask;
	mask.setAttribute('id', MASK);	
	mask.style.cssText = document.defaultView.getComputedStyle(cloning, '').cssText;
	mask.style.position = 'absolute';
	mask.style.background = 'rgba(0, 0, 255, 0.25)';
	let col = 'rgba(255, 0, 0, 0.25)';
	mask.style.setProperty('-webkit-text-fill-color', col);
	mask.style.setProperty('color', col); 
	mask.style.overflow = 'scroll';
	mask.style.setProperty('pointer-events', 'none', 'important');
	mask.style.setProperty('overflow-x', 'hidden', 'important');


	// remove
	mask.style.setProperty('text-decoration', 'underline', 'important');
	cloning.parentNode.insertBefore(mask, cloning);
	console.log('mask done');
}

function updateMask() {
	if(!NODES.mask)
		return;

/*
	NODES.mask.style.top = NODES.cloning.offsetTop;
	NODES.mask.style.bottom = NODES.cloning.offsetBottom;

	NODES.mask.innerText = NODES.cloning.value;
	*/
}


chrome.extension.sendMessage({}, function(response) {
    var readyStateCheckInterval = setInterval(function() {
        if (document.readyState === "complete") {
            clearInterval(readyStateCheckInterval);
            
            // ----------------------------------------------------------
            // This part of the script triggers when page is done loading
            console.log("INJECTED FOR HACKMIT");
            // ----------------------------------------------------------
			inject();

            var enabled = true;

            chrome.storage.sync.set({
                enabled: enabled
            }, function(){
                console.log("initally set enabled to " + enabled);
            });

            chrome.storage.onChanged.addListener(function(changes, namespace) {
                for (key in changes) {
                    let storageChange = changes[key];
                    if (key === "enable") {
                        enabled = storageChange.newValue;
                        console.log('Updated enable=' + enabled);
                    }
                }
            });
        }
    }, 10);
});


setInterval(function() {
	updateMask();
	let act = document.activeElement;
	if(act && act.tagName.toLowerCase() == 'textarea') {
		if(act != NODES.cloning) {
			console.log('new element focus');
			getMask(act);
		}
	}
}, 100);

var STATUS;

function inject() {
	console.log('ok');
	STATUS = document.createElement('div');
	STATUS.setAttribute('id', 'popup');
	document.body.appendChild(STATUS);
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

	NODES.mask.innerHTML = tokenize(NODES.cloning.value);
	scanTokens();
}

function tokenize(text) {
	// need to replace current whitespace
	let spaces = text.split(/[^\s]+/g);

	let interleave = (a, b) => {
		let ret = [];	
		for(var i = 0; i < a.length + b.length; i++) {
			let aa = a[i];
			let bb = b[i];
			ret.push(aa);
			ret.push(bb);
		}
		return ret;
	}

	let tags = 	text.split(/\s+/g).map( (x, i) => '<txtpos id="txtpos-' + i + '">' + x + '</txtpos>');

	return interleave(spaces, tags).join('');
}

function scanTokens() {
	let cs = NODES.mask.childNodes;

	cs.forEach( (x, i) => {
		if(x.innerHTML == 'sucks')
			x.className = 'active';
		else
			x.className = ''; // unnecessary?
	});
}


document.onmousemove = function(e) {
	var found = false;
	Array.from(document.getElementsByTagName('txtpos')).forEach(elem => {
		var r = elem.getBoundingClientRect();

		if(e.pageX >= r.left && e.pageX <= r.right
			&& e.pageY >= r.top && e.pageY <= r.bottom) {
			STATUS.style.visibility = "visible";
			STATUS.style.top = r.bottom + 'px';
			STATUS.style.left = r.left + 'px';
			found = true;
		}
	});

	if(!found)
		STATUS.style.visibility = 'hidden';
}



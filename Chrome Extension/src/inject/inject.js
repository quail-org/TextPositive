
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

			bind();
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

function updateStatus(thing) {
	STATUS.innerHTML = "";
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

    let height = cloning.clientHeight;
    console.log('height:' + height);
    if (height < 28){
        let bgs = "" + height + "px " + height + "px";
        mask.style.backgroundSize = bgs; 
    } else{
        mask.style.backgroundSize = "28px 28px";
    }

	mask.style.backgroundColor = 'rgba(0, 0, 0, 0)';
	mask.style.backgroundImage = "url('" + chrome.extension.getURL('/icons/textpositive_logo.png') + "')";
	mask.style.backgroundPosition = 'bottom right';
	mask.style.backgroundRepeat = 'no-repeat';

	let col = 'rgba(255, 0, 0, 0.25)';
	mask.style.setProperty('-webkit-text-fill-color', col);
	mask.style.setProperty('color', col); 
	mask.style.overflow = 'scroll';
	mask.style.setProperty('pointer-events', 'none', 'important');
	mask.style.setProperty('overflow-x', 'hidden', 'important');
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
			x.className = 'negative';
		else
			x.className = ''; // unnecessary?
	});
}


function bind() {
	document.onmousemove = function(e) {
		var found = false;
		Array.from(document.getElementsByTagName('txtpos')).forEach(elem => {
			var r = elem.getBoundingClientRect();
			var br = document.body.getBoundingClientRect();

			var ry = r.top + window.scrollY;
			var ry2 = r.bottom + window.scrollY;

			if(e.pageX >= r.left && e.pageX <= r.right
				&& e.pageY >= ry && e.pageY <= ry2) {
				console.log('what');
				STATUS.style.visibility = "visible";
				STATUS.style.top = (ry2 + 3) + 'px';
				STATUS.style.left = r.left + 'px';
				found = true;
			}
		});

		if(!found)
			STATUS.style.visibility = 'hidden';
	}
}

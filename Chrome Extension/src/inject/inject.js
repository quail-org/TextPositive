
var dict = {};

chrome.extension.sendMessage({}, function(response) {
    var readyStateCheckInterval = setInterval(function() {
        if (document.readyState === "complete") {
            clearInterval(readyStateCheckInterval);
            
            // ----------------------------------------------------------
            // This part of the script triggers when page is done loading
            console.log("INJECTED FOR HACKMIT");
            // ----------------------------------------------------------
			inject();

			read('dict.txt', a => {
				a.split('\n').forEach( (x, i) => {
					var p = x.split(',');
					dict[p[0]] = p[1];
				});
			});

	
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
	STATUS.innerHTML = TAG_HTML;
	STATUS.setAttribute('id', 'tag');
	document.body.appendChild(STATUS);
}


var TAG_HTML = '<div id="color">'+
	'</div>'+

	'<div id="head">'+
		'This phrase looks <b>negative</b>.'+
	'</div>'+

	'<div id="conf">' +
		'<div id="confword">'+
			'Confidence:'+
		'</div>'+
		'<div id="bar">'+
			'<div id="redbar">'+

			'</div>'+
		'</div>'+
	'</div>'+
	'<div id="sugg">'+
		'<div id="suggword">'+
			'Try this:'+
		'</div>'+
		'<div id="suggest">'+
			'Something &gt;&gt;'+
		'</div>'+
	'</div>';

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

	mask.style.backgroundColor = 'rgba(0, 0, 0, 0)';
	mask.style.backgroundImage = "url('" + chrome.extension.getURL('/icons/textpositive_logo.png') + "')";
    mask.style.backgroundSize = "28px 28px";
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
	/*
	let cs = NODES.mask.childNodes;

	cs.forEach( (x, i) => {
		if(x.innerHTML == 'sucks')
			x.className = 'negative';
		else
			x.className = ''; // unnecessary?
	});
	*/
}


function bind() {
	document.onmousemove = function(e) {
		var found = false;
		Array.from(document.getElementsByTagName('txtpos')).forEach(elem => {
			var r = elem.getBoundingClientRect();
			var br = document.body.getBoundingClientRect();

			var ry = r.top + window.scrollY;
			var ry2 = r.bottom + window.scrollY;

			let s;
			try {
				s = CLASS[elem.getAttribute('id')].data[0][0];
			} catch(e) {
				s = 0;
			}
			if(s > 0.3 && e.pageX >= r.left && e.pageX <= r.right
				&& e.pageY >= ry && e.pageY <= ry2) {
				console.log('what');
				STATUS.style.visibility = "visible";
				STATUS.style.top = (ry2 + 3) + 'px';
				STATUS.style.left = r.left + 'px';
				console.log(document.getElementById('redbar').style.width);
				document.getElementById('redbar').style.width = Math.round(score * 120) + 'px';
				found = true;
			}
		});

		if(!found)
			STATUS.style.visibility = 'hidden';
	}

}

var CLASS = {};

function updateClass() {
	scan();

	Object.keys(CLASS).forEach(id => {
		let res = CLASS[id];
		if(res.code < 0) {
			return;
		}
		let elem = document.getElementById(id);
		if(res.data[0][0] > 0.3 && elem.className != 'negative') {
			elem.className = 'negative';
		}
	});
}

setInterval(updateClass, 100);

function scan() {
	let arr = Array.from(document.getElementsByTagName('txtpos'));

	let stack = [];

	arr.forEach( (x, i) => {
		stack.push(x);	
		if(x.innerText.indexOf('.') >= 0 || x.innerText.indexOf(',') >= 0) {
			parse(stack.slice(0, stack.length));		
			stack = [];	
		}
	});

	if(stack.length > 0)
		parse(stack.slice(0, stack.length))

	function parse(s) {
		let words = s.map(x => x.innerText);		
		words = words.map(strip).join(' ');
					
		let tok = tokenizer(words);

		let ids = s.map(x => x.getAttribute('id'));
		
		analyze(tok, function(res) {
			ids.forEach( (x, i) => {
				CLASS[x] = JSON.parse(res);
			});
		});
	}

	function strip(str) {
		return str.replace(/[^A-Za-z0-9]+/g, '');
	}
}

function tokenizer(text) {
	let nf = 34186;
	var tok = text.toLowerCase().split(/\s+/g);

	let res = [];

	tok.forEach(x => {
		if(dict.hasOwnProperty(x))
			res.push(+dict[x])
		else
			res.push(nf);
	});

	return res;
}

function read(file, cb) {
	var xhr = new XMLHttpRequest();
	xhr.open('GET', chrome.extension.getURL(file), true);
	xhr.onreadystatechange = function()
	{
		if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200)
		{
			cb(xhr.responseText);
		}
	};
	xhr.send();
}

function analyze(tokens, cb) {
	var xhr = new XMLHttpRequest();
	xhr.open('POST', 'https://ml.textpositive.org');
	xhr.setRequestHeader('Content-type', 'application/json');
	xhr.onreadystatechange = function() {
		if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
			cb(xhr.responseText);
		}
	}

	xhr.send(JSON.stringify({word: tokens}));
}

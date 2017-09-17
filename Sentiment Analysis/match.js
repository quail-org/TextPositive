var fs = require('fs');

let A = fs.readFileSync('negative-words.txt').toString().split('\n');
A = new Set(A);
A = Array.from(A);

let B = fs.readFileSync('word_dict.txt').toString().split('\n').map(x => x.split(',')[0]);
B = new Set(B);
B = Array.from(B);


fs.writeFileSync('out.txt', A.filter(x => {
	return B.indexOf(x) >= 0	
}).join('\n'));


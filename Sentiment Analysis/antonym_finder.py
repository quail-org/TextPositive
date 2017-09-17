import sys
from PyDictionary import PyDictionary
import json

if len(sys.argv) != 3:
    raise ValueError('Call should be python antonym_finder.py $(IN_FILE) $(OUT_FILE)')

dictionary = PyDictionary()

with open(sys.argv[1]) as inf, open(sys.argv[2], "w+") as outf:
    res = {}
    for line in inf:
        line = line.lower().strip()
        ant = dictionary.antonym(line);
        try:
            if ant is not None:
		        outf.write(line + ':' + ','.join(ant) + '\n');
        except:
            print "error"
            


    


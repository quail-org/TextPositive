import csv

def load_file(filename):
	with open(filename, 'rb') as csvfile:
		reader = csv.reader(csvfile, quotechar='"', delimiter=',', quoting=csv.QUOTE_ALL,
				skipinitialspace=True)
		tweets = []
		for row in reader:
			tweets.append(row);
		return tweets[0]

print load_file('test.csv')

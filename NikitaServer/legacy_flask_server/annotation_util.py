from textblob import TextBlob
from textblob import Word
import operator
from vaderSentiment.vaderSentiment import sentiment as vaderSentiment 

# 'text': a block of text
# Returns list of lemmatized sentences in the text
def get_sentences(text):
	blob = TextBlob(text)

	sentences = []	
	for sentence in blob.sentences:
		print(sentence)
		sentences.append(" ".join(sentence.words.lemmatize()))
	
	return sentences

# read annotations file
# return a dictionary of words and emotions describing the words
def get_annotations(annotations_file):
	reader = open(annotations_file)
	annotations = {}
	for line in reader.readlines():
		data = list(filter(None, line.strip().split('\t')))
		#print data
		word, synonym = data[1].split("--")
		emotions = data[2:len(data) -1 ]
		annotations[word] = {}
		
		for e in emotions:
			emotion,score = e.split("-")
			annotations[word][emotion] = int(score)
	return annotations

# read a sentence
# return the emotion most prevalent in the words of the sentence
def annotate(sentence, annotations):
	words = sentence.split(" ")
	scores = {}
	for word in words:
		if word in annotations:
			emotions = annotations[word]
			if scores == {}:
				scores = emotions
			else:
				for e in emotions:
					scores[e] += emotions[e]
	if scores != {}:
		return max(scores.iteritems(), key=operator.itemgetter(1))[0]
	else:
		return "none"

# read a sentence
# return the emotion associated with the sentence
def get_sentiment(sentence):
	sentiments =  max(vaderSentiment(sentence) .iteritems(), key=operator.itemgetter(1))
	if sentiments[0] != "compound":
		return sentiments[0]
	else:
		return sentiments[1]

# take in a block of text
# break it up into sentences
# calculate the emotions associated with the sentence
def  get_scores(texts):
	annotations = get_annotations("emotion_annotation/NRC-Emotion-Lexicon-v0.92-Annotator-and-Sense-Level.txt")
	sentences = get_sentences(texts)
	scores = []
	for sentence in sentences:
		
		scores.append([annotate(sentence, annotations), get_sentiment(sentence)])
	return scores
			


def  main():	
	print get_scores("I feel depressed")
if __name__ == "__main__":
	main()
		
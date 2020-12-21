import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
#from sklearn.model_selection import train_test_split
#from sklearn.linear_model import LogisticRegressionCV

import nltk
from nltk.stem.porter import PorterStemmer
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords

from flask import Flask, request, jsonify

import os
import re
import pickle

#========================================================================

print("Loading..........")

stop_words = set()
#print("Loading stopwords...")
try:
   stop_words = set(stopwords.words('english'))
except:
   nltk.download('stopwords')
   nltk.download('punkt')
   stop_words = set(stopwords.words('english'))

def preprocessor(text):
   text = re.sub(r'[^\w\s]','', text)

   text = text.lower()	# Lowering letters
   text = re.sub(r'<[^>]*>', '', text)	# Removing html tags
   text = re.sub(r'@[A-Za-z0-9]+','',text)	# Removing twitter usernames
   text = re.sub('https?://[A-Za-z0-9]','',text)	# Removing urls
   text = re.sub('[^a-zA-Z]',' ',text)	# Removing numbers
   word_tokens = word_tokenize(text)
   filtered_sentence = []
   for word_token in word_tokens:
     if word_token not in stop_words:
       filtered_sentence.append(word_token)
   text = (' '.join(filtered_sentence))	# Joining words

   return text

#print("Loading dataset...")
df = pd.read_csv('corona_fake.csv')

#print("Processing dataset...")
df = df.fillna('')
df['title_text'] = df['title'] + ' ' + df['text']
df = df[df['label']!='']
df.loc[df['label'] == 'Fake', ['label']] = 'FAKE'
df.loc[df['label'] == 'fake', ['label']] = 'FAKE'
df = df.sample(frac=1).reset_index(drop=True)
df['title_text'] = df['title_text'].apply(preprocessor)

porter = PorterStemmer()
#print("PorterStemmer created.")
def tokenizer_porter(text):
   return [porter.stem(word) for word in text.split()]

#print("Vectorizer fitting & transforming...")
tfidf = TfidfVectorizer(strip_accents=None,
                       lowercase=False,
                       preprocessor=None,
                       tokenizer=tokenizer_porter,
                       use_idf=True,
                       norm='l2',
                       smooth_idf=True)
X = tfidf.fit_transform(df['title_text'].values)
y = df.label.values

#print("Loading trained model...")
filename = 'fake_news_model.sav'
detector = pickle.load(open(filename, 'rb'))

#========================================================================

def PredictText(text):
   text = preprocessor(text)
   vectorized_sentence = tfidf.transform([text]).toarray()
   return detector.predict(vectorized_sentence)[0]

#========================================================================

app = Flask(__name__)
app.config["DEBUG"] = True

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    text = data['content_']
    predictionResult = PredictText(text)
    return jsonify( result=predictionResult )

app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))
# Coronavirus fake news detection using TF-IDF & Logistic Regression

This repository contains the code we used for our fake news detector. The primary aim of this project is to develop a fake news detector for an arbitrary social network. The software will try to classify a post or status as true or fake news about the pandemic as soon as the post or status is sent to the web server and queued for being updated across the news feed of all users.

Our project consists of:
- Node.js web server: This web server will serve the news feed web page for users. It will also receive the new post data from users via HTTP POST requests, send the data to the Python REST API Server to be classified as true or fake news, and broadcast the new post data along with the classification result via socket.io connections.
- Python REST API server: This Flask REST server will receive the new post data from the Node.js, predict whether the new post is true or fake news about the pandemic, and return the prediction result to the Node.js server so that the result can be sent to users.

The future improvement for this project would focus on using this method or another method to determine if a new post is related to the pandemic and has to be checked whether it is true or fake news. There might then be up to two machine learning layers, one for classifying posts that are or are not related to the pandemic, and one for classifying the related ones as true or fake news. 

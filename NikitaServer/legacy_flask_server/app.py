#!/usr/bin/env python

from flask import Flask, jsonify
from flask import render_template
import os
from flask import request
import annotation_util
app = Flask(__name__)

@app.route('/')
def index():
    context = { 'name': 'Flask' };
    try:
        text = request.args.get('text')
        print text
        sentiments = {"sentiments":annotation_util.get_scores(text)}
    #context["scores"] = sentiment_scores
        print sentiments
        return jsonify(sentiments)
    #return render_template('index.html', **context)
    except:
        return jsonify({})
app.run(
    debug=True,
    port=int(os.getenv('PORT', 8080)),
    host=os.getenv('IP', '0.0.0.0')
)

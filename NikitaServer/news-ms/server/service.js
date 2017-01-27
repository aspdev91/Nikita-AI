'use strict';

const express = require('express');
const service = express();
const request = require('superagent');
const news_token = require('../env')

service.get('/service/:news_source', (req,res,next) => {

    let news_link = `https://newsapi.org/v1/articles?source=${req.params.news_source}&apiKey=${news_token}`
    request.get(news_link, (err,res) => {
        if(err) {
            console.log(err);
            return res.status(404);
        }
        res.json({ result: res.body })            
    })
})

module.exports = service
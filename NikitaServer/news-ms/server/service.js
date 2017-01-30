'use strict';

const express = require('express');
const service = express();
const request = require('superagent');
const news_token = require('../env').NEWS_API_TOKEN

service.get('/service/:news_source', (req,res,next) => {
    let news_source = req.params.news_source.split(" ").join("+")
    let news_link = `https://newsapi.org/v1/articles?source=${news_source}&apiKey=${news_token}`
    console.log(news_link)
    request.get(news_link, (error,response) => {
        if(error) {
            console.log(error);
            return res.status(404);
        }
        res.json({ result: response.body })            
    })
})

module.exports = service
'use strict';

const express = require('express');
const service = express();
const request = require('superagent');
const WEATHER_API_TOKEN = require('../env')

service.get('/service/:location', (req, res, next) => {
    
    request.get('http://api.openweathermap.org/data/2.5/weather?q=' + 
    req.params.location + `&APPID=${WEATHER_API_TOKEN}&units=imperial`, 
    (err, response) => {

        if (err) {
            console.log(err);
            return res.sendStatus(404);
        }
        console.log(response.body)
        res.json({result: `${response.body.weather[0].description} at ${response.body.main.temp} degrees`});

    });
});

module.exports = service;
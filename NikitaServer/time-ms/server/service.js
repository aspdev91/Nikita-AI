'use strict';

const express = require('express');
const service = express();
const request = require('superagent');
const geoencoding_token = require('../env').GEOENCODING_API_TOKEN
const timezone_token = require('../env').TIMEZONE_API_TOKEN
const moment = require('moment');

service.get('/service/:location', (req, res, next) => {
    var geoencoding_link = `https://maps.googleapis.com/maps/api/geocode/json?address=${req.params.location}&key=${geoencoding_token}`
    request.get(geoencoding_link, (err, response) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        }
        const location = response.body.results[0].geometry.location;
        const timestamp = +moment().format('X'); // shortcut for Unix timestamp
        var timezone_link = `https://maps.googleapis.com/maps/api/timezone/json?location=${location.lat},${location.lng}&timestamp=${timestamp}&key=${timezone_token}`
        console.log(timezone_link)
        request.get(timezone_link, (err, response) => {
            if (err) {
                console.log(err);
                return res.sendStatus(500);
            } 
            const result = response.body;
            const timeString = moment.unix(timestamp + result.dstOffset + result.rawOffset).utc().format('dddd, MMMM Do YYYY,h:mm:ss a');
            res.json({result: timeString});
    })
    })
});

module.exports = service;

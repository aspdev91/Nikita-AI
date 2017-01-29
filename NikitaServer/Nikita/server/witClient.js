'use strict';

const request = require('superagent')

function handleWitResponse(res){
    return res.entities;
}

module.exports = function witClient(token){
    const ask = function(message, cb) {

        request.get('https://api.wit.ai/message')
            .set('Authorization',`Bearer ${token}`)
            .query({v: "20170120&"})
            .query({q: message})
            .end((err,res) => {
                if(err) return cb(err);

                if(res.statusCode != 200) return cb(`Expected status 200, but got ${res.statusCode}`)

                const witResponse = handleWitResponse(res.body);
                return cb(null, witResponse);
            })

        console.log('ask: ' + message);
        console.log('token: ' + token);
    }
    return {
        ask: ask
    }
}
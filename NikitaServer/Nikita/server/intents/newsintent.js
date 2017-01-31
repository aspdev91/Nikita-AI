'use strict';

const request = require('superagent');

module.exports.process = function (intentData, registry, cb) {
    if (intentData.intent[0].value !== 'news') {
        return cb(new Error(`Expected news intent, got ${intentData.intent[0].value} instead`))
    }
    if (!intentData.local_search_query) {
        return cb(new Error('Missing news source in time intent'))
    }
    const news_source = intentData.local_search_query[0].value.replace(/,.?nikita/i, '');
    const service = registry.get('news');

    if (!service) return cb(false, 'No service available');
    request.get(`http://${service.ip}:${service.port}/service/${news_source}`, (err, res) => {
        if (err || res.statusCode !== 200 || !res.body.result) {
            console.log(err);
            return cb(false, `I had a problem finding out the news at ${news_source}`)
        }
        return cb(false, res.body.result)
    })

}
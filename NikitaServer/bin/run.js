'use strict';

const service = require('../server/service');
const http = require('http');
const slackClient = require('../server/slackClient');

const server = http.createServer(service);

const witToken = require('../env').WIT_API_TOKEN;
const witClient = require('../server/witClient')(witToken);

const slackToken = require('../env').SLACK_API_TOKEN;
const slackLogLevel = 'verbose';

const serviceRegistry = service.get('serviceRegistry');
const rtm = slackClient.init(slackToken, slackLogLevel, witClient, serviceRegistry);
rtm.start();

slackClient.addAuthenticatedHandler(rtm, () => server.listen(3000))


server.on('listening', function() {
    // env variable is set to development at default unless otherwise
    console.log(`IRIS is listening on ${server.address().port} in ${service.get('env')} mode.`);
});
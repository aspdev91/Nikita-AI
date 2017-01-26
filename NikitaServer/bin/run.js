'use strict';

const service = require('../server/service');
const router = require('../server/router')
const morgan = require('morgan')
// const express = require('express');
// const app = express();
const http = require('http');
const server = http.createServer(service);

const serviceRegistry = service.get('serviceRegistry');
const app = server.listen('3000',() => {
     console.log(`Nikita is listening on ${server.address().port} in ${service.get('env')} mode.`);
})

// app.use(morgan('dev'));
// app.use('/',router)

const witToken = require('../env').WIT_API_TOKEN;
const witClient = require('../server/witClient')(witToken);




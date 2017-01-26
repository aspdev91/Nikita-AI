'use strict';

const express = require('express');
const service = express();
const ServiceRegistry = require('./serviceRegistry');
const serviceRegistry = new ServiceRegistry()
const nikitaClient = require('./nikitaClient')

service.set('serviceRegistry', serviceRegistry);

service.put('/service/:intent/:port', (req, res, next) => {
    const serviceIntent = req.params.intent;
    const servicePort = req.params.port;
    console.log('this is the remote address:', req.connection.remoteAddress)
    const serviceIp = req.connection.remoteAddress.includes('::') // means that it's an IPV6 address
        ? `[${req.connection.remoteAddress}]` : req.connection.remoteAddress;

    serviceRegistry.add(serviceIntent, serviceIp, servicePort);
    res.json({ result: `${serviceIntent} at ${serviceIp}:${servicePort}` });
})

service.get('/nikita', (req, res, next) => {
    let result = nikitaClient.handleOnMessage('What time is it in New York?', serviceRegistry, (error, response) => {
        if (error) {
            console.log(error)
        }
        res.json({ 'result': response })
    })
})

module.exports = service;
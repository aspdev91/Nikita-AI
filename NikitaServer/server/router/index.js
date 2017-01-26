const express = require('express');
const router = express.Router();
const nikitaClient = require('../nikitaClient')

// const ServiceRegistry = require('../serviceRegistry');
// const serviceRegistry = new ServiceRegistry()

// router.set('serviceRegistry', serviceRegistry);

router.get('/nikita', (req, res, next) => {
    let result = nikitaClient.handleOnMessage('What time is it in New York?')
    res.send(result)
})

// router.put('/service/:intent/:port',(req, res, next) => {
//     console.log(req)
//     const serviceIntent = req.params.intent;
//     const servicePort = req.params.port;
//     console.log('this is the remote address:',req.connection.remoteAddress)
//     const serviceIp = req.connection.remoteAddress.includes('::') // means that it's an IPV6 address
//     ? `[${req.connection.remoteAddress}]` : req.connection.remoteAddress;

//     serviceRegistry.add(serviceIntent, serviceIp, servicePort);
//     res.json({result: `${serviceIntent} at ${serviceIp}:${servicePort}`});
// })



module.exports = router
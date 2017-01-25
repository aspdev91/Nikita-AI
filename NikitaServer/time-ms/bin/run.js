'use strict';
const request = require('superagent');
const service = require('../server/service');
const http = require('http');

const server = http.createServer(service);
server.listen();

server.on('listening', function() {
    console.log(`Awesomo-Time is listening on ${server.address().port} in ${service.get('env')} mode.`);

    const announce = () => {
        request.put(`http://127.0.0.1:3000/service/time/${server.address().port}`, (err,res) => {
            if(err){
                console.log(err);
                console.log("Error connecting to Awesom-o");
                return;
            }
            console.log(res.body);
        })
    }
    announce();
    setInterval(announce,15*1000); // Announce server uptime every 15 seconds
});
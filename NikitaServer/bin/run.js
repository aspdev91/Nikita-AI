'use strict';

const service = require('../server/service');
const logger = require('../logger')

const http = require('http');
const server = http.createServer(service);

const serviceRegistry = service.get('serviceRegistry');
service.use(require('morgan')('combined', {
	// Stream the files to Winston
	stream: {
		write: message => {
			//Write to logs
			logger.log('info',message)
		}
	}
}));
const app = server.listen('3000', () => {
    console.log(`Nikita is listening on ${server.address().port} in ${service.get('env')} mode.`);
})

const witToken = require('../env').WIT_API_TOKEN;
const witClient = require('../server/witClient')(witToken);




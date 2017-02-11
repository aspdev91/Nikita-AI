'use strict';

const witToken = require('../env').WIT_API_TOKEN;
const nlp = require('./witClient')(witToken);

function handleOnMessage(message, registry, cb) {
    console.log(message.text)
    if (message.toLowerCase().includes(' ')) {
        nlp.ask(message, (err, res) => {
            if (err) {
                // console.log(err);
                return cb(false, "I encountered an error while processing your request");
            }
            try {
                if (!res.intent || !res.intent[0] || !res.intent[0].value) {
                    throw new Error("Could not extract intent");
                }
                console.log('the intent is ', res.intent);
                const intent = require('./intents/' + res.intent[0].value.trim() + 'intent');
                
                intent.process(res, registry, function (error, response) {
                    if (error) {
                        console.log(error.message);
                        return cb(false, "I encountered an error while processing your request");
                    }
                    return cb(false, response);
                })
            } catch (err) {
                console.log(err);
                console.log(res);
                return cb(false, "Sorry, I don't know what you're referring to");
            }
        });
    }
}

module.exports = {
    handleOnMessage
}
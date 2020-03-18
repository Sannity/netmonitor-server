const WebSocket = require('ws');
const wsS = new WebSocket.Server({ port:8000, });
const ClientDictionary = require('./classes/clientDictionary.class');

var Clients = new ClientDictionary(keepAliveInterval = 1000);

wsS.on('connection', (ws, req) => {
    Clients.registerClient(ws);
});


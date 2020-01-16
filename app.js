const Client = require('./classes/client.class');
const WebSocket = require('ws');
const ws = new WebSocket.Server({ port:8000, });
const ClientDictionary = require('./classes/clientDictionary.class');

var Clients = new ClientDictionary(keepAliveInterval = 1000);

ws.on('connection', (ws, req) => {
    Clients.registerClient(ws);
});

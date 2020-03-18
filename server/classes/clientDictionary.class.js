/**
 * Author: Austin Monson @ 2020
 * Description: Class to hold and act up on collection of clients
 */
const Client = require('./client.class');
const MesssageHandler = require('./messageHandler.class')

class ClientDictionary{
    /** 
     * Constructor
     */
    constructor(keepAliveInterval) {
        this.clients = [];
        setInterval(this.keepAlive.bind(this), keepAliveInterval);
    }

    /**
     * Creates and adds a client to the client list
     */
    registerClient(ws){
        var incoming = new Client(ws);
        incoming.ws.on('pong', () => {
            console.log("[SERVER] KeepAlive Recieved");
        })
        incoming.ws.on('message', (data) => {
            console.log(data);
            var messageHandler = new MesssageHandler();
            MesssageHandler.Handle(incoming.ws, data);
        })
        this.clients.push(incoming);
    }

    /**
     * Removes a client from the clients list by index
     */
    deregisterClient(index){
        this.clients.splice(index, 1);
    }

    /**
     * Ping each client, if the ping returns null then the client no longer exists, remove it
     */
    keepAlive(){
        this.clients.forEach((client, i) => {
            if(client.ping() === null){
                this.deregisterClient(i);
            }
        });
    }
}

module.exports = ClientDictionary;
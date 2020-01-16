/**
 * Author: Austin Monson @ 2020
 * Description: Class to hold and act up on collection of clients
 */
const Client = require('./client.class');

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
        this.clients.push(new Client(ws));
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
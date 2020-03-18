/**
 * Author: Austin Monson @ 2020
 * Description: This class defines a single client network monitor to the server
 */
const uuidv4 = require('uuid/v4');

const WS_CONNECTING = 0;
const WS_OPEN = 1;
const WS_CLOSING = 2;
const WS_CLOSED = 3;

class Client {
     /**
      * Client Consists of the following
      *     - it's Websocket
      *     - a Unique Identifier (Default UUID random)
      */
    constructor(client_ws, identifier = uuidv4()){
        this.ws = client_ws;
        this.id = identifier;
    }

    /**
     * Send a keepalive to the client, see if it responds
     */
    ping(){
        //If its closed then the caller needs to get rid of them
        if(this.ws.readyState == WS_CLOSED){
            return null;
        }
        else{
            this.ws.ping();
            return true;
        }
    }

    /**
     * Send a message to the client's websocket
     */
    send(message){
        this.ws.send(message);
    }
}

module.exports = Client;
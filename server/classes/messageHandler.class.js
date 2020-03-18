/**
 * Author: Austin Monson @ 2020
 * Description: Handles Any Messages that the client sends to the server
 */
const uuidv4 = require('uuid/v4');
const mysql = require('mysql');
const MessageBuilder = require('./messageBuilder.class');

class MessageHandler{
    static Handle(ws, data){
        var con = mysql.createConnection({
            host: "localhost",
            user: "modserver",
            password: "modserver",
            database: "modserver"
        });
        con.connect(function(err) {
            if (err) throw err;
        });

        var decodedData = undefined;
        try{
            decodedData = JSON.parse(data);
        }
        catch(error){
            //Just drop it, close the socket.
            ws.close();
        }

        var sessionID = decodedData["meta"]["sessionID"];

        switch (decodedData["meta"]["type"]) {
            case "handshake":
                if(typeof sessionID === 'undefined'){
                    //CREATE A NEW SESSION, PUT IT IN THE DATABASE
                    sessionID = uuidv4();
                    con.query("INSERT INTO sessions (sessionID) VALUES ('"+sessionID+"')", (error, result) => {
                        if(error){
                            console.error("[SERVER] SESSION NOT SAVED");
                            ws.close();
                            return;
                        }
                    })
                    var connectMessageBuilder = new MessageBuilder(sessionID === undefined ? undefined : sessionID);
                    connectMessageBuilder.setType("handshake");
                    connectMessageBuilder.setData([{'success': true}]);
                    ws.send(connectMessageBuilder.build());
                    console.log("[SERVER] NEW SESSION CREATED");
                    return
                }
                else{
                    //FIND THE SESSION IN THE DATABASE, IF IT DOESN'T EXIST, DROP THE CONNECTION..
                    con.query("SELECT * FROM sessions WHERE sessionID = '"+sessionID+"'", (error, result) => {
                        if(error){
                            console.error("[SERVER] UNABLE TO FIND SESSION");
                            ws.close();
                            return;
                        }
                    })

                    console.log("[SERVER] SESSION RESTORED");
                }
                break;
        
            default:
                console.log("RECIEVED UNRECOGNIZED MESSAGE TYPE");
                break;
        }
        
    }
}

module.exports = MessageHandler;
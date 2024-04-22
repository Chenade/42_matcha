package handlers

import (
    "log"
    "net/http"

    "github.com/gorilla/websocket"
)

// Define a WebSocket upgrader
var upgrader = websocket.Upgrader{
    ReadBufferSize:  1024,
    WriteBufferSize: 1024,
    CheckOrigin: func(r *http.Request) bool {
        return true
    },
}


// WebSocket handler function
func WsHandler(w http.ResponseWriter, r *http.Request) {
    // Upgrade HTTP connection to WebSocket
    conn, err := upgrader.Upgrade(w, r, nil)
    if err != nil {
        log.Println(err)
        return
    }
    defer conn.Close()

    for {
        // Read message from the WebSocket connection
        messageType, p, err := conn.ReadMessage()
        if err != nil {
            log.Println(err)
            return
        }
        // Print the received message
        log.Printf("Received message: %s\n", p)

        // Echo the message back to the client
        if err := conn.WriteMessage(messageType, p); err != nil {
            log.Println(err)
            return
        }
    }
}

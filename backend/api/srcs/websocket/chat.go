package websocket

import (
	"log"
	"net/http"
	"strings"

	// "github.com/gorilla/websocket"
)


// WebSocket handler function
func WsChatHandler(w http.ResponseWriter, r *http.Request) {

    pathParts := strings.Split(r.URL.Path, "/")
    if len(pathParts) < 4 {
        http.Error(w, "Invalid URL", http.StatusBadRequest)
        return
    }
    usrId := pathParts[3]
    if usrId == "" {
        http.Error(w, "User ID is required", http.StatusBadRequest)
        return
    }
    log.Println("WebSocket Endpoint Hit", usrId)
    
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
        if err := conn.WriteMessage(messageType, []byte("I got your message: "+string(p))); err != nil {
            log.Println(err)
            return
        }
    }
}

package websocket

import (
	"net/http"

	"github.com/gorilla/websocket"
)

var Notification_clients = make(map[string]*Client)
var Chat_clients = make(map[string]*Client)

// Define a WebSocket upgrader
var upgrader = websocket.Upgrader{
    ReadBufferSize:  1024,
    WriteBufferSize: 1024,
    CheckOrigin: func(r *http.Request) bool {
        return true
    },
}



package websocket

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/gorilla/websocket"
)

// WebSocket handler function
func WsNotificationHandler(w http.ResponseWriter, r *http.Request) {
    conn, err := upgrader.Upgrade(w, r, nil)
    if err != nil {
        log.Println("WebSocket upgrade error:", err)
        return
    }

    usrId := r.URL.Query().Get("token")
    if usrId == "" {
        log.Println("User ID is required")
        conn.Close()
        return
    }

    Notification_clients[usrId] = &Client{Socket: conn}
    log.Println("Client connected:", usrId)

     defer func() {
        delete(Notification_clients, usrId)
        conn.Close()
        log.Printf("Client disconnected: %s", usrId)
    }()

    // Block the handler to keep the connection open
    select {}

}

// Send a notification to a user
func WsNotificationSend(usrId string, messagetype string, message string) bool {

    WSmessage, err := json.Marshal(map[string]string{
        "type":    func() string {
            if messagetype == "" {
                return "info"
            }
            return messagetype
        }(),
        "message": message,
    })
    if err != nil {
        log.Println("Error marshaling JSON:", err)
        return false
    }

    client, ok := Notification_clients[usrId]
    if !ok {
        log.Printf("Client %s not found", usrId)
        return false
    }

    if err := client.Socket.WriteMessage(websocket.TextMessage, []byte(WSmessage)); err != nil {
        log.Println(err)
        return false
    }
    return true
}

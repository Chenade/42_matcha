package websocket

import (
	"github.com/gorilla/websocket"
)

type Client struct {
	// ID     string
	Socket *websocket.Conn
}

type Message struct {
	Sender    string `json:"sender,omitempty"`
	Recipient string `json:"recipient,omitempty"`
	Content   string `json:"content,omitempty"`
}


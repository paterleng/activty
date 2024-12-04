package model

import "github.com/gorilla/websocket"

type Client struct {
	UserId string `json:"userId"`
	Conn   *websocket.Conn
}

type Message struct {
	BlockId int `json:"block_id"`
	Type    int `json:"type"`
}

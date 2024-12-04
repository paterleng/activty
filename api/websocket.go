package api

import "github.com/gin-gonic/gin"

type WebSocketInterface interface {
	Connect(c *gin.Context)
}

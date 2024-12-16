package api

import "github.com/gin-gonic/gin"

type UserInterface interface {
	Login(c *gin.Context)
	Register(c *gin.Context)
	PutUserInfo(c *gin.Context)
	GetUserInfo(c *gin.Context)
	Recharge(c *gin.Context)
	GetReChangeRecord(c *gin.Context)
	Claim(c *gin.Context)
	Reimburse(c *gin.Context)
}

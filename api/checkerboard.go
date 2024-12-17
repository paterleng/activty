package api

import "github.com/gin-gonic/gin"

type CheckerboardInterface interface {
	UserBetting(c *gin.Context)
	GetUserOperateRecords(c *gin.Context)
	GetBoardInfoNoLogin(c *gin.Context)
	GetCheckBoardInfo(c *gin.Context)
	GetRecords(c *gin.Context)
	AddShield(c *gin.Context)
}

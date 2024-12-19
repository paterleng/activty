package api

import (
	"activity/middleware"
	"github.com/gin-gonic/gin"
)

func ApiRoute(r *gin.Engine) {
	r.Use(middleware.Cors())
	api := r.Group("/api")
	api.POST("/login", GetApiManager().Login)
	api.POST("/register", GetApiManager().Register)
	//  获取交易记录的前50条
	api.GET("/records", GetApiManager().GetRecords)
	//用户未登录时获取棋盘信息
	api.GET("/boardInfo/:block_id", GetApiManager().GetBoardInfoNoLogin)
	user := api.Group("/user")
	user.Use(middleware.JWTAuthMiddleware())
	{
		//   用户信息
		user.GET("/userinfo", GetApiManager().GetUserInfo)
		//  修改用户信息
		user.PUT("/put/userinfo", GetApiManager().PutUserInfo)
		//	充值信息
		user.POST("/recharge", GetApiManager().Recharge)
		//  获取用户充值记录
		user.GET("/recharge/record", GetApiManager().GetReChangeRecord)
		//	claim操作
		user.POST("/claim", GetApiManager().Claim)
		//	退款
		user.POST("/reimburse", GetApiManager().Reimburse)
	}
	board := api.Group("/checkboard")
	board.Use(middleware.JWTAuthMiddleware())
	{
		//  押注
		board.POST("/betting", GetApiManager().UserBetting, middleware.ActivityEnd())
		//  获取用户的押注记录
		board.GET("/record", GetApiManager().GetUserOperateRecords)
		//	获取棋盘信息
		board.GET("/boardInfo/:block_id", GetApiManager().GetCheckBoardInfo)
		//	加盾
		board.POST("/add_shield", GetApiManager().AddShield, middleware.ActivityEnd())
	}
	ws := api.Group("/ws")
	{
		ws.GET("/handle", GetApiManager().Connect)
	}
}

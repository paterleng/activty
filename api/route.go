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
	api.Use(middleware.JWTAuthMiddleware())
	user := api.Group("/user")
	{
		//   用户信息
		user.GET("/userinfo", GetApiManager().GetUserInfo)
		//  修改用户信息
		user.PUT("/put/userinfo", GetApiManager().PutUserInfo)
		//	充值信息
		user.POST("/recharge", GetApiManager().Recharge)
		//	claim操作
		//user.POST()
	}
	board := api.Group("/checkboard")
	{
		//  押注
		board.POST("/betting", GetApiManager().UserBetting)
		//  获取用户的押注记录
		board.GET("/record", GetApiManager().GetUserOperateRecords)
		//  获取交易记录的前50条
		board.GET("/records", GetApiManager().GetRecords)
		//	获取棋盘信息
		board.GET("/boardInfo/:block_id", GetApiManager().GetCheckBoardInfo)
		//	加盾
		board.POST("/add_shield", GetApiManager().AddShield)
	}
	//shield := api.Group("/shield")
	//{
	//	shield.POST()
	//}
	ws := api.Group("/ws")
	{
		ws.GET("/handle", GetApiManager().Connect)
	}
}

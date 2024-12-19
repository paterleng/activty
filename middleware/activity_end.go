package middleware

import (
	"activity/utils"
	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
)

// 活动结束中间件
func ActivityEnd() func(c *gin.Context) {
	return func(c *gin.Context) {
		//计算总金额，如果大于100万，就结束，阻止请求
		total, err := utils.Amonent()
		if err != nil {
			utils.Tools.LG.Error("计算总金额失败", zap.Error(err))
			c.Abort()
			return
		}
		if total >= 1000000 {
			utils.Tools.LG.Error("活动结束", zap.Error(err))
			c.Abort()
			return
		}
		c.Next()
	}
}

package middleware

import (
	"github.com/gin-gonic/gin"
)

func JWTAuthMiddleware() func(c *gin.Context) {
	return func(c *gin.Context) {
		//authHeader := c.Request.Header.Get("Authorization")
		//if authHeader == "" {
		//	utils.Tools.LG.Error("请求中auth为空", zap.Error(errors.New("token不存在")))
		//	c.Abort()
		//	return
		//}
		//parts := strings.SplitN(authHeader, " ", 2)
		//if !(len(parts) == 2 && parts[0] == "Bearer") {
		//	utils.Tools.LG.Error("请求中auth格式有误", zap.Error(errors.New("token不正确")))
		//	c.Abort()
		//	return
		//}
		//mc, err := pkg.ParseToken(parts[1])
		//if err != nil {
		//	utils.Tools.LG.Error("token 无效", zap.Error(errors.New("token不正确")))
		//	c.Abort()
		//	return
		//}
		//c.Set("userid", mc.UserID)
		c.Set("user_id", "1231545")
		c.Next()
	}
}

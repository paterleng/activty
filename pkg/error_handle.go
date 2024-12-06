package pkg

import (
	"fmt"
	"go.uber.org/zap"
)

func PanicHandle(f func()) {
	defer func() {
		if r := recover(); r != nil {
			fmt.Println(r)
			zap.L().Error("数据中心异常，请联系管理员处理")
		}
	}()
	f()
}

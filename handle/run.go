package handle

import "activity/pkg"

func Run() {
	//在项目重启的时候创建盾
	CreateShiled()
	//启动websocket消息监听
	go pkg.PanicHandle(RunWs)
	//启动定时上涨任务
	go pkg.PanicHandle(RunTask)

}

package handle

func Run() {
	//启动websocket消息监听
	go RunWs()
	//启动定时上涨任务
	go RunTask()
}

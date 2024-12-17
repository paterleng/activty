package controller

import (
	"activity/handle"
	"activity/model"
	"activity/pkg"
	"activity/utils"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"go.uber.org/zap"
	"net/http"
	"strconv"
	"sync"
)

type WebSocketController struct {
	LG          *zap.Logger
	ConnManager map[string]map[int]model.Client
}

func (p *WebSocketController) Connect(c *gin.Context) {
	upgrader := websocket.Upgrader{
		CheckOrigin: func(r *http.Request) bool { return true },
	}
	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		p.LG.Error("websocket连接失败", zap.Error(err))
		pkg.ResponseError(c, pkg.CodeServerBusy)
		return
	}
	//获取token
	token := c.Query("token")
	mc, err := pkg.ParseToken(token)
	if err != nil {
		utils.Tools.LG.Error("token 无效", zap.Error(err))
		//不建立连接
		return
	}
	blockId := c.Query("blockId")
	fmt.Println("块id", blockId)
	//  创建连接对象客户端
	var client model.Client
	client.Conn = conn
	userId := mc.UserID
	if userId == "" {
		p.LG.Error("用户id在上下文中未找到")
		pkg.ResponseError(c, pkg.CodeNeedLogin)
		return
	}
	client.Conn = conn
	client.UserId = userId
	atoi, err := strconv.Atoi(blockId)
	if err != nil {
		p.LG.Error("转换失败，参数错误")
		pkg.ResponseError(c, pkg.CodeParamError)
		return
	}
	var mu sync.Mutex
	mu.Lock()
	m := make(map[int]model.Client)
	m[atoi] = client
	p.ConnManager[userId] = m
	mu.Unlock()
	fmt.Println("连接管理的长度：", len(utils.ConnManager))
	fmt.Println("数据", utils.ConnManager)
	//	开启协程监听消息，用于关闭websocket连接及清理连接管理里面的资源
	go handle.ReceiveWsMessage(client, atoi)
}

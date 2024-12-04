package controller

import (
	"activity/model"
	"activity/pkg"
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
	fmt.Println("WebSocketController Connect")
	upgrader := websocket.Upgrader{
		CheckOrigin: func(r *http.Request) bool { return true },
	}
	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		p.LG.Error("websocket连接失败", zap.Error(err))
		pkg.ResponseError(c, pkg.CodeServerBusy)
		return
	}
	blockId := c.Query("blockId")
	fmt.Println("块id", blockId)
	//  创建连接对象客户端
	var client model.Client
	client.Conn = conn
	userId := c.GetString(pkg.USERID)
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
}

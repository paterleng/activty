package handle

import (
	"activity/model"
	"activity/utils"
	"encoding/json"
	"fmt"
	"github.com/gorilla/websocket"
	"go.uber.org/zap"
	"sync"
	"time"
)

func RunWs() {
	for {
		select {
		case message := <-utils.ChMessage:
			switch message.Type {
			case 1:
				SendMessage(message)
			}
		}
	}
}

// ws消息广播
func SendMessage(message model.Message) {
	fmt.Println("收到消息：", message)
	//先测试连接
	var wg sync.WaitGroup
	wg.Add(len(utils.ConnManager))
	for _, client := range utils.ConnManager {
		go func(client map[int]model.Client) {
			defer wg.Done()
			//先转成json字符串
			msg, err := json.Marshal(message)
			if err != nil {
				utils.Tools.LG.Error("websocket消息转json失败", zap.Error(err))
				return
			}
			//如果没有这个块id就不发
			if _, ok := client[message.BlockId]; !ok {
				return
			}
			//把信号传到前端，前端接收到之后就调用接口更新数据
			err = client[message.BlockId].Conn.WriteMessage(websocket.TextMessage, msg)
			if err != nil {
				//如果出错，就进行心跳检测，然后去判断是否断开连接
				if !checkHeartbeat(client[message.BlockId]) {
					//如果不通就移除这个连接
					utils.Tools.LG.Warn("心跳检测失败，关闭连接")
					client[message.BlockId].Conn.Close()
					delete(utils.ConnManager, client[message.BlockId].UserId)
				}
				client[message.BlockId].Conn.Close()
			}
		}(client)
	}
	wg.Wait()
}

// 心跳检测逻辑
func checkHeartbeat(client model.Client) bool {
	// 发送一个心跳 Ping 消息
	err := client.Conn.WriteMessage(websocket.PingMessage, nil)
	if err != nil {
		utils.Tools.LG.Warn("发送Ping消息失败", zap.Error(err))
		return false
	}

	// 设置一个超时机制来等待 Pong 消息
	client.Conn.SetReadDeadline(time.Now().Add(5 * time.Second))
	client.Conn.SetPongHandler(func(appData string) error {
		// 接收到 Pong 消息时，清除 ReadDeadline
		client.Conn.SetReadDeadline(time.Time{})
		return nil
	})
	return true
}

// ReceiveWsMessage 接收websocket消息
func ReceiveWsMessage(client model.Client, blockId int) {
	for {
		_, message, err := client.Conn.ReadMessage()
		if err != nil {
			if websocket.IsCloseError(err, websocket.CloseNormalClosure, websocket.CloseGoingAway, websocket.CloseNoStatusReceived) {
				if c, exist := utils.ConnManager[client.UserId]; exist {
					if _, exist := c[blockId]; exist {
						delete(c, blockId)
						if len(c) == 0 {
							delete(utils.ConnManager, client.UserId)
						}
					}
				}
				utils.Tools.LG.Info(fmt.Sprintf("用户%s通过客户端主动关闭模块%t连接", client.UserId, blockId))
				break
			}
			utils.Tools.LG.Error("websocket接收到错误消息", zap.Error(err))
			break
		}
		fmt.Printf("Received message: %s\n", message)
	}
}

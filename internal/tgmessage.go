package internal

import (
	"bytes"
	"fmt"
	"golang.org/x/net/proxy"
	"log"
	"net/http"
)

const (
	telegramBotToken = "7559410093:AAENqFuXpFVGecRqMMoutiy99pNLcZEQObY" // 你的 Bot API Token
	telegramChatID   = "-4620695304"                                    // 你的群组 Chat ID
	proxyURL         = "18.162.194.146:51206"                           // 你的代理地址和端口
)

func SendErrorToTelegram(message string) {
	// 设置 SOCKS5 代理
	dialer, err := proxy.SOCKS5("tcp", proxyURL, nil, proxy.Direct)
	if err != nil {
		log.Printf("创建代理失败: %v", err)
		return
	}

	// 创建 HTTP 请求
	client := &http.Client{
		Transport: &http.Transport{
			Dial: dialer.Dial,
		},
	}

	url := fmt.Sprintf("https://api.telegram.org/bot%s/sendMessage", telegramBotToken)
	data := fmt.Sprintf("chat_id=%s&text=%s", telegramChatID, message)

	req, err := http.NewRequest("POST", url, bytes.NewBufferString(data))
	if err != nil {
		log.Printf("创建请求失败: %v", err)
		return
	}
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	resp, err := client.Do(req)
	if err != nil {
		log.Printf("发送请求失败: %v", err)
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		log.Printf("Telegram API 请求失败，状态码: %d", resp.StatusCode)
	} else {
		log.Println("错误信息已成功发送到 Telegram 群组")
	}
}

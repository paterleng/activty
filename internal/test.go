package internal

import (
	"fmt"
	tgbotapi "github.com/go-telegram-bot-api/telegram-bot-api/v5"
)

type Client struct {
	client *tgbotapi.BotAPI
	chatID int64
}

func (c *Client) NewBot(token string, chatID int64) error {
	var err error
	c.client, err = tgbotapi.NewBotAPI(token)
	if err != nil {
		return err
	}
	fmt.Println("It is BOT:", c.client.Self.UserName)
	c.client.Debug = true
	c.chatID = chatID
	return nil
}

func (c *Client) SendMsg(text string) error {
	msg := tgbotapi.NewMessage(c.chatID, text)
	msg.ParseMode = tgbotapi.ModeHTML
	_, err := c.client.Send(msg)
	return err
}

func (c *Client) SendImg(path string) error {
	msg := tgbotapi.NewPhoto(c.chatID, tgbotapi.FilePath(path))
	_, err := c.client.Send(msg)
	return err
}

func (c *Client) SendDoc(path string) error {
	msg := tgbotapi.NewDocument(c.chatID, tgbotapi.FilePath(path))
	var err error
	_, err = c.client.Send(msg)
	return err
}

func (c *Client) SendSticker(path string) error {
	msg := tgbotapi.NewSticker(c.chatID, tgbotapi.FilePath(path))
	var err error
	_, err = c.client.Send(msg)
	return err
}

func (c *Client) GetUpdateCommand(cmd chan string) {
	u := tgbotapi.NewUpdate(0)
	updates := c.client.GetUpdatesChan(u)
	for update := range updates {
		cmd <- update.Message.Text
	}
}
func InArray(s string, array []string) bool {
	for _, i := range array {
		if i == s {
			return true
		}
	}
	return false
}

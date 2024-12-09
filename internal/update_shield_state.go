package internal

import (
	"activity/model"
	"time"
)

type TimerManager struct {
	manager model.TimerManager
}

// 这里面时用于创建定时器，然后更新格子的加盾状态
func (tm *TimerManager) CreateTimer(userId string, duration time.Duration) (err error) {

	return err
}

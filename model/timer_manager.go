package model

import (
	"sync"
	"time"
)

type TimerManager struct {
	Mu        sync.Mutex
	Timers    map[string]*time.Timer    // 用用户 ID 映射定时器
	Durations map[string]*time.Duration // 记录每个用户的保护时间
}

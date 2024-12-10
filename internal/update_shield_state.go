package internal

import (
	"activity/dao"
	"activity/model"
	"activity/pkg"
	"activity/utils"
	"go.uber.org/zap"
	"time"
)

type TimerManager struct {
	manager model.TimerManager
}

// 这里面时用于创建定时器，然后更新格子的加盾状态
func (tm *TimerManager) CreateTimer(gridId uint, duration time.Duration) {
	tm.manager.Mu.Lock()
	defer tm.manager.Mu.Unlock()
	//先看是否有定时任务,有就先停止原来的定时器
	if timer, exists := tm.manager.Timers[gridId]; exists {
		timer.Stop()
	}
	//创建定时任务
	tm.manager.Timers[gridId] = time.AfterFunc(duration, func() {
		//到时间更新数据
		err := dao.GetDaoManager().UpdateGridState(gridId, pkg.NOEXIST)
		if err != nil {
			utils.Tools.LG.Error("结束护盾状态更新失败", zap.Error(err))
			return
		}
	})
	return
}

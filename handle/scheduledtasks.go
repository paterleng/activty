package handle

import (
	"activity/model"
	"activity/utils"
	"go.uber.org/zap"
	"sync"
	"time"
)

func RunTask() {
	ticker := time.NewTicker(1 * time.Hour)
	for {
		<-ticker.C
		riseHandle()
	}
}

// riseHandle 处理上涨函数
func riseHandle() {
	/**
	按照当前格子的价值*1.05
	*/
	var boards []model.CheckerBoard
	err := utils.Tools.DB.Find(&boards).Error
	if err != nil {
		//	报错并结束程序运行
	}
	/**
	截取切片,然后开携程优化处理速度
	*/
	//m := make(map[int]model.CheckerBoard, 10)
	var wg sync.WaitGroup
	wg.Add(10)
	start := 0
	for i := 1000; i < 10000; i = i + 1000 {
		//切片传入携程
		start = i
		boardSlice := boards[start:i]
		go func(board []model.CheckerBoard) {
			defer wg.Done()
			for _, b := range board {
				b.PriceIncrease = b.Price * 1.05
			}
			//	入库
			err = utils.Tools.DB.Updates(&board).Error
			if err != nil {
				utils.Tools.LG.Error("价格上涨时入库失败", zap.Error(err))
				return
			}
		}(boardSlice)
	}
}

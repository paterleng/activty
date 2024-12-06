package handle

import (
	"activity/model"
	"activity/utils"
	"fmt"
	"go.uber.org/zap"
	"strconv"
	"time"
)

func RunTask() {
	i := 0
	ticker := time.NewTicker(1 * time.Hour)
	for {
		<-ticker.C
		i++
		riseHandle(i)
	}
}

// RiseHandle 处理上涨函数
func riseHandle(i int) {
	/**
	按照当前格子的价值*1.05
	*/
	var boards []model.CheckerBoard
	err := utils.Tools.DB.Find(&boards).Error
	if err != nil {
		//	报错并结束程序运行
	}
	for i := 0; i < len(boards); i++ {
		//如果在一个小时内没有被抢占，就基于PriceIncrease价格上涨，被抢占了就基于当前格子价值上涨
		if boards[i].Price < boards[i].PriceIncrease {
			boards[i].PriceIncrease, err = strconv.ParseFloat(strconv.FormatFloat(boards[i].PriceIncrease*1.05, 'f', 6, 64), 64)
			if err != nil {

			}
			continue
		}
		boards[i].PriceIncrease, err = strconv.ParseFloat(strconv.FormatFloat(boards[i].Price*1.05, 'f', 6, 64), 64)
	}
	//入库
	err = utils.Tools.DB.Save(&boards).Error
	if err != nil {
		utils.Tools.LG.Error("价格上涨时入库失败", zap.Error(err))
		return
	}
	utils.Tools.LG.Info(fmt.Sprintf("定时入库成功第%t次上涨", i))
}

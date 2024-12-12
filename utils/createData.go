package utils

import (
	"activity/model"
	"fmt"
	"time"
)

// CreateBoardData 创建棋盘数据
func CreateBoardData() {
	//查看是否需要创建数据
	var total int64
	err := Tools.DB.Find(&model.CheckerBoard{}).Count(&total).Error
	if err != nil {
		fmt.Println(err)
		return
	}
	if total >= 800 {
		fmt.Println("表中已有数据")
		return
	}
	fmt.Println("表中无数据，开始初始化...")
	/**
	先创建第一块然后一块插入进去
	*/
	//外层盒子
	nowTime := time.Now()
	for i := 1; i <= 9; i++ {
		if i == 5 {
			continue
		}
		//内层盒子
		boards := make([]model.CheckerBoard, 0)
		//行
		for j := 1; j <= 10; j++ {
			//列
			for k := 1; k <= 10; k++ {
				var board model.CheckerBoard
				board.BlockId = i
				board.RowId = j
				board.LineId = k
				board.Price = 500
				board.EndShieldTime = nowTime
				board.StartShieldTime = nowTime
				board.IsShield = 2
				boards = append(boards, board)

			}
		}
		//	入库
		err := Tools.DB.Create(&boards).Error
		if err != nil {
			fmt.Println(err)
			return
		}

	}
	fmt.Println("数据初始化完成")
}

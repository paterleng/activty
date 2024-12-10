package handle

import (
	"activity/dao"
	"activity/internal"
	"activity/pkg"
	"activity/utils"
	"fmt"
	"time"
)

func CreateShiled() {
	//先查出来所有的格子
	grids, err := dao.GetDaoManager().GetAllGrid()
	if err != nil {
		utils.Tools.LG.Panic("在初始化盾时获取格子信息失败")
		panic(err)
	}
	for _, grid := range grids {
		if grid.IsShield == pkg.EXIST {
			fmt.Println("当前id", grid.ID)
			duration := grid.EndShieldTime.Sub(time.Now())
			internal.GetInternalManager().CreateTimer(grid.ID, duration)
		}
	}
	utils.Tools.LG.Info("初始化盾信息成功")
}

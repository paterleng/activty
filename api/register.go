package api

import (
	"activity/dao"
	"activity/internal"
)

// 用于注册全局对象
func Register() {
	CreateManager()
	internal.CreateInternalManager()
	dao.CreateDaoManager()

}

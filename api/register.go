package api

import (
	"activity/dao"
)

// 用于注册全局对象
func Register() {
	CreateManager()
	dao.CreateDaoManager()
}

package model

import "gorm.io/gorm"

// 用于表示棋盘中每个格子的信息
type CheckerBoard struct {
	gorm.Model
	BlockId       int     `json:"block_id" gorm:"column:block_id"`             //块号
	RowId         int     `json:"row_id" gorm:"column:row_id"`                 //行号
	LineId        int     `json:"line_id" gorm:"column:line_id"`               //列号
	Price         float64 `json:"price" gorm:"column:price"`                   //价格
	Owner         string  `json:"owner" gorm:"column:owner"`                   //拥有者，写上用户的用户名
	UserId        string  `json:"user_id" gorm:"column:user_id"`               //用户id
	AvatarId      int     `json:"avatar_id" gorm:"column:avatar_id"`           //用户的头像id
	PriceIncrease float64 `json:"price_increase" gorm:"column:price_increase"` //表示在一定时间内上调后的价格
	Status        int     `json:"status" gorm:"-"`                             // 表示当前用户是否拥有这个格子
}

type Board struct {
	Record    Record
	UserName  string
	Freeze    float64
	Available float64
	AvatarId  int
}

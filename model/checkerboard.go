package model

import (
	"gorm.io/gorm"
	"time"
)

// 用于表示棋盘中每个格子的信息
type CheckerBoard struct {
	gorm.Model
	BlockId         int       `json:"block_id" gorm:"column:block_id"`                   //块号
	RowId           int       `json:"row_id" gorm:"column:row_id"`                       //行号
	LineId          int       `json:"line_id" gorm:"column:line_id"`                     //列号
	Price           float64   `json:"price" gorm:"column:price"`                         //价格
	Owner           string    `json:"owner" gorm:"column:owner"`                         //拥有者，写上用户的用户名
	UserId          string    `json:"user_id" gorm:"column:user_id"`                     //用户id
	AvatarId        int       `json:"avatar_id" gorm:"column:avatar_id"`                 //用户的头像id
	PriceIncrease   float64   `json:"price_increase" gorm:"column:price_increase"`       //表示在一定时间内上调后的价格
	IsShield        int       `json:"is_shield" gorm:"column:is_shield"`                 //状态，表示是否是加盾状态
	StartShieldTime time.Time `json:"start_shield_time" gorm:"column:start_shield_time"` //表示开始加盾的时间
	EndShieldTime   time.Time `json:"end_shield_time" gorm:"column:end_shield_time"`     //表示盾结束的时间
	Status          int       `json:"status" gorm:"-"`                                   //表示当前用户是否拥有这个格子
}

type Board struct {
	Record        []Record
	CheckerBoards []CheckerBoard
	Freeze        float64
	Available     float64
}

// Settlement 用于结算使用
type Settlement struct {
	UserId string  `json:"user_id"` // 结算地址
	Total  float64 `json:"total"`   // 结算金额
}

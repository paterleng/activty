package model

import "gorm.io/gorm"

// 主要用于记录用户在游戏过程中所进行的操作
type Record struct {
	gorm.Model
	Owner             string `json:"owner" gorm:"column:owner"`                                              // 拥有者
	OldOwner          string `json:"old_owner" gorm:"column:old_owner" binding:"required"`                   // 原来拥有者
	OldAmount         int    `json:"old_amount" gorm:"column:old_amount" binding:"required"`                 // 成交前价格
	TransactionAmount int    `json:"transaction_amount" gorm:"column:transaction_amount" binding:"required"` // 成交金额
	GridId            int    `json:"grid_id" gorm:"column:grid_id" binding:"required"`                       // 格子id
	BlockId           int    `json:"block_id" gorm:"column:block_id" binding:"required"`                     // 块id
	Total             int    `json:"total" gorm:"-"`
}

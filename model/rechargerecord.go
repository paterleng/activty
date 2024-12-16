package model

import "gorm.io/gorm"

// RechargerRecord 用于记录用户的充值记录
type RechargerRecord struct {
	gorm.Model
	FromUser        string  `json:"from_user" gorm:"column:from_user" `                                 // 发送方
	ToUser          string  `json:"to_user" gorm:"column:to_user" `                                     // 接收方
	BlockNumber     uint64  `json:"block_number" gorm:"column:block_number" `                           // 交易块号
	TransactionHash string  `json:"transaction_hash" gorm:"column:transaction_hash" binding:"required"` // 交易hash
	Amount          float64 `json:"amount" gorm:"column:amount"`                                        // 交易金额
	TransationType  int     `json:"transation_type" gorm:"column:transation_type"`                      //交易类型：1、充值，2、退款
}

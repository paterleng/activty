package model

import "gorm.io/gorm"

// 用于记录用户的充值记录
type RechargerRecord struct {
	gorm.Model
	FromUser        string `json:"from_user" gorm:"column:from_user" binding:"required"`               // 发送方
	ToUser          string `json:"to_user" gorm:"column:to_user" binding:"required"`                   // 接收方
	BlockHash       string `json:"block_hash" gorm:"column:block_hash" binding:"required"`             // 块hash
	BlockNumber     int64  `json:"block_number" gorm:"column:block_number" binding:"required"`         // 交易块号
	TransactionHash string `json:"transaction_hash" gorm:"column:transaction_hash" binding:"required"` // 交易hash
	Amount          int    `json:"amount" gorm:"column:amount" binding:"required"`                     // 交易金额
	WalletType      string `json:"wallet_type" gorm:"column:wallet_type" binding:"required"`           // 通过哪个钱包交易的
}

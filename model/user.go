package model

type User struct {
	UserId         string `json:"user_id" gorm:"column:user_id"`
	UserName       string `json:"user_name" gorm:"column:user_name"`
	WalletAdr      string `json:"wallet_adr" gorm:"column:wallet_adr" binding:"required"`           // 钱包地址
	WalletPlatform string `json:"wallet_platform" gorm:"column:wallet_platform" binding:"required"` // 钱包平台
	AvatarId       int    `json:"avatar_id" gorm:"column:avatar_id"`                                // 头像Id
	Assets         Assets `json:"assets" gorm:"-"`                                                  // 资产信息
}

type UpdateUser struct {
	UserName string `json:"user_name" gorm:"column:user_name"`
	AvatarId int    `json:"avatar_id" gorm:"column:avatar_id"`
}

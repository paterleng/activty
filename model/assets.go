package model

import "gorm.io/gorm"

type Assets struct {
	gorm.Model
	Total     int    `json:"total"`
	Freeze    int    `json:"freeze"`
	Available int    `json:"available"`
	UserId    string `json:"user_id" gorm:"column:user_id"`
}

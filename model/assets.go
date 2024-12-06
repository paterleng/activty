package model

import "gorm.io/gorm"

type Assets struct {
	gorm.Model
	Total     float64 `json:"total"`
	Freeze    float64 `json:"freeze"`
	Available float64 `json:"available"`
	UserId    string  `json:"user_id" gorm:"column:user_id"`
}

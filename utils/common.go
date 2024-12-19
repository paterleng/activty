package utils

import (
	"activity/model"
)

func Amount() (total float64, err error) {
	var boards []model.CheckerBoard
	err = Tools.DB.Find(&boards).Error
	if err != nil {
		return
	}
	total = 0.00
	for _, board := range boards {
		if board.Price >= board.PriceIncrease {
			total += board.Price
		} else {
			total += board.PriceIncrease
		}
	}
	//加上自己质押的
	total += 20000
	return total, err
}

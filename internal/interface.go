package internal

import (
	"activity/utils"
	"time"
)

var daoManager InternalManager

type InternalController struct {
	TimerManager
}

type TimerInterface interface {
	CreateTimer(gridId uint, duration time.Duration)
}

type InternalManager interface {
	TimerInterface
}

func CreateInternalManager() {
	daoManager = NewDaoManager()
}

func NewDaoManager() *InternalController {
	var internal InternalController
	internal.manager = utils.TimerController
	return &internal
}

func GetInternalManager() InternalManager {
	return daoManager
}

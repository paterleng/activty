package api

import (
	"activity/controller"
	"activity/utils"
)

var apiManager ApiManager

type Routes struct {
	controller.UserController
	controller.CheckerBoardController
	controller.WebSocketController
}

type ApiManager interface {
	UserInterface
	CheckerboardInterface
	WebSocketInterface
}

func CreateManager() {
	apiManager = NewManager()
}

func NewManager() *Routes {
	var router Routes
	router.UserController.LG = utils.Tools.LG
	router.UserController.SnowId = utils.Tools.SnowId
	router.CheckerBoardController.LG = utils.Tools.LG
	router.WebSocketController.ConnManager = utils.ConnManager
	return &router
}

func GetApiManager() ApiManager {
	return apiManager
}

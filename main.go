package main

import (
	"activity/api"
	"activity/handle"
	"activity/utils"
	"github.com/gin-gonic/gin"
)

func main() {
	engine := gin.Default()
	utils.CreateBoardData()
	api.Register()
	api.ApiRoute(engine)
	handle.Run()
	engine.Run("localhost:" + utils.Conf.ProjectConfig.Port)
}

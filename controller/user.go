package controller

import (
	"activity/dao"
	"activity/model"
	"activity/pkg"
	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
)

type UserController struct {
	LG     *zap.Logger
	SnowId *pkg.Snowflake
}

func (p *UserController) Login(c *gin.Context) {
	var user model.User
	if err := c.ShouldBind(&user); err != nil {
		p.LG.Error("login invalid param error:", zap.Error(err))
		pkg.ResponseError(c, pkg.CodeInvalidParam)
		return
	}

	userInfo, err := dao.GetDaoManager().GetUserInfo(user.UserName)
	if err != nil {
		p.LG.Error("用户信息查询失败:", zap.Error(err))
		pkg.ResponseError(c, pkg.CodeServerBusy)
		return
	}

	//生成token，这个地方只返回一个token
	token, err := pkg.GenToken(userInfo.UserId)
	if err != nil {
		p.LG.Error("token生成失败", zap.Error(err))
		pkg.ResponseError(c, pkg.CodeServerBusy)
		return
	}
	pkg.ResponseSuccess(c, token)
}

func (p *UserController) Register(c *gin.Context) {
	var user model.User
	if err := c.ShouldBind(&user); err != nil {
		p.LG.Error("register invalid param error:", zap.Error(err))
		pkg.ResponseError(c, pkg.CodeInvalidParam)
		return
	}
	//注册
	err := dao.GetDaoManager().Register(&user)
	if err != nil {
		p.LG.Error("register user error:", zap.Error(err))
		pkg.ResponseError(c, pkg.CodeCreateError)
		return
	}
	pkg.ResponseSuccess(c, pkg.CodeSuccess)
}

func (p *UserController) GetUserInfo(c *gin.Context) {
	userId := c.GetString(pkg.USERID)
	if userId == "" {
		p.LG.Error("用户id在上下文中未找到")
		pkg.ResponseError(c, pkg.CodeNeedLogin)
		return
	}
	userInfo, err := dao.GetDaoManager().GetUserInfo(userId)
	if err != nil {
		p.LG.Error("查询用户信息失败:", zap.Error(err))
		pkg.ResponseError(c, pkg.CodeServerBusy)
		return
	}

	asset, err := dao.GetDaoManager().GetUserAssetInfo(userId)
	if err != nil {
		p.LG.Error("查询用户资产信息:", zap.Error(err))
		pkg.ResponseError(c, pkg.CodeServerBusy)
		return
	}

	info := struct {
		UserName  string `json:"user_name"`
		Total     int    `json:"total"`
		Frozen    int    `json:"frozen"`
		Available int    `json:"available"`
	}{
		UserName:  userInfo.UserName,
		Total:     asset.Total,
		Frozen:    asset.Freeze,
		Available: asset.Available,
	}
	pkg.ResponseSuccess(c, info)
}

// Recharge 用户充值
func (p *UserController) Recharge(c *gin.Context) {
	var chargeInfo model.RechargerRecord
	if err := c.ShouldBind(&chargeInfo); err != nil {
		p.LG.Error("充值参数绑定失败", zap.Error(err))
		pkg.ResponseError(c, pkg.CodeInvalidParam)
		return
	}
	/**
	1、更新之前先查看这笔交易是否存在，确认是否是直接调用的api
	*/

	//2、充值过程中，先更新资产表再更新充值记录表
	err := dao.GetDaoManager().UpdateUserAssetInfo(chargeInfo)
	if err != nil {
		p.LG.Error("充值接口数据库写入失败", zap.Error(err))
		pkg.ResponseError(c, pkg.CodeServerBusy)
		return
	}
	pkg.ResponseSuccess(c, pkg.CodeSuccess)
}

// PutUserInfo 修改用户信息
func (p *UserController) PutUserInfo(c *gin.Context) {
	userId := c.GetString(pkg.USERID)
	if userId == "" {
		p.LG.Error("用户id在上下文中未找到")
		pkg.ResponseError(c, pkg.CodeNeedLogin)
		return
	}
	var user model.User
	if err := c.ShouldBind(&user); err != nil {
		p.LG.Error("修改用户信息失败", zap.Error(err))
		pkg.ResponseError(c, pkg.CodeInvalidParam)
		return
	}
	user.UserId = userId
	//更新用户信息
	err := dao.GetDaoManager().PutUserInfo(user)
	if err != nil {
		p.LG.Error("修改用户信息失败", zap.Error(err))
		pkg.ResponseError(c, pkg.CodeUpdateError)
		return
	}
	//更新棋盘信息
	err = dao.GetDaoManager().UpdateUserBoardInfo(user.AvatarId, userId)
	if err != nil {
		p.LG.Error("修改用户棋盘信息失败", zap.Error(err))
		pkg.ResponseError(c, pkg.CodeUpdateError)
		return
	}
	pkg.ResponseSuccess(c, pkg.CodeSuccess)
}

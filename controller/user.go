package controller

import (
	"activity/dao"
	"activity/model"
	"activity/pkg"
	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
	"gorm.io/gorm"
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

	userInfo, err := dao.GetDaoManager().GetUserInfoFirst(user.UserId)
	if err == gorm.ErrRecordNotFound {
		//检查用户是否之前注册过，如果之前注册过就进行登录，如果没有注册过就注册过之后再返回信息
		//区分用户使用的是钱包平台以及地址，创建用户，并初始化用户资源
		/**
		1、创建用户
		2、创建用户资产数据
		*/
		err := dao.GetDaoManager().Register(&user)
		if err != nil {
			p.LG.Error("用户注册失败:", zap.Error(err))
			pkg.ResponseError(c, pkg.CodeServerBusy)
			return
		}

		//初始化资产数据
		asset := model.Assets{
			Total:     0,
			Freeze:    0,
			Available: 0,
			UserId:    user.UserId,
		}
		err = dao.GetDaoManager().CreateAssetInfo(asset)
		if err != nil {
			p.LG.Error("创建用户资产数据失败:", zap.Error(err))
			pkg.ResponseError(c, pkg.CodeServerBusy)
			return
		}
	}
	if err != nil && err != gorm.ErrRecordNotFound {
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
		UserName  string  `json:"user_name"`
		AvatarId  int     `json:"avatar_id"`
		Total     float64 `json:"total"`
		Frozen    float64 `json:"frozen"`
		Available float64 `json:"available"`
	}{
		AvatarId:  userInfo.AvatarId,
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
	var user model.UpdateUser
	if err := c.ShouldBind(&user); err != nil {
		p.LG.Error("修改用户信息失败", zap.Error(err))
		pkg.ResponseError(c, pkg.CodeInvalidParam)
		return
	}
	userInfo, err := dao.GetDaoManager().GetUserInfo(userId)
	if err != nil {
		p.LG.Error("获取用户信息失败", zap.Error(err))
		pkg.ResponseError(c, pkg.CodeServerBusy)
		return
	}
	if user.AvatarId != 0 {
		userInfo.AvatarId = user.AvatarId
	}
	if user.UserName != "" {
		userInfo.UserName = user.UserName
	}

	//更新用户信息
	err = dao.GetDaoManager().PutUserInfo(userInfo)
	if err != nil {
		p.LG.Error("修改用户信息失败", zap.Error(err))
		pkg.ResponseError(c, pkg.CodeUpdateError)
		return
	}
	//更新棋盘信息
	err = dao.GetDaoManager().UpdateUserBoardInfo(userInfo)
	if err != nil {
		p.LG.Error("修改用户棋盘信息失败", zap.Error(err))
		pkg.ResponseError(c, pkg.CodeUpdateError)
		return
	}

	pkg.ResponseSuccess(c, pkg.CodeSuccess)
}

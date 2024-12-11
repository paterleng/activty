package controller

import (
	"activity/dao"
	"activity/internal"
	"activity/model"
	"activity/pkg"
	"activity/utils"
	"fmt"
	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
	"strconv"
	"time"
)

type CheckerBoardController struct {
	LG *zap.Logger
}

// UserBetting 押注
func (p *CheckerBoardController) UserBetting(c *gin.Context) {
	userId := c.GetString(pkg.USERID)
	if userId == "" {
		p.LG.Error("用户id在上下文中未找到")
		pkg.ResponseError(c, pkg.CodeNeedLogin)
		return
	}
	//获取交易信息
	var bet model.Record
	if err := c.ShouldBind(&bet); err != nil {
		p.LG.Error("参数绑定失败", zap.Error(err))
		pkg.ResponseError(c, pkg.CodeParamError)
		return
	}
	bet.Owner = userId
	/**
	1、查询用户余额是否足够
	2、生成交易记录
	3、更新格子信息
	4、扣除用户金额
	5、返还被抢用户的钱
	*/
	assetInfo, err := dao.GetDaoManager().GetUserAssetInfo(userId)
	if err != nil {
		p.LG.Error("获取用户资产信息失败", zap.Error(err))
		pkg.ResponseError(c, pkg.CodeServerBusy)
		return
	}
	if assetInfo.Available < bet.TransactionAmount {
		p.LG.Error("用户可用余额不足", zap.Error(err))
		pkg.ResponseError(c, pkg.CodeInsufficientBalance)
		return
	}
	//获取当前格子的信息，判断该用户提交的金额是否符合要求
	checkerBoard, err := dao.GetDaoManager().GetGaidInfoByGaidId(bet.GridId)
	if err != nil {
		p.LG.Error("获取格子信息失败", zap.Error(err))
		pkg.ResponseError(c, pkg.CodeServerBusy)
		return
	}
	if checkerBoard.PriceIncrease >= bet.TransactionAmount || checkerBoard.Price >= bet.TransactionAmount {
		p.LG.Error("用户提交的数据不足以买下", zap.Error(err))
		pkg.ResponseError(c, pkg.CodePriceError)
		return
	}

	//查询用户信息
	userInfo, err := dao.GetDaoManager().GetUserInfo(userId)
	if err != nil {
		p.LG.Error("获取用户信息失败", zap.Error(err))
		pkg.ResponseError(c, pkg.CodeServerBusy)
		return
	}
	var board model.Board
	//在记录中记录用户名用于前端展示
	bet.OldAmount = checkerBoard.Price
	bet.Name = userInfo.UserName
	bet.OldName = checkerBoard.Owner
	bet.OldOwner = checkerBoard.UserId
	board.Record = bet
	board.UserName = userInfo.UserName
	board.Freeze = assetInfo.Freeze + bet.TransactionAmount
	board.Available = assetInfo.Available - bet.TransactionAmount
	board.AvatarId = userInfo.AvatarId
	//数据入库
	err = dao.GetDaoManager().CreateGridRecord(board)
	if err != nil {
		p.LG.Error("用户在格子下单失败", zap.Error(err))
		pkg.ResponseError(c, pkg.CodeServerBusy)
		return
	}
	/**
	数据入库之后更新棋盘数据，通过websocket通知前端取数据
	把消息写入管道
	*/
	var message model.Message
	message.BlockId = checkerBoard.BlockId
	message.Type = 1
	utils.ChMessage <- message
	pkg.ResponseSuccess(c, pkg.CodeSuccess)
}

// GetOperateRecords 获取用户的操作记录，包括被抢占的记录
func (p *CheckerBoardController) GetUserOperateRecords(c *gin.Context) {
	userId := c.GetString(pkg.USERID)
	if userId == "" {
		p.LG.Error("用户id在上下文中未找到")
		pkg.ResponseError(c, pkg.CodeNeedLogin)
		return
	}

	sizeStr := c.Query("size")
	pageStr := c.Query("page")
	size, _ := strconv.Atoi(sizeStr)
	page, _ := strconv.Atoi(pageStr)

	fmt.Println("size", size)
	fmt.Println("page", page)
	if size == 0 || page == 0 {
		page = 1
		size = 10
	}

	records, total, err := dao.GetDaoManager().GetRecordByUserId(userId, page, size)
	if err != nil {
		p.LG.Error("获取用户交易记录错误", zap.Error(err))
		pkg.ResponseError(c, pkg.CodeServerBusy)
		return
	}
	data := struct {
		Records []model.Record `json:"records"`
		Total   int64          `json:"total"`
	}{
		Records: records,
		Total:   total,
	}
	pkg.ResponseSuccess(c, data)
}

// GetCheckBoardInfo 获取棋盘信息
func (p *CheckerBoardController) GetCheckBoardInfo(c *gin.Context) {
	userId := c.GetString(pkg.USERID)
	if userId == "" {
		p.LG.Error("用户id在上下文中未找到")
		pkg.ResponseError(c, pkg.CodeNeedLogin)
		return
	}
	//接收一个模块id，然后查数据返回
	blockId := c.Param("block_id")
	fmt.Println(blockId)
	if blockId == "" {
		p.LG.Error("模块id为空不展示数据")
		pkg.ResponseError(c, pkg.CodeParamError)
		return
	}

	boardInfo, err := dao.GetDaoManager().GetBoardInfo(blockId)
	if err != nil {
		p.LG.Error("查询棋盘信息失败", zap.Error(err))
		pkg.ResponseError(c, pkg.CodeServerBusy)
		return
	}
	// 用户当前拥有的格子
	nowGrid := make(map[uint]bool)
	// 用户之前拥有的格子
	oldGrid := make(map[uint]bool)
	// 先查出来用户现在在这个块里面有哪些格子
	userGrid, err := dao.GetDaoManager().GetUserGrid(blockId, userId)
	if err != nil {
		p.LG.Error("查询用户格子信息失败", zap.Error(err))
		pkg.ResponseError(c, pkg.CodeServerBusy)
		return
	}
	// 获取到用户之前的操作记录信息，找到用户之前有过哪些格子，根据块id查询
	recordGrid, err := dao.GetDaoManager().GerRecordGrid(blockId, userId)

	for _, grid := range userGrid {
		nowGrid[grid.ID] = true
	}
	for _, grid := range recordGrid {
		oldGrid[uint(grid.GridId)] = true
	}

	for _, board := range boardInfo {
		if oldGrid[board.ID] {
			board.Status = pkg.PREEMPTED
		}
		if nowGrid[board.ID] {
			board.Status = pkg.HAVE
		}
	}
	pkg.ResponseSuccess(c, boardInfo)
}

// GetRecords 获取前50条记录
func (p *CheckerBoardController) GetRecords(c *gin.Context) {
	records, err := dao.GetDaoManager().GetRecord()
	if err != nil {
		p.LG.Error("获取前50条交易记录失败", zap.Error(err))
		pkg.ResponseError(c, pkg.CodeServerBusy)
		return
	}
	pkg.ResponseSuccess(c, records)
}

// AddShield 加盾
func (p *CheckerBoardController) AddShield(c *gin.Context) {
	/**
	1、获取请求信息
	2、判断用户盾是否足够
	3、向格子加状态
	4、创建定时器
	5、更新用户盾数量
	6、查询交易是否成功
	*/
	var data model.AddShield
	if err := c.ShouldBind(&data); err != nil {
		p.LG.Error("参数错误：", zap.Error(err))
		pkg.ResponseError(c, pkg.CodeParamError)
		return
	}
	userId := c.GetString(pkg.USERID)
	assetInfo, err := dao.GetDaoManager().GetUserAssetInfo(userId)
	if err != nil {
		p.LG.Error("获取用户资产信息失败：", zap.Error(err))
		pkg.ResponseError(c, pkg.CodeServerBusy)
		return
	}
	if assetInfo.Shield < data.ShieldAmount {
		pkg.ResponseError(c, pkg.CodeInsufficientBalance)
		return
	}
	//获取格子信息
	gridInfo, err := dao.GetDaoManager().GetGaidInfoByGaidId(data.GridId)
	if err != nil {
		p.LG.Error(fmt.Sprintf("获取格子%t失败，失败原因：%t"), zap.Error(err))
		pkg.ResponseError(c, pkg.CodeServerBusy)
		return
	}
	if gridInfo.UserId != userId {
		pkg.ResponseError(c, pkg.CodeUpdateError)
		return
	}
	nowTime := time.Now()
	if gridInfo.IsShield == pkg.EXIST {
		gridInfo.EndShieldTime = gridInfo.EndShieldTime.Add(time.Duration(data.ShieldAmount) * time.Minute)
	} else {
		gridInfo.IsShield = pkg.EXIST
		gridInfo.StartShieldTime = nowTime
		gridInfo.EndShieldTime = nowTime.Add(time.Duration(data.ShieldAmount) * time.Minute)
	}
	//加盾
	err = dao.GetDaoManager().UpdateBoardShield(gridInfo)
	if err != nil {
		p.LG.Error(fmt.Sprintf("加盾失败，失败格子id：%t"), zap.Error(err))
		pkg.ResponseError(c, pkg.CodeServerBusy)
		return
	}
	//计算时间
	duration := gridInfo.EndShieldTime.Sub(nowTime)
	//加盾成功后就创建一个定时器用于更新状态
	internal.GetInternalManager().CreateTimer(gridInfo.ID, duration)
	//更新盾数量
	assetInfo.Shield = assetInfo.Shield - data.ShieldAmount
	err = dao.GetDaoManager().UpdateAssetShildInfo(assetInfo)
	if err != nil {
		p.LG.Error(fmt.Sprintf("盾信息更细失败，失败格子id：%t"), zap.Error(err))
		pkg.ResponseError(c, pkg.CodeServerBusy)
		return
	}
	//通知前端更新棋盘信息
	var message model.Message
	message.BlockId = gridInfo.BlockId
	message.Type = 1
	utils.ChMessage <- message
	pkg.ResponseSuccess(c, pkg.CodeSuccess)
}

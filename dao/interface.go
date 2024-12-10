package dao

import (
	"activity/model"
	"activity/utils"
)

var daoManager DaoManager

type DaoController struct {
	UserDao
	CheckBoardDao
}

type User interface {
	CheckUserName(username string) (bool, error)
	GetUserInfo(userId string) (model.User, error)
	GetUserInfoFirst(userId string) (model.User, error)
	CheckPassWord(password string) (bool, error)
	GetUserAssetInfo(userId string) (model.Assets, error)
	CreateAssetInfo(assets model.Assets) error
	UpdateUserAssetInfo(chargeInfo model.RechargerRecord) error
	UpdateAssetShildInfo(assets model.Assets) error
	Register(user *model.User) error
	PutUserInfo(user model.User) error
}

type CheckerBoard interface {
	GetRecordByUserId(userId string, page, size int) ([]model.Record, int64, error)
	GetBoardInfo(blockId string) ([]model.CheckerBoard, error)
	GetUserGrid(blockId string, userId string) ([]model.CheckerBoard, error)
	GerRecordGrid(blockId string, userId string) ([]model.Record, error)
	CreateGridRecord(board model.Board) error
	GetRecord() ([]model.Record, error)
	UpdateUserBoardInfo(user model.User) error
	GetGaidInfoByGaidId(gaidId int) (model.CheckerBoard, error)
	UpdateBoardShield(board model.CheckerBoard) error
	UpdateGridState(id uint, statue int) error
	GetAllGrid() ([]model.CheckerBoard, error)
}

type DaoManager interface {
	User
	CheckerBoard
}

func CreateDaoManager() {
	daoManager = NewDaoManager()
}

func NewDaoManager() *DaoController {
	var dao DaoController
	dao.UserDao.DB = utils.Tools.DB
	dao.CheckBoardDao.DB = utils.Tools.DB
	return &dao
}

func GetDaoManager() DaoManager {
	return daoManager
}

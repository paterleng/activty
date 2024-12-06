package dao

import (
	"activity/model"
	"gorm.io/gorm"
)

type CheckBoardDao struct {
	DB *gorm.DB
}

// GetRecordByUserId 根据用户id查询用户的操作记录
func (p *CheckBoardDao) GetRecordByUserId(userId string, page, size int) ([]model.Record, int64, error) {
	var records []model.Record
	err := p.DB.Where("owner = ? or old_owner = ?", userId, userId).Limit(size).Offset((page - 1) * size).Order("created_at desc").Find(&records).Error
	if err != nil {
		return nil, 0, err
	}
	var total int64
	err = p.DB.Model(model.Record{}).Where("owner = ?", userId).Count(&total).Error
	return records, total, err
}

// GetBoardInfo 根据块id查询棋盘信息
func (p *CheckBoardDao) GetBoardInfo(boardId string) ([]model.CheckerBoard, error) {
	var checkerBoards []model.CheckerBoard
	err := p.DB.Where("block_id = ?", boardId).Find(&checkerBoards).Error
	return checkerBoards, err
}

// GetUserGrid 获取用户在某一块拥有的格子信息
func (p *CheckBoardDao) GetUserGrid(blockId string, userId string) ([]model.CheckerBoard, error) {
	var checkerBoards []model.CheckerBoard
	err := p.DB.Where("block_id = ? AND user_id = ?", blockId, userId).Find(&checkerBoards).Error
	return checkerBoards, err
}

// GerRecordGrid 查询用户之前拥有格子的信息
func (p *CheckBoardDao) GerRecordGrid(blockId string, userId string) ([]model.Record, error) {
	var records []model.Record
	err := p.DB.Where("block_id = ? AND owner = ?", blockId, userId).Find(&records).Error
	return records, err
}

// CreateGridRecord 对格子的操作
func (p *CheckBoardDao) CreateGridRecord(board model.Board) error {
	tx := p.DB.Begin()
	//先创建交易记录
	if err := tx.Create(&board.Record).Error; err != nil {
		tx.Rollback()
		return err
	}
	//更新格子信息
	err := tx.Where("id = ? ", board.Record.GridId).Updates(model.CheckerBoard{UserId: board.Record.Owner, Owner: board.UserName, Price: board.Record.TransactionAmount, AvatarId: board.AvatarId}).Error
	if err != nil {
		tx.Rollback()
		return err
	}
	//扣除用户金额
	err = tx.Where("user_id = ?", board.Record.Owner).Updates(model.Assets{Freeze: board.Freeze, Available: board.Available}).Error
	if err != nil {
		tx.Rollback()
		return err
	}
	return tx.Commit().Error
}

// GetRecord 获取前50条交易记录
func (p *CheckBoardDao) GetRecord() ([]model.Record, error) {
	var records []model.Record
	err := p.DB.Order("created_at desc").
		Limit(50).
		Offset(0).
		Find(&records).Error
	return records, err
}

// 更新用户在棋盘上的数据
func (p *CheckBoardDao) UpdateUserBoardInfo(user model.User) error {
	err := p.DB.Model(&model.CheckerBoard{}).Where("user_id = ?", user.UserId).Updates(model.CheckerBoard{AvatarId: user.AvatarId, Owner: user.UserName}).Error
	return err
}

func (p *CheckBoardDao) GetGaidInfoByGaidId(gaidId int) (model.CheckerBoard, error) {
	var checkerBoard model.CheckerBoard
	err := p.DB.Where("id = ?", gaidId).First(&checkerBoard).Error
	return checkerBoard, err
}

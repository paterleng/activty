package dao

import (
	"activity/model"
	"errors"
	"fmt"
	"gorm.io/gorm"
)

type UserDao struct {
	DB *gorm.DB
}

// 检查用户名是否存在
func (p *UserDao) CheckUserName(userName string) (bool, error) {
	var user User
	err := p.DB.Where("username = ?", userName).Find(&user).Error
	if err != nil {
		return false, err
	}
	return true, nil
}

// GetUserInfo 根据用户id获取用户基本信息
func (p *UserDao) GetUserInfo(userId string) (model.User, error) {
	var user model.User
	err := p.DB.Where("user_id = ?", userId).Find(&user).Error
	return user, err
}

func (p *UserDao) GetUserInfoFirst(userId string) (model.User, error) {
	var user model.User
	err := p.DB.Where("user_id = ?", userId).First(&user).Error
	return user, err
}

// GetUserAssetInfo 根据用户id获取用户资产信息
func (p *UserDao) GetUserAssetInfo(userId string) (model.Assets, error) {
	var assets model.Assets
	err := p.DB.Where("user_id = ?", userId).Find(&assets).Error
	return assets, err
}

// UpdateUserAssetInfo 更新用户资产信息，并生成交易记录
func (p *UserDao) UpdateUserAssetInfo(chargeInfo model.RechargerRecord) error {
	//开启事务
	db := p.DB.Begin()
	//先获取用户的原有资产
	var asset model.Assets
	err := db.Where("user_id = ?", chargeInfo.FromUser).Find(&asset).Error
	if err != nil {
		db.Rollback()
		return err
	}
	//更新用户资产
	total := asset.Total + chargeInfo.Amount
	available := asset.Available + chargeInfo.Amount
	err = db.Table("assets").Where("user_id = ?", chargeInfo.FromUser).Updates(model.Assets{Total: total, Available: available}).Error
	if err != nil {
		db.Rollback()
		return err
	}
	//生成充值记录
	err = db.Create(&chargeInfo).Error
	if err != nil {
		db.Rollback()
		return err
	}
	//提交事务
	err = db.Commit().Error
	if err != nil {
		return errors.New(fmt.Sprintf("事务提交失败", err))
	}
	return nil
}

// UpdateAssetInfo 在用户退款时更新用户资产信息，并生成交易记录
func (p *UserDao) UpdateAssetInfo(userId string, amount float64) error {
	//开启事务
	db := p.DB.Begin()
	//先获取用户的原有资产
	var asset model.Assets
	err := db.Where("user_id = ?", userId).Find(&asset).Error
	if err != nil {
		db.Rollback()
		return err
	}
	//更新用户资产
	total := asset.Total - amount
	available := asset.Available - amount
	err = db.Table("assets").Updates(model.Assets{Total: total, Available: available}).Where("user_id = ?", userId).Error
	if err != nil {
		db.Rollback()
		return err
	}
	chargeInfo := model.RechargerRecord{
		FromUser: "system",
		ToUser:   userId,
		Amount:   amount,
		//TransactionHash: tx,
		TransationType: 2,
	}
	//生成退款记录
	err = db.Create(&chargeInfo).Error
	if err != nil {
		db.Rollback()
		return err
	}
	//提交事务
	err = db.Commit().Error
	if err != nil {
		return errors.New(fmt.Sprintf("事务提交失败", err))
	}
	return nil
}

func (p *UserDao) CreateAssetInfo(asset model.Assets) error {
	err := p.DB.Create(&asset).Error
	return err
}

// CheckPassWord 检查密码是否正确
func (p *UserDao) CheckPassWord(password string) (bool, error) {
	var user User
	err := p.DB.Where("password = ?", password).Find(&user).Error
	if err != nil {
		return false, err
	}
	return true, nil
}

// Register 注册用户
func (p *UserDao) Register(user *model.User) error {
	err := p.DB.Create(user).Error
	return err
}

// 更新用户信息
func (p *UserDao) PutUserInfo(user model.User) error {
	err := p.DB.Where("user_id = ?", user.UserId).Updates(&user).Error
	return err
}

// 更新用户的盾数量信息
func (p *UserDao) UpdateAssetShildInfo(asset model.Assets) error {
	err := p.DB.Where("user_id = ?", asset.UserId).Updates(&asset).Error
	return err
}

// GetReChargeRecord 获取用户充值记录
func (p *UserDao) GetReChargeRecord(userId string) ([]model.RechargerRecord, error) {
	var rechargerRecord []model.RechargerRecord
	err := p.DB.Where("user_id = ?", userId).Find(&rechargerRecord).Error
	return rechargerRecord, err
}

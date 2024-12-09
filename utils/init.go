package utils

import (
	"activity/model"
	"activity/pkg"
	"database/sql"
	"fmt"
	"github.com/fsnotify/fsnotify"
	_ "github.com/go-sql-driver/mysql"
	"github.com/natefinch/lumberjack"
	"github.com/spf13/viper"
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"os"
	"time"
)

type Utils struct {
	LG     *zap.Logger
	DB     *gorm.DB
	SnowId *pkg.Snowflake
}

var Tools Utils
var Conf = new(model.Config)
var ConnManager map[string]map[int]model.Client
var ChMessage chan model.Message
var TimerController model.TimerManager

func init() {
	if err := ViperInit(); err != nil {
		fmt.Errorf("初始化viper失败：", err)
		return
	}

	if err := LoggerInit(); err != nil {
		fmt.Errorf("初始化日志对象失败：", err)
		return
	}
	Tools.LG.Info("初始化logger成功")
	if err := MysqlInit(); err != nil {
		Tools.LG.Error("初始化MySQL失败：", zap.Error(err))
		panic(err)
	}
	Tools.LG.Info("初始化mysql成功")
	Tools.SnowId = pkg.NewSnowflake(1, 2)
	//创建表
	if err := TableInit(); err != nil {
		Tools.LG.Error("初始化表失败：", zap.Error(err))
		panic(err)
	}
	//	初始化websocket连接管理对象
	ConnManager = make(map[string]map[int]model.Client)
	//初始化消息广播的channel,缓冲区为100
	ChMessage = make(chan model.Message, 100)
	//	初始化全局定时管理对象
	TimerController = NewTimerManager()
}

func NewTimerManager() *model.TimerManager {
	return &model.TimerManager{
		Timers:    make(map[int]*time.Timer),
		Durations: make(map[int]time.Duration),
	}
}

func TableInit() (err error) {
	err = Tools.DB.AutoMigrate(model.User{})
	err = Tools.DB.AutoMigrate(model.RechargerRecord{})
	err = Tools.DB.AutoMigrate(model.Record{})
	err = Tools.DB.AutoMigrate(model.CheckerBoard{})
	err = Tools.DB.AutoMigrate(model.CheckerBoard{})
	err = Tools.DB.AutoMigrate(model.Assets{})
	return
}

func MysqlInit() (err error) {
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%d)/", Conf.MySQLConfig.User, Conf.MySQLConfig.Password, Conf.MySQLConfig.Host, Conf.MySQLConfig.Port)
	db, err := sql.Open("mysql", dsn)
	if err != nil {
		return
	}
	defer db.Close()
	query := fmt.Sprintf("SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = '%s'", Conf.MySQLConfig.DB)
	var name string
	err = db.QueryRow(query).Scan(&name)
	if err != nil {
		if err == sql.ErrNoRows {
			err = nil
			_, err = db.Exec("CREATE DATABASE " + Conf.MySQLConfig.DB)
			if err != nil {
				return
			}
		}
		return
	}

	dsn = fmt.Sprintf("%s:%s@tcp(%s:%d)/%s?parseTime=true&loc=Local", Conf.MySQLConfig.User, Conf.MySQLConfig.Password, Conf.MySQLConfig.Host, Conf.MySQLConfig.Port, Conf.MySQLConfig.DB)
	mysqlConfig := mysql.Config{
		DSN:                       dsn,
		DefaultStringSize:         191,
		SkipInitializeWithVersion: false,
	}
	Tools.DB, err = gorm.Open(mysql.New(mysqlConfig), &gorm.Config{
		DisableForeignKeyConstraintWhenMigrating: true,
	})
	if err != nil {
		return
	} else {
		sqlDB, _ := Tools.DB.DB()
		sqlDB.SetMaxOpenConns(Conf.MySQLConfig.MaxOpenConns)
		sqlDB.SetMaxIdleConns(Conf.MySQLConfig.MaxIdleConns)
	}
	return
}

func ViperInit() error {
	viper.SetConfigFile("./config.yaml")
	viper.WatchConfig()
	viper.OnConfigChange(func(in fsnotify.Event) {
		fmt.Println("修改了配置文件...")
		viper.Unmarshal(&Conf)
	})
	err := viper.ReadInConfig()
	if err != nil {
		fmt.Errorf("readconfig failed,err: %v", err)
		return err
	}
	err = viper.Unmarshal(&Conf)
	if err != nil {
		fmt.Errorf("unmarshal to Conf failed, err: %v", err)
		return err
	}
	return err
}

func LoggerInit() (err error) {
	writeSyncer := getLogWriter(Conf.LogConfig.Filename, Conf.LogConfig.MaxSize, Conf.LogConfig.MaxBackups, Conf.LogConfig.MaxAge)
	encoder := getEncoder()
	var l = new(zapcore.Level)
	err = l.UnmarshalText([]byte(Conf.LogConfig.Level))
	if err != nil {
		return
	}
	var core zapcore.Core
	if Conf.ProjectConfig.Mode == "dev" {
		consoleEncoder := zapcore.NewConsoleEncoder(zap.NewDevelopmentEncoderConfig())
		core = zapcore.NewTee(
			zapcore.NewCore(encoder, writeSyncer, l),
			zapcore.NewCore(consoleEncoder, zapcore.Lock(os.Stdout), zapcore.DebugLevel),
		)
	} else {
		core = zapcore.NewCore(encoder, writeSyncer, l)
	}

	Tools.LG = zap.New(core, zap.AddCaller())
	zap.ReplaceGlobals(Tools.LG)
	zap.L().Info("init logger success")
	return

}

func getEncoder() zapcore.Encoder {
	encoderConfig := zap.NewProductionEncoderConfig()
	encoderConfig.EncodeTime = zapcore.ISO8601TimeEncoder
	encoderConfig.TimeKey = "time"
	encoderConfig.EncodeLevel = zapcore.CapitalLevelEncoder
	encoderConfig.EncodeDuration = zapcore.SecondsDurationEncoder
	encoderConfig.EncodeCaller = zapcore.ShortCallerEncoder
	return zapcore.NewJSONEncoder(encoderConfig)
}

func getLogWriter(filename string, maxSize, maxBackup, maxAge int) zapcore.WriteSyncer {
	lumberJackLogger := &lumberjack.Logger{
		Filename:   filename,
		MaxSize:    maxSize,
		MaxBackups: maxBackup,
		MaxAge:     maxAge,
	}
	return zapcore.AddSync(lumberJackLogger)
}

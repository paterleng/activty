package pkg

import (
	"fmt"
	"sync"
	"time"
)

const (
	// 64位ID中的时间戳部分占用的位数
	TimestampBits = 41
	// 支持的最大时间戳数量
	MaxTimestamp = -1 ^ (1 << TimestampBits)
	// 起始时间戳（2020-01-01）
	StartTimestamp = 1577836800000

	// 64位ID中的数据中心ID部分占用的位数
	DatacenterIDBits  = 5
	MaxDatacenterID   = -1 ^ (1 << DatacenterIDBits)
	DatacenterIDShift = TimestampBits

	// 64位ID中的工作机器ID部分占用的位数
	WorkerIDBits  = 5
	MaxWorkerID   = -1 ^ (1 << WorkerIDBits)
	WorkerIDShift = TimestampBits + DatacenterIDBits

	// 64位ID中的序列号部分占用的位数
	SequenceBits  = 12
	MaxSequence   = -1 ^ (1 << SequenceBits)
	SequenceMask  = MaxSequence
	SequenceShift = TimestampBits + DatacenterIDBits + WorkerIDBits
)

// Snowflake 结构体
type Snowflake struct {
	datacenterID  int64
	workerID      int64
	sequence      int64
	lastTimestamp int64
	mu            sync.Mutex
}

// NewSnowflake 创建一个新的Snowflake实例
func NewSnowflake(datacenterID int64, workerID int64) *Snowflake {
	return &Snowflake{
		datacenterID:  datacenterID,
		workerID:      workerID,
		sequence:      0,
		lastTimestamp: -1,
	}
}

// GenerateID 生成一个唯一的ID
func (s *Snowflake) GenerateID() int64 {
	s.mu.Lock()
	defer s.mu.Unlock()

	currentTimestamp := time.Now().UnixMilli()

	// 如果当前时间小于上一次ID生成的时间戳，说明系统时钟回退过，这时可以拒绝生成ID或者做些等待处理
	if currentTimestamp < s.lastTimestamp {
		panic("Clock moved backwards. Refusing to generate id for " + fmt.Sprintf("%d", s.lastTimestamp-currentTimestamp) + " milliseconds")
	}

	// 如果是同一时间生成的，则进行毫秒内序列
	if currentTimestamp == s.lastTimestamp {
		s.sequence = (s.sequence + 1) & SequenceMask
		if s.sequence < 0 {
			// 阻塞到下一个毫秒, 获得新的时间戳
			currentTimestamp = s.waitUntilNextTime(s.lastTimestamp)
		}
	} else {
		// 时间戳改变，毫秒内序列重置
		s.sequence = 0
	}

	// 上次生成ID的时间截
	s.lastTimestamp = currentTimestamp

	// 移位并通过或运算拼到一起组成64位的ID
	return (currentTimestamp-StartTimestamp)<<TimestampBits |
		(s.datacenterID << DatacenterIDShift) |
		(s.workerID << WorkerIDShift) |
		s.sequence
}

// 阻塞到下一个毫秒，直到获得新的时间戳
func (s *Snowflake) waitUntilNextTime(lastTimestamp int64) int64 {
	currentTimestamp := time.Now().UnixMilli()
	for currentTimestamp <= lastTimestamp {
		currentTimestamp = time.Now().UnixMilli()
	}
	return currentTimestamp
}

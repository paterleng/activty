package model

type AddShield struct {
	ShieldAmount int64 `json:"shield_amount"` //数量
	GridId       int   `json:"grid_id"`       //格子id
}

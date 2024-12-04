package pkg

import (
	"errors"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

var mySecret = []byte("tidegroups")

type MyCustomClaims struct {
	UserID string `json:"user_id"`
	jwt.RegisteredClaims
}

// GenToken 生成JWT
func GenToken(userID string) (string, error) {
	claims := MyCustomClaims{
		userID,
		jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(7 * time.Hour * 24)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			NotBefore: jwt.NewNumericDate(time.Now()),
			Issuer:    "tidegroups",
			Subject:   "myapp",
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(mySecret)
}

// ParseToken 解析JWT
func ParseToken(tokenstring string) (*MyCustomClaims, error) {
	var mc = new(MyCustomClaims)
	token, err := jwt.ParseWithClaims(tokenstring, mc, func(token *jwt.Token) (i interface{}, err error) {
		return mySecret, nil
	})
	if err != nil {
		return nil, err
	}
	if token.Valid {
		return mc, nil
	}
	return nil, errors.New("invalid token")
}

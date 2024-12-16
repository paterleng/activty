package internal

import (
	"context"
	"github.com/blocto/solana-go-sdk/client"
	"github.com/blocto/solana-go-sdk/rpc"
)

func GetTransactionInfo(txId string) (*client.Transaction, error) {
	c := client.NewClient(rpc.DevnetRPCEndpoint)
	transaction, err := c.GetTransaction(context.TODO(), txId)
	return transaction, err
}

// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.

package backend

import (
	"github.com/ava-labs/avalanchego/utils/set"
	"github.com/ava-labs/hypersdk/fees"
)

type Alert struct {
	Type    string `json:"type"`
	Content string `json:"content"`
}

type AddressInfo struct {
	Name    string `json:"name"`
	Address string `json:"address"`
	AddrStr string `json:"addrStr"`
}

type TransactionInfo struct {
	ID        string `json:"id"`
	Size      string `json:"size"`
	Timestamp int64  `json:"timestamp"`
	Actor     string `json:"actor"`
	Success   bool   `json:"success"`
	Type      string `json:"type"`
	Units     string `json:"units"`
	Fee       string `json:"fee"`
	Summary   string `json:"summary"`
}

type TimeStat struct {
	Timestamp    int64
	Transactions int
	Accounts     set.Set[string]
	Prices       fees.Dimensions
}

type BlockInfo struct {
	ID        string `json:"id"`
	Timestamp int64  `json:"timestamp"`
	Height    uint64 `json:"height"`
	Size      string `json:"size"`
	TPS       string `json:"tps"`
	Consumed  string `json:"consumed"`
	Prices    string `json:"prices"`
	StateRoot string `json:"state_root"`
	Txs       int    `json:"txs"`
	FailTxs   int    `json:"fail_txs"`
	Latency   int64  `json:"latency"`
}

type GenericInfo struct {
	Timestamp int64  `json:"timestamp"`
	Count     uint64 `json:"count"`
	Category  string `json:"category"`
}

type AssetInfo struct {
	ID        string `json:"id"`
	Symbol    string `json:"symbol"`
	Decimals  int    `json:"decimals"`
	Metadata  string `json:"metadata"`
	Supply    string `json:"supply"`
	Creator   string `json:"creator"`
	StrSymbol string `json:"strSymbol"`
}

type BalanceInfo struct {
	ID  string `json:"id"`
	Str string `json:"str"`
	Bal string `json:"bal"`
	Has bool   `json:"has"`
}

type Transactions struct {
	Alerts  []*Alert           `json:"alerts"`
	TxInfos []*TransactionInfo `json:"tx_infos"`
}

type FaucetSearchInfo struct {
	FaucetAddress string `json:"faucet_address"`
	Salt          string `json:"salt"`
	Difficulty    uint16 `json:"difficulty"`
	Solution      string `json:"solution"`
	Attempts      uint64 `json:"attempts"`
	Elapsed       string `json:"elapsed"`
	Amount        string `json:"amount"`
	TxID          string `json:"tx_id"`
	Err           string `json:"err"`
}

type FaucetSolutions struct {
	Alerts        []*Alert            `json:"alerts"`
	CurrentSearch *FaucetSearchInfo   `json:"current_search"`
	PastSearches  []*FaucetSearchInfo `json:"past_searches"`
}

type FeedInfo struct {
	Address string `json:"address"`
	Fee     string `json:"fee"`
}

type FeedObject struct {
	ID        string    `json:"id"`
	SubnetID  string    `json:"subnet_id"`
	ChainID   string    `json:"chain_id"`
	Address   string    `json:"address"`
	Timestamp int64     `json:"timestamp"`
	Fee       string    `json:"fee"`
	Message   string    `json:"message"`
	URL       string    `json:"url"`
	URLMeta   *HTMLMeta `json:"url_meta"`
}

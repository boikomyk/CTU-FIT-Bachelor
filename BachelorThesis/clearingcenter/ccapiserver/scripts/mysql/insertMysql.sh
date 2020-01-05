#!/bin/bash
echo "- In case of error message => execute dropAndUpdateForceSchema.sh."
echo "  Your Clearing Center team."
echo -e "\n"
# connect to remote database named 'clearingCenterDev'
mysql --host=127.0.0.1 --user=root --password=root clearingCenterDev << EOF

# clear table's content
DELETE FROM system_wallet;
ALTER TABLE system_wallet AUTO_INCREMENT = 1;
DELETE FROM strategy;
DELETE FROM long_trade_algorithm;
ALTER TABLE long_trade_algorithm AUTO_INCREMENT = 1;
DELETE FROM strategy_statistics;
ALTER TABLE strategy_statistics AUTO_INCREMENT = 1;
DELETE FROM market;
ALTER TABLE market AUTO_INCREMENT = 1;
DELETE FROM exchange;
ALTER TABLE exchange AUTO_INCREMENT = 1;
DELETE FROM market_pair;
ALTER TABLE market_pair AUTO_INCREMENT = 1;
DELETE FROM indicator;
ALTER TABLE indicator AUTO_INCREMENT = 1;
DELETE FROM strategy_indicator;
ALTER TABLE strategy_indicator AUTO_INCREMENT = 1;
DELETE FROM user_wallet;
ALTER TABLE user_wallet AUTO_INCREMENT = 1;
DELETE FROM user;
ALTER TABLE user AUTO_INCREMENT = 1;
DELETE FROM candle;
ALTER TABLE candle AUTO_INCREMENT = 1;
DELETE FROM crypto_signal;
ALTER TABLE crypto_signal AUTO_INCREMENT = 1;

#____________________________________________________________USER_WALLET_SCOPE____________________________________________________________\/
insert into user_wallet (frozen_balance, total_balance, created_at, updated_at) values(104.0540,
	378.2376, STR_TO_DATE('03-22-2019 18:14:00','%m-%d-%Y %H:%i:%s'), STR_TO_DATE('03-22-2019 18:20:43','%m-%d-%Y %H:%i:%s'));
insert into user_wallet (frozen_balance, total_balance, created_at, updated_at) values(3000,
	4780.2376, STR_TO_DATE('04-01-2019 18:16:00','%m-%d-%Y %H:%i:%s'), STR_TO_DATE('04-01-2019 18:16:00','%m-%d-%Y %H:%i:%s'));

#____________________________________________________________USER_SCOPE____________________________________________________________/\

#____________________________________________________________USER_SCOPE____________________________________________________________\/
insert into user (wallet_id, email, display_name, role, status, password, created_at, updated_at, last_login_at) values(1, 'clearingcenter@gmail.com',
	'clearingcenter', 1, 1, 'long_hashed_passwd', STR_TO_DATE('03-22-2019 18:14:00','%m-%d-%Y %H:%i:%s'),
	STR_TO_DATE('03-22-2019 18:15:00','%m-%d-%Y %H:%i:%s'),STR_TO_DATE('03-22-2019 18:15:00','%m-%d-%Y %H:%i:%s'));

insert into user (wallet_id, email, display_name, role, status, password, created_at, updated_at, last_login_at) values(2, 'testuser@gmail.com',
	'signalTest', 1, 1, 'long_hashed_passwd_test', STR_TO_DATE('04-01-2019 18:14:00','%m-%d-%Y %H:%i:%s'),
	STR_TO_DATE('04-01-2019 18:15:00','%m-%d-%Y %H:%i:%s'),STR_TO_DATE('04-01-2019 18:15:00','%m-%d-%Y %H:%i:%s'));

#____________________________________________________________USER_SCOPE____________________________________________________________/\

#____________________________________________________________INDICATORS_SCOPE____________________________________________________________\/
# inset indicators:
insert into indicator (name, abbreviation) values('Weighted Moving Average','WMA');
insert into indicator (name, abbreviation) values('Volume-Weighted Moving Average','VWMA');
insert into indicator (name, abbreviation) values('Stochastic RSI','Stoch RSI');
insert into indicator (name, abbreviation) values('Standard Deviation','STDEV');
insert into indicator (name, abbreviation) values('Simple Moving Average','SMA');
insert into indicator (name, abbreviation) values('Relative Strength Index','RSI');
insert into indicator (name, abbreviation) values('Range','RNG');
insert into indicator (name, abbreviation) values('Momentum','MOM');
insert into indicator (name, abbreviation) values('Minimum','MIN');
insert into indicator (name, abbreviation) values('Maximum','MAX');
insert into indicator (name, abbreviation) values('Moving Average Convergence Divergence','MACD');
insert into indicator (name, abbreviation) values('Exponential Moving Average','EMA');
insert into indicator (name, abbreviation) values('Bollinger Bands','BB');
insert into indicator (name, abbreviation) values('Average True Range','ATR');
insert into indicator (name, abbreviation) values('Average Directional Index','ADX');
insert into indicator (name, abbreviation) values('Accumulation/Distribution Line','ADL');
#________________________________________________________________________________________________________________________________________/\

#____________________________________________________________MARKET_SCOPE____________________________________________________________\/
# inset market_pairs:
insert into market_pair (currency, coin) values('BTC','ETH');	#1
insert into market_pair (currency, coin) values('USD','ETH'); 	#2
insert into market_pair (currency, coin) values('USD','BTH');	#3
insert into market_pair (currency, coin) values('BTC','LTC');	#4
insert into market_pair (currency, coin) values('USDT','BTC');	#5
insert into market_pair (currency, coin) values('BTC','BNB');	#6

# insert exchange:
insert into exchange (name) values('Binance');	#1
insert into exchange (name) values('Poloniex'); #2

# insert market with previous relations:
insert into market (exchange_id, market_pair_id) values(1,1); #Binance: ETH/BTC
insert into market (exchange_id, market_pair_id) values(1,2); #Binance: ETH/USD
insert into market (exchange_id, market_pair_id) values(1,4); #Binance: LTC/BTC
insert into market (exchange_id, market_pair_id) values(2,1); #Poloniex: ETH/BTC
insert into market (exchange_id, market_pair_id) values(2,1); #Poloniex: BTC/USDT
#____________________________________________________________________________________________________________________________________/\

#____________________________________________________________SYSTEM_WALLET_SCOPE_____________________________________________________\/
# insert system_wallet: (1 - Freeze; 2 - Income)
insert into system_wallet (type, total_balance) values(1, 0);
insert into system_wallet (type, total_balance) values(2, 1000);
#____________________________________________________________________________________________________________________________________/\

#_________________________________________________________LONG_TRADE_ALGORITHM_SCOPE__________________________________________________\/
insert into long_trade_algorithm (quated_amount, base_spending, base_purchased, total_base_spending, total_base_purchased) values(
	0.0, 0.0, 0.0, 0.0, 0.0);
insert into long_trade_algorithm (quated_amount, base_spending, base_purchased, total_base_spending, total_base_purchased) values(
	0.0, 0.0, 0.0, 0.0, 0.0);
#____________________________________________________________________________________________________________________________________/\

#_________________________________________________________STRATEGY_STATISTICS_SCOPE__________________________________________________\/
insert into strategy_statistics (long_trade_algorithm_id, strategy_balance, total_performance, number_of_trades, profit_trades, loss_trades) values(
	1, 10000.0, 0.0, 0, 0, 0);
insert into strategy_statistics (long_trade_algorithm_id, strategy_balance, total_performance, number_of_trades, profit_trades, loss_trades) values(
	2, 10000.0, 0.0, 0, 0, 0);
#____________________________________________________________________________________________________________________________________/\

#____________________________________________________________STRATEGY_SCOPE____________________________________________________________\/
# insert strategy: (required existed user with id 1)

insert into strategy (id, market_id, creator_id, statistics_id, name, created_at, type, about, maker_fee, api_key) values(
	'd4b289b4-e2e0-4869-b3a8-37309830ed14', 1, 1, 1, 'Test_Strategy', STR_TO_DATE('03-22-2019 19:15:01','%m-%d-%Y %H:%i:%s'), 'Single-Market Strategy (SMS)',
	'Test description to strategy. This field must contain all required data, rules, instructions and related description.
	 And other things that developer decide to add... With best wishes, team of Clearing Center.',
	 1.2, 'test_api_key_for_developer');

# inset strategy_indicator:
insert into strategy_indicator (indicator_id, strategy_id) values(3,'d4b289b4-e2e0-4869-b3a8-37309830ed14');
insert into strategy_indicator (indicator_id, strategy_id) values(6,'d4b289b4-e2e0-4869-b3a8-37309830ed14');

insert into strategy (id, market_id, creator_id, statistics_id, name, created_at, type, about, maker_fee, api_key) values(
	'd4b289b4-e2e0-4869-ffff-37309830ed14', 1, 2, 2, 'Signal_Test_Strategy', STR_TO_DATE('04-01-2019 18:18:00','%m-%d-%Y %H:%i:%s'), 'Single-Market Strategy (SMS)',
	'Testing data for signals drawing',
	 1.2, 'api_to_test_signals');

# inset strategy_indicator:
insert into strategy_indicator (indicator_id, strategy_id) values(3,'d4b289b4-e2e0-4869-ffff-37309830ed14');
insert into strategy_indicator (indicator_id, strategy_id) values(6,'d4b289b4-e2e0-4869-ffff-37309830ed14');

#__________________________________________________________Signal_Test_Scope__________________________________________________________
# inset signals_and_candles: 
# _________________________________________________________
# |			 TYPE 		  |             ACTION 			  |
# |_______________________|_______________________________|
# |SHORT      |-1         | FLAT          | 0			  |
# |___________|___________|_______________|_______________|
# |LONG       | 1         | SELL          |-1			  |
# |___________|___________|_______________|_______________|
# |		      |           | BUY           | 1			  |
# |___________|___________|_______________|_______________|

# 1)
insert into candle (timestamp, related_strategy_id, open, high, low, close, volume, volume_quote) values(
	STR_TO_DATE('04-01-2019 00:00:00','%m-%d-%Y %H:%i:%s'),
	'd4b289b4-e2e0-4869-ffff-37309830ed14',
	0.03544,
	0.03561,
	0.03544,
	0.03556,
	82.73,
	2.94);
insert into crypto_signal (related_strategy_id, timestamp, buy_start, buy_end, type, action, ask, state) values(
	'd4b289b4-e2e0-4869-ffff-37309830ed14',
	STR_TO_DATE('04-01-2019 00:00:00','%m-%d-%Y %H:%i:%s'),
	0.00412925 ,
	0.00417075,
	-1,
	0,
	0.00415000,
	0);
# 2)
insert into candle (timestamp, related_strategy_id, open, high, low, close, volume, volume_quote) values(
	STR_TO_DATE('04-02-2019 00:00:00','%m-%d-%Y %H:%i:%s'),
	'd4b289b4-e2e0-4869-ffff-37309830ed14',
	0.03549,
	0.03554,
	0.03540,
	0.03544,
	448.10,
	15.91);
insert into crypto_signal (related_strategy_id, timestamp, buy_start, buy_end, type, action, ask, state) values(
	'd4b289b4-e2e0-4869-ffff-37309830ed14',
	STR_TO_DATE('04-02-2019 00:00:00','%m-%d-%Y %H:%i:%s'),
	0.00001501,
	0.00001517,
	1,
	1,
	0.00001509,
	0);
# 3)
insert into candle (timestamp, related_strategy_id, open, high, low, close, volume, volume_quote) values(
	STR_TO_DATE('04-03-2019 00:00:00','%m-%d-%Y %H:%i:%s'),
	'd4b289b4-e2e0-4869-ffff-37309830ed14',
	0.03551,
	0.03560,
	0.03549,
	0.03549,
	129.55,
	4.61);
insert into crypto_signal (related_strategy_id, timestamp, buy_start, buy_end, type, action, ask, state) values(
	'd4b289b4-e2e0-4869-ffff-37309830ed14',
	STR_TO_DATE('04-03-2019 00:00:00','%m-%d-%Y %H:%i:%s'),
	0.00004815,
	0.00004863,
	-1,
	-1,
	0.00004839,
	0);
# 4)
insert into candle (timestamp, related_strategy_id, open, high, low, close, volume, volume_quote) values(
	STR_TO_DATE('04-04-2019 00:00:00','%m-%d-%Y %H:%i:%s'),
	'd4b289b4-e2e0-4869-ffff-37309830ed14',
	0.03558,
	0.03559,
	0.03537,
	0.03551,
	214.61,
	7.62);
insert into crypto_signal (related_strategy_id, timestamp, buy_start, buy_end, type, action, ask, state) values(
	'd4b289b4-e2e0-4869-ffff-37309830ed14',
	STR_TO_DATE('04-04-2019 00:00:00','%m-%d-%Y %H:%i:%s'),
	STR_TO_DATE('04-04-2019 00:00:00','%m-%d-%Y %H:%i:%s'),
	STR_TO_DATE('04-04-2019 23:59:59','%m-%d-%Y %H:%i:%s'),
	-1,
	1,
	4.86,
	0);
# 5)
insert into candle (timestamp, related_strategy_id, open, high, low, close, volume, volume_quote) values(
	STR_TO_DATE('04-05-2019 00:00:00','%m-%d-%Y %H:%i:%s'),
	'd4b289b4-e2e0-4869-ffff-37309830ed14',
	0.03562,
	0.03590,
	0.03537,
	0.03558,
	597.84,
	0.00150410);
insert into crypto_signal (related_strategy_id, timestamp, buy_start, buy_end, type, action, ask, state) values(
	'd4b289b4-e2e0-4869-ffff-37309830ed14',
	STR_TO_DATE('04-05-2019 00:00:00','%m-%d-%Y %H:%i:%s'),
	0.00149658,
	0.00151162,
	1,
	0,
	5.77,
	0);
# 6)
insert into candle (timestamp, related_strategy_id, open, high, low, close, volume, volume_quote) values(
	STR_TO_DATE('04-06-2019 00:00:00','%m-%d-%Y %H:%i:%s'),
	'd4b289b4-e2e0-4869-ffff-37309830ed14',
	0.03548,
	0.03568,
	0.03540,
	0.03553,
	314.80,
	7.88);
insert into crypto_signal (related_strategy_id, timestamp, buy_start, buy_end, type, action, ask, state) values(
	'd4b289b4-e2e0-4869-ffff-37309830ed14',
	STR_TO_DATE('04-06-2019 00:00:00','%m-%d-%Y %H:%i:%s'),
	0.00907241,
	0.00916359,
	1,
	-1,
	0.00911800,
	0);
# 7)
insert into candle (timestamp, related_strategy_id, open, high, low, close, volume, volume_quote) values(
	STR_TO_DATE('04-07-2019 00:00:00','%m-%d-%Y %H:%i:%s'),
	'd4b289b4-e2e0-4869-ffff-37309830ed14',
	0.03530,
	0.03550,
	0.03537,
	0.03584,
	570.33,
	20.06);
insert into crypto_signal (related_strategy_id, timestamp, buy_start, buy_end, type, action, ask, state) values(
	'd4b289b4-e2e0-4869-ffff-37309830ed14',
	STR_TO_DATE('04-07-2019 00:00:00','%m-%d-%Y %H:%i:%s'),
	0.00029223,
	0.00029517,
	-1,
	-1,
	0.00029370,
	0);
#________________________________________________________________________________________________________________________________________/\
# end statement
EOF


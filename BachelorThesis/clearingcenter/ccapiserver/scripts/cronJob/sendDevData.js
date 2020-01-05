#! /usr/bin/env node

const fs = require('fs');
const moment = require('moment');
const request = require('sync-request');
const cron = require('node-cron');
const chance = require('chance').Chance();

const file_signal = './data/signal.json'
const file_candle = './data/candle.json'

const signal_time_shift_mins = 30
const candle_time_shift_mins = 10;

const API_KEY = process.argv.slice(2)[0] ? process.argv.slice(2)[0] : 'babushkinandrewbabushkinandrew01';

const url_clearingcenter = 'http://clearingcenter.server'
const url_signals = url_clearingcenter + `/api/signals/${API_KEY}/dev`;
const url_candles = url_clearingcenter + `/api/candles/${API_KEY}/dev`;

const types_signal = ["LONG", "SHORT"];
const actions_signal = ["SELL", "FLAT", "BUY"];

const min_price_candle = 3525;
const max_price_candle = 3590;
const floating_part_candle = 100000;

const min_volume_candle = 827;
const max_volume_candle = 57033;
const floating_volume_candle = 100;

const min_volume_quate_candle = 294;
const max_volume_quate_candle = 2006;
const floating_volume_quate_candle = 100;

function getRandomInteger(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomFloat(min, max, floatingPart) {
	return getRandomInteger(min, max) / floatingPart;
}
//__________________________________________________________________SIGNAL___SCOPE__________________________________________________________________\/
function proceedSignal(data_signal) { 
	var previous_signal_timestamp = new Date(data_signal.signal.timestamp)

	//Set new timestamp
	new_signal_timestamp = moment(previous_signal_timestamp).add(signal_time_shift_mins, 'm').toDate()
	//Manipulate data
	data_signal.signal.timestamp = new_signal_timestamp.toISOString()
	data_signal.signal.type = types_signal[getRandomInteger(0,1)]
	data_signal.signal.action = actions_signal[getRandomInteger(0,2)]

	return new_signal_timestamp
} 

function setSignalAskPriceAndUpdateFileData(data_signal, askPrice) { 
	data_signal.signal.ask = askPrice;
	data_signal.signal.buy_start = (askPrice - parseFloat(getRandomInteger(1,4)/100000)).toFixed(5);
	data_signal.signal.buy_end = (parseFloat(askPrice) + parseFloat(getRandomInteger(1,4)/100000)).toFixed(5);
	//Write to file
	fs.writeFileSync(file_signal, JSON.stringify(data_signal, null, 2));

	//Output data
	console.log(JSON.stringify(data_signal, null, 2));
} 
//__________________________________________________________________SIGNAL___SCOPE__________________________________________________________________/\


//__________________________________________________________________CANDLE___SCOPE__________________________________________________________________\/
function proceedCandle(data_candle, candle_timestamp_start, isFirstCandleInCurrentFlowIter) {
	if (isFirstCandleInCurrentFlowIter)
	{
		candle_time_shift_mins_adopted = 0
	} else {
		candle_time_shift_mins_adopted = candle_time_shift_mins
	}
	//Set new timestamp
	new_candle_timestamp = moment(candle_timestamp_start).add(candle_time_shift_mins_adopted, 'm').toDate()
	//Manipulate data
	data_candle.candle.timestamp = new_candle_timestamp.toISOString()

	// previous CLOSE value 
	previous_close  = data_candle.candle.close

	// set new OPEN value
	open_value  	= previous_close

	// get LOW and HIGH values
	low_value 	= getRandomFloat(min_price_candle, open_value * floating_part_candle, floating_part_candle)
	high_value 	= getRandomFloat(open_value * floating_part_candle, max_price_candle, floating_part_candle)

	// align new values
	if (Math.abs(high_value - low_value) < 0.00010)
	{
		diff_high = high_value - open_value
		diff_low  = open_value - low_value

		diff_value = getRandomFloat(10, 25, floating_part_candle)
		if (getRandomInteger(1,21) > 10)
		{
			high_value += diff_value
		} else {
			low_value  -= diff_value
		}
	}

	// get CLOSE value
	close_value = getRandomFloat(low_value * floating_part_candle, high_value * floating_part_candle, floating_part_candle)

	data_candle.candle.open     = open_value;
	data_candle.candle.low 		= low_value.toFixed(5);
	data_candle.candle.high 	= high_value.toFixed(5);
	data_candle.candle.close 	= close_value.toFixed(5);

	data_candle.candle.volume = getRandomFloat(min_volume_candle, max_volume_candle, floating_volume_candle)
	data_candle.candle.volumeQuote = getRandomFloat(min_volume_quate_candle, max_volume_quate_candle, floating_volume_quate_candle)

	//Write to file
	fs.writeFileSync(file_candle, JSON.stringify(data_candle, null, 2));

	//Output data
	console.log(JSON.stringify(data_candle, null, 2));

	return new_candle_timestamp
}
//__________________________________________________________________CANDLE___SCOPE__________________________________________________________________/\

function makePostRequestSignal(data_signal) {
	var res = request('POST', url_signals, {
  		json: data_signal,
	});
}


function makePostRequestCandle(data_candle) 
{
	var res = request('POST', url_candles, {
  		json: data_candle,
	});
}

function startJob()
{
	var data_signal = require(file_signal);
	var data_candle = require(file_candle);
	var firstSignalIsWaiting = true;

	//ProvideIncrementalChanges Signal
	candle_timestamp_start = proceedSignal(data_signal);

	// prepare and send 3 candles
	var candle_num = 0;
	
	for (candle_num = 0; candle_num < 3; candle_num++) {
		
		//ProvideIncrementalChanges Candle
  		candle_timestamp_start = proceedCandle(data_candle, candle_timestamp_start, !candle_num);
  		
  		if (firstSignalIsWaiting){
  			//set askPrice of new Signal
  			setSignalAskPriceAndUpdateFileData(data_signal, data_candle.candle.close)
  			//Make Http POST Request Signal
   			makePostRequestSignal(data_signal, data_candle)
   			// signal was successfully sent
   			firstSignalIsWaiting = false;
  		}

  		//Make Http POST Request Candle
  		makePostRequestCandle(data_candle)
	}
}

// uncomment this and comment cron.schedule line, in case you want to send data manually
//startJob();

cron.schedule('* * * * *', function(){
  startJob();
});




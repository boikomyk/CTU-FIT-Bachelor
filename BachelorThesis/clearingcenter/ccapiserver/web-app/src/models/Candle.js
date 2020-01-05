class Candle extends Object {
  constructor(
    timestamp = '',
    open = 0,
    high = 0,
    low = 0,
    close = 0,
    volume = 0,
    action = '',
    askPrice = 0
  ) {
    super();
    this.date = timestamp === '' ? new Date() : new Date(timestamp);
    this.open = open;
    this.high = high;
    this.low = low;
    this.close = close;
    this.volume = volume;
    this.action = action;
    this.askPrice = askPrice;
  }

  static fromJSON(json) {
    return new Candle(
      json.timestamp,
      json.open,
      json.high,
      json.low,
      json.close,
      json.volume,
      json.signal_prediction,
      json.signal_ask_price
    );
  }
}
export default Candle;

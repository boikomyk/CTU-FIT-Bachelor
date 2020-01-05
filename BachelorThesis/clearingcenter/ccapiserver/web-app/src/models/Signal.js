class Signal extends Object {
  constructor(
    timestamp = '',
    market = '',
    action = '',
    strategyId = '',
    strategyName = ''
  ) {
    super();
    this.timestamp = timestamp;
    this.market = market;
    this.action = action;
    this.strategyId = strategyId;
    this.strategyName = strategyName;
  }

  static fromJSON(json) {
    const signal = Object.create(Signal.prototype);
    return Object.assign(signal, json);
  }

  toArray() {
    return [this.timestamp, this.market, this.action];
  }
  get strategyId() {
    return this._strategyId;
  }

  set strategyId(value) {
    this._strategyId = value;
  }
  get strategyName() {
    return this._strategyName;
  }

  set strategyName(value) {
    this._strategyName = value;
  }
  get timestamp() {
    return this._timestamp;
  }

  set timestamp(value) {
    this._timestamp = value;
  }

  get market() {
    return this._market;
  }

  set market(value) {
    this._market = value;
  }

  get action() {
    return this._action;
  }

  set action(value) {
    this._action = value;
  }
}
export default Signal;

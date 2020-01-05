import React from 'react';

class Strategy extends Object {
  get subscribe() {
    return this._subscribe;
  }

  set subscribe(value) {
    this._subscribe = value;
  }

  constructor(
    API = '',
    about = '',
    subscribe = false,
    author = '',
    fee = '',
    indicators = [],
    market = '',
    name = '',
    owns = false,
    following = false,
    statistics = {},
    type = '',
    id = ''
  ) {
    super();
    this.API = API;
    this.about = about;
    this.author = author;
    this.fee = fee;
    this.indicators = indicators;
    this.market = market;
    this.name = name;
    this.owns = owns;
    this.statistics = statistics;
    this.type = type;
    this.signals = [];
    this.following = following;
    this.id = id;
    this.subscribe = subscribe;
  }

  static fromJSON(json) {
    const strategy = Object.create(Strategy.prototype);
    return Object.assign(strategy, json, {
      signals: []
    });
  }
  get id() {
    return this._id;
  }

  set id(value) {
    this._id = value;
  }

  get following() {
    return this._following;
  }

  set following(value) {
    this._following = value;
  }

  get signals() {
    return this._signals;
  }

  set signals(value) {
    this._signals = value;
  }

  get API() {
    return this._API;
  }

  set API(value) {
    this._API = value;
  }

  get about() {
    return this._about;
  }

  set about(value) {
    this._about = value;
  }

  get author() {
    return this._author;
  }

  set author(value) {
    this._author = value;
  }

  get fee() {
    return this._fee;
  }

  set fee(value) {
    this._fee = value;
  }

  get indicators() {
    return this._indicators;
  }

  set indicators(value) {
    this._indicators = value;
  }

  get market() {
    return this._market;
  }

  set market(value) {
    this._market = value;
  }

  get name() {
    return this._name;
  }

  set name(value) {
    this._name = value;
  }

  get owns() {
    return this._owns;
  }

  set owns(value) {
    this._owns = value;
  }

  get statistics() {
    return this._statistics;
  }

  set statistics(value) {
    this._statistics = {
      Performance: {
        'Initial capital': value.initialCapital,
        'Strategy balance': value.strategyBalance,
        'Number of trades': value.numberOfTrades,
        'Profit trades': value.profitTrades,
        'Loss trades': value.lossTrades,
        'Total performance': value.totalPerformance
      },
      Time: {
        'Time in market': value.timeInMarket
      }
    };
  }

  get type() {
    return this._type;
  }

  set type(value) {
    this._type = value;
  }
}
export default Strategy;

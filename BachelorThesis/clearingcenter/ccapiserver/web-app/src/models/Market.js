class Market extends Object {
  constructor(id = '', name = '') {
    super();
    this._id = id;
    this._name = name;
  }

  static fromJSON(json) {
    return new Market(json.id, json.name);
  }
  get id() {
    return this._id;
  }

  set id(value) {
    this._id = value;
  }

  get name() {
    return this._name;
  }

  set name(value) {
    this._name = value;
  }
}
export default Market;

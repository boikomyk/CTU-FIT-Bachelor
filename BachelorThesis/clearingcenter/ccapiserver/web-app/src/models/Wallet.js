class Wallet extends Object {
  constructor(availableBalance = 0, frozenBalance = 0, transactions = []) {
    super();
    this._availableBalance = availableBalance;
    this._frozenBalance = frozenBalance;
    this._transactions = transactions;
  }

  static fromJSON(json) {
    const transactions = [];
    json.transactions.forEach(function(transaction) {
      transactions.push({
        id: transaction.id,
        action: transaction.action,
        strategyId: transaction.strategyId,
        strategyName: transaction.strategyName,
        amount: parseFloat(transaction.amount)
      });
    });
    return new Wallet(
      parseFloat(json.availableBalance),
      parseFloat(json.frozenBalance),
      transactions
    );
  }

  get availableBalance() {
    return this._availableBalance;
  }

  set availableBalance(value) {
    this._availableBalance = value;
  }

  get frozenBalance() {
    return this._frozenBalance;
  }

  set frozenBalance(value) {
    this._frozenBalance = value;
  }

  get transactions() {
    return this._transactions;
  }

  set transactions(value) {
    this._transactions = value;
  }
}
export default Wallet;

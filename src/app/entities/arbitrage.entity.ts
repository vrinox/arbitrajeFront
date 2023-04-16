
import { AccountBalance, ArbitrageLog, CalculatedOrderData, IArbitrage, Order } from '../interfaces/arbitrage.interface';
import { ArbitrageStatusEnum } from '../enum/arbitrage.enum';
import { roundToPrecision } from '../utils/math.util';

export class Arbitrage implements IArbitrage {
  arbitrageId: string;
  realOrders: Order[] = [];
  calculatedOrders: CalculatedOrderData[] = [];
  symbols: string[];
  BalanceUpdates: { [order: string]: AccountBalance } = {};
  feeCurrency: string = 'BNB';
  status: ArbitrageStatusEnum = ArbitrageStatusEnum.INIT;
  reverseOrder: Order = {} as Order;
  minProfit: number;
  brokeragePerTransactionPercent: number;
  feesCoinPrice: number;
  createdAt: number = 0;
  finishAt: number = 0;
  log?: ArbitrageLog[] = [];

  constructor({
    arbitrageId,
    minProfit,
    brokeragePerTransactionPercent,
    feesCoinPrice,
    symbols
  }: {
    arbitrageId: string;
    minProfit: number;
    brokeragePerTransactionPercent: number;
    feesCoinPrice: number;
    symbols: string[];
  }) {
    this.arbitrageId = arbitrageId;
    this.minProfit = minProfit;
    this.brokeragePerTransactionPercent = brokeragePerTransactionPercent;
    this.feesCoinPrice = feesCoinPrice;
    this.symbols = symbols;
  }
  
  runSimulationAnalisys() {
    return {
      profit: this.getSimulateProfit(),
      tuchos: this.calculatedOrders.map((order: CalculatedOrderData) => {
        return { coin: order.symbol.split('/')[1], amount: order.tucho };
      })
    };
  }

  calculateRealProfit(): number {
    if (this.status !== ArbitrageStatusEnum.END) return 0
    const baseAsset = this.symbols[0].split('/')[1];
    const feesValue = this.calculateRealFees() * this.feesCoinPrice;
    return this.BalanceUpdates[ArbitrageStatusEnum.END][baseAsset] - this.BalanceUpdates[ArbitrageStatusEnum.INIT][baseAsset] - feesValue;
  }

  calculateRealFees(): number {
    if (this.status !== ArbitrageStatusEnum.END) return 0
    return this.BalanceUpdates[ArbitrageStatusEnum.INIT][this.feeCurrency] - this.BalanceUpdates[this.status][this.feeCurrency];
  }

  getSimulateProfit() {
    const { profit } = this.generateProfitVariables();
    return profit;
  }

  getSimulatedFee(){
    const initialInvestment = this.calculatedOrders[0].initial;
    const exchangeCommission: number = (initialInvestment * this.brokeragePerTransactionPercent / 100) * 3;

    return exchangeCommission / this.feesCoinPrice;
  }

  generateProfitVariables(){
    const initialInvestment = this.calculatedOrders[0].initial;
    const baseProfit = this.calculatedOrders[2].initial * this.calculatedOrders[2].price;
    const exchangeCommission: number =
      ((initialInvestment * this.brokeragePerTransactionPercent) / 100) * 3;
    const finalAmount = initialInvestment + this.minProfit + exchangeCommission;
    const profit = baseProfit - finalAmount;
    return {
      baseProfit: roundToPrecision(baseProfit, 4),
      exchangeCommission: roundToPrecision(exchangeCommission, 4), 
      profit: roundToPrecision(profit,2)
    };
  }

  getSimulateProfitReport() {
    const { baseProfit, exchangeCommission, profit } = this.generateProfitVariables();
    const initialInvestment = this.calculatedOrders[0].initial;
    const baseAsset = this.symbols[0].split('/')[1];
    //? con esto sacas el profit con los tuchos
    const firstOrder = initialInvestment / this.calculatedOrders[0].price;
    const secondOrder = firstOrder / this.calculatedOrders[1].price;
    const thirdOrder = roundToPrecision(secondOrder * this.calculatedOrders[2].price, 4);

    return `
                            REPORT:
                            
      [symbols]: ${this.symbols[0]}/${this.symbols[1]}/${this.symbols[2]}
      [initial]: ${initialInvestment}
      [baseProfit]: ${baseProfit}
      [commission]: ${exchangeCommission} ${baseAsset} / ${this.calculateSimulatedFees()} ${
      this.feeCurrency
    }
      [formula]: ${baseProfit} - (${initialInvestment} + ${
      this.minProfit
    } + ${exchangeCommission}) = ${profit}
      [profit]: ${profit}
      [profit*()tuchos]: ${thirdOrder}
    `;
  }

  calculateSimulatedFees() {
    const baseInvestment = this.calculatedOrders[0].initial;
    return roundToPrecision(
      (((baseInvestment / this.feesCoinPrice) * this.brokeragePerTransactionPercent) / 100) * 3
    ,6);
  }

  hasRealProfit(): boolean {
    return this.calculateRealProfit() > 0;
  }

  getCurrenciesInvolved() {
    const [symbol1, symbol2, symbol3] = this.symbols;
    const currenciesInvolved = [...symbol1.split('/'), symbol3.split('/')[0]];
    if (!currenciesInvolved.includes(this.feeCurrency)) currenciesInvolved.push(this.feeCurrency);
    return currenciesInvolved;
  }

  storeBalanceUpdates(accountBalance: { [asset: string]: number }) {
    const newBalance:any = {};
    this.getCurrenciesInvolved().forEach((coin: string) => {
      newBalance[coin] = accountBalance[coin] || 0;
    });
    this.BalanceUpdates[this.status] = newBalance;
  }

  nextStep(){
    const steps = Object.values(ArbitrageStatusEnum);
    this.status = steps[steps.indexOf(this.status) + 1];
    return this.status;
  }
}

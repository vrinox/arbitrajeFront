import { Arbitrage } from "../entities/arbitrage.entity";
import { ArbitrageStatusEnum } from "../enum/arbitrage.enum";
import { IArbitrage, Order } from "../interfaces/arbitrage.interface";

export class ArbitrageFactory {
  public createArbitrage(data: IArbitrage): Arbitrage {
    const arbitrage = new Arbitrage({
      arbitrageId: data.arbitrageId,
      minProfit: data.minProfit,
      brokeragePerTransactionPercent: data.brokeragePerTransactionPercent,
      feesCoinPrice: data.feesCoinPrice,
      symbols: data.symbols,
    });
    console.log(data)
    // Populate other properties as needed
    arbitrage.realOrders = data.realOrders || [];
    arbitrage.calculatedOrders = data.calculatedOrders || [];
    arbitrage.BalanceUpdates = data.BalanceUpdates || {};
    arbitrage.status = data.status || ArbitrageStatusEnum.INIT;
    arbitrage.reverseOrder = data.reverseOrder || {} as Order;
    arbitrage.createdAt = data.createdAt;
    arbitrage.finishAt = data.finishAt;
    arbitrage.log = data.log || [];

    return arbitrage;
  }
}
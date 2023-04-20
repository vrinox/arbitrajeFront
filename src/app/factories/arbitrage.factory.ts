import { Arbitrage } from "../entities/arbitrage.entity";
import { ArbitrageStatusEnum } from "../core/enum/arbitrage.enum";
import { IArbitrage, Order } from "../core/interfaces/arbitrage.interface";

export class ArbitrageFactory {
  public createArbitrage(data: IArbitrage): Arbitrage {
    const arbitrage = new Arbitrage({
      arbitrageId: data.arbitrageId,
      minProfit: data.minProfit,
      brokeragePerTransactionPercent: data.brokeragePerTransactionPercent,
      feesCoinPrice: data.feesCoinPrice,
      symbols: data.symbols,
    });
    // Populate other properties as needed
    arbitrage.realOrders = data.realOrders || [];
    arbitrage.calculatedOrders = data.calculatedOrders || [];
    arbitrage.BalanceUpdates = data.BalanceUpdates || {};
    arbitrage.status = data.status || ArbitrageStatusEnum.INIT;
    arbitrage.reverseOrder = data.reverseOrder || {} as Order;
    arbitrage.createdAt = new Date(data.createdAt).getTime();
    arbitrage.finishAt =  new Date(data.finishAt).getTime();
    arbitrage.log = data.log || [];

    return arbitrage;
  }
}
import { Arbitrage } from "../../entities/arbitrage.entity";
import { ArbitrageStatusEnum } from "../enum/arbitrage.enum";

export interface CalculatedOrderData {
  symbol: string;
  amount: number;
  initial: number;
  price: number;
  type: string;
  tucho: number;
}

export interface FillData {
  price: number;
  qty: number;
  commission: number;
  commissionAsset: string;
  tradeId: number;
}
export interface AccountBalance {
  [coin: string]: number
}
export interface IArbitrage {
  arbitrageId:string;
  minProfit: number,
  brokeragePerTransactionPercent: number,
  feesCoinPrice: number,
  feeCurrency: string,
  realOrders: any[],
  calculatedOrders: CalculatedOrderData[],
  BalanceUpdates: { [order: string]: AccountBalance },
  symbols: string[],
  status: ArbitrageStatusEnum,
  reverseOrder?: Order,
  createdAt: number,
  finishAt: number,
  log?:ArbitrageLog[]
}
export interface ArbitrageLog{msg:string,step:string}

export interface OrderRequirements{
  amount:number,
  price: number,
  invest: number
}
export interface Order {
  clientOrderId: string
  cummulativeQuoteQty: string
  executedQty: string
  icebergQty?: string
  isIsolated?: boolean
  isWorking: boolean
  orderId: number
  orderListId: number
  origQty: string
  price: string
  side: OrderSide_LT
  status: string
  stopPrice?: string
  symbol: string
  time: number
  timeInForce: string
  transactTime?: number
  type: OrderType_LT
  updateTime: number
}
export type OrderSide_LT = 'BUY' | 'SELL';
export const enum OrderSide {
  BUY = 'BUY',
  SELL = 'SELL',
}

export type OrderType_LT =
| 'LIMIT'
| 'LIMIT_MAKER'
| 'MARKET'
| 'STOP'
| 'STOP_MARKET'
| 'STOP_LOSS_LIMIT'
| 'TAKE_PROFIT_LIMIT'
| 'TAKE_PROFIT_MARKET'
| 'TRAILING_STOP_MARKET'
export const enum OrderType {
  LIMIT = 'LIMIT',
  LIMIT_MAKER = 'LIMIT_MAKER',
  MARKET = 'MARKET',
  STOP = 'STOP',
  STOP_MARKET = 'STOP_MARKET',
  STOP_LOSS_LIMIT = 'STOP_LOSS_LIMIT',
  TAKE_PROFIT_LIMIT = 'TAKE_PROFIT_LIMIT',
  TAKE_PROFIT_MARKET = 'TAKE_PROFIT_MARKET',
  TRAILING_STOP_MARKET = 'TRAILING_STOP_MARKET',
}
export interface DailyPerformanceData {
  successfulArbitrages: number;
  arbitragesWithProfit: number;
  arbitragesWithLoss: number;
  usedCurrencies: { [currency: string]: number };
  totalFees: number;
  totalArbitrages: number;
  profitLoss: number;
  averageTime: number
  arbitrages: Arbitrage[],
  date: string,
  arbitragesFailed: number
}

export interface PriceVariationItem{ calculated: number, real: number, percentDiff: number }
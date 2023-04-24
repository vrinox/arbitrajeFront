export enum ArbitrageStatusEnum {
  INIT = 'init',
  ORDER_1 = 'order1',
  ORDER_2 = "order2",
  ORDER_3 = 'order3',
  END = 'end',
  REVERSED = 'failed'
}
export enum SocketNotificationTypeEnum {
  SUCCESSFUL_ARBITRAGE = 'arbitrage',
  DAY_PERFORMANCE = 'arbitragesByDate',
  ACTIVE_ARBITRAGE = 'activeArbitrage',
  ACCOUNT_UPDATE = 'accountUpdate'
}

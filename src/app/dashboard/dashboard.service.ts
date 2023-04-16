import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';
import { DailyPerformanceData } from '../interfaces/arbitrage.interface';
import { Arbitrage } from '../entities/arbitrage.entity';
import { ArbitrageStatusEnum } from '../enum/arbitrage.enum';
import { roundToPrecision } from '../utils/math.util';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private arbitrages: BehaviorSubject<Arbitrage[]> = new BehaviorSubject([] as Arbitrage[]);

  constructor() {}

  // Get the daily performance for the arbitrages
  getDailyPerformance({arbitrages, day}:{arbitrages: Arbitrage[], day:string}) {
    const dailyPerformance: DailyPerformanceData = {
      totalArbitrages: arbitrages.length,
      successfulArbitrages: 0,
      arbitragesWithProfit: 0,
      arbitragesWithLoss: 0,
      profitLoss: 0,
      failedArbitrages: 0,
      averageTime: 0,
      usedCurrencies: {},
      totalFees: 0,
      arbitrages: arbitrages,
      date: day,
      arbitragesFailed:0
    };

    arbitrages.forEach((arbitrage: Arbitrage) => {
      // Calculate the different metrics based on the arbitrage data
      dailyPerformance.successfulArbitrages += arbitrage.status === ArbitrageStatusEnum.END ? 1 : 0;
      dailyPerformance.arbitragesWithProfit += arbitrage.calculateRealProfit() > 0 ? 1 : 0;
      dailyPerformance.arbitragesWithLoss += arbitrage.calculateRealProfit() < 0 ? 1 : 0;
      dailyPerformance.arbitragesFailed += arbitrage.status === ArbitrageStatusEnum.REVERSED? 1 : 0;
      dailyPerformance.profitLoss += roundToPrecision(arbitrage.calculateRealProfit(), 2);
      dailyPerformance.failedArbitrages += arbitrage.status === ArbitrageStatusEnum.REVERSED? 1 : 0;
      dailyPerformance.averageTime += (arbitrage.finishAt || 0) - (arbitrage.createdAt || 0);
      dailyPerformance.totalFees += arbitrage.calculateRealFees();

      arbitrage.getCurrenciesInvolved().forEach((currency) => {
        if (dailyPerformance.usedCurrencies[currency]) {
          dailyPerformance.usedCurrencies[currency]++;
        } else {
          dailyPerformance.usedCurrencies[currency] = 1;
        }
      });
    });

    // Calculate the average time
    dailyPerformance.averageTime /= arbitrages.length;

    return dailyPerformance;
  }
}
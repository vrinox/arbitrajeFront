import { Injectable } from '@angular/core';
import { DailyPerformanceData } from '../core/interfaces/arbitrage.interface';
import { Arbitrage } from '../entities/arbitrage.entity';
import { ArbitrageStatusEnum } from '../core/enum/arbitrage.enum';
import { roundToPrecision } from '../core/utils/math.util';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {

  constructor() {}

  // Get the daily performance for the arbitrages
  getDailyPerformance({arbitrages, day}:{arbitrages: Arbitrage[], day:string}) {
    const dailyPerformance: DailyPerformanceData = {
      totalArbitrages: arbitrages.length,
      successfulArbitrages: 0,
      arbitragesWithProfit: 0,
      arbitragesWithLoss: 0,
      profitLoss: 0,
      averageTime: 0,
      usedCurrencies: {},
      totalFees: 0,
      arbitrages: arbitrages,
      date: day,
      arbitragesFailed:0
    };
    let contValidExecution = 0;
    arbitrages.forEach((arbitrage: Arbitrage) => {
      // Calculate the different metrics based on the arbitrage data
      dailyPerformance.successfulArbitrages += arbitrage.status === ArbitrageStatusEnum.END ? 1 : 0;
      dailyPerformance.arbitragesWithProfit += arbitrage.calculateRealProfit() > 0 ? 1 : 0;
      dailyPerformance.arbitragesWithLoss += arbitrage.calculateRealProfit() < 0 ? 1 : 0;
      dailyPerformance.arbitragesFailed += arbitrage.status === ArbitrageStatusEnum.REVERSED? 1 : 0;
      dailyPerformance.profitLoss += roundToPrecision(arbitrage.calculateRealProfit(), 2);
      if(arbitrage.calculateRealFees() > 0) dailyPerformance.totalFees += arbitrage.calculateRealFees() * arbitrage.feesCoinPrice;
      
      if(arbitrage.finishAt){
        contValidExecution++;
        dailyPerformance.averageTime += arbitrage.finishAt - arbitrage.createdAt 
      }
      const currency = arbitrage.symbols[2].split('/')[0];
      if (dailyPerformance.usedCurrencies[currency]) {
        dailyPerformance.usedCurrencies[currency]++;
      } else {
        dailyPerformance.usedCurrencies[currency] = 1;
      }
    });

    // Calculate the average time
    dailyPerformance.averageTime /= contValidExecution;

    return dailyPerformance;
  }
  groupArbitragesByDay({arbitrages}:{arbitrages:Arbitrage[]}): { [key: string]: Arbitrage[] } {
    const temp: any = {};

    arbitrages.forEach((arbitrage) => {
      const date = new Date(arbitrage.createdAt);
      const dayKey = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;

      if (!temp[dayKey]) {
        temp[dayKey] = [];
      }
      temp[dayKey].push(arbitrage);
    });

    // Sort the date keys
    const sortedKeys = Object.keys(temp).sort((a, b) => {
      const [dayA, monthA, yearA] = a.split('-').map(Number);
      const [dayB, monthB, yearB] = b.split('-').map(Number);

      return new Date(yearB, monthB - 1, dayB).getTime() - new Date(yearA, monthA - 1, dayA).getTime();
    });
    let arbitragesByDay;
    // Create the final sorted object
    arbitragesByDay = sortedKeys.reduce((acc: any, key) => {
      acc[key] = temp[key];
      return acc;
    }, {});
    return arbitragesByDay
  }
}
import { Component, OnInit } from '@angular/core';
import { SocketIOServiceService } from '../socket-ioservice.service';
import { Arbitrage } from '../entities/arbitrage.entity';
import { DailyPerformanceData, IArbitrage } from '../core/interfaces/arbitrage.interface';
import { ArbitrageFactory } from '../factories/arbitrage.factory';
import { DashboardService } from './dashboard.service';
import { ArbitrageStatusEnum } from '../core/enum/arbitrage.enum';
import { roundToPrecision } from '../core/utils/math.util';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass']
})
export class DashboardComponent implements OnInit {
  arbitrages: Arbitrage[] = [];
  arbitragesByDay: { [key: string]: Arbitrage[] } = {};
  dailyPerformance: DailyPerformanceData[] = [{
    totalArbitrages: 0,
    successfulArbitrages: 0,
    arbitragesWithProfit: 0,
    arbitragesWithLoss: 0,
    profitLoss: 0,
    averageTime: 0,
    usedCurrencies: {},
    totalFees: 0,
    arbitrages: [],
    date: '',
    arbitragesFailed: 0
  }];
  constructor(
    private socketService: SocketIOServiceService,
    private arbitrageFactory: ArbitrageFactory,
    private dashboardService: DashboardService
  ) {
    this.socketService.dailyPerformance().subscribe((arbitrages: Arbitrage[]) => {
      this.arbitrages = arbitrages.filter(({ realOrders }) => realOrders.length).map(this.arbitrageFactory.createArbitrage);
      this.groupArbitragesByDay();
      this.dailyPerformance = Object.entries(this.arbitragesByDay).map(([day, arbitrages]) => this.dashboardService.getDailyPerformance({ day, arbitrages }))
    });
  }
  groupArbitragesByDay(): void {
    const temp: any = {};

    this.arbitrages.forEach((arbitrage) => {
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

    // Create the final sorted object
    this.arbitragesByDay = sortedKeys.reduce((acc: any, key) => {
      acc[key] = temp[key];
      return acc;
    }, {});
  }

  ngOnInit(): void {
    this.socketService.getAllArbitrages()
  }
}
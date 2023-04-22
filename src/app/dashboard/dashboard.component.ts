import { Component, OnInit } from '@angular/core';
import { SocketIOServiceService } from '../socket-ioservice.service';
import { Arbitrage } from '../entities/arbitrage.entity';
import { DailyPerformanceData, IArbitrage } from '../core/interfaces/arbitrage.interface';
import { ArbitrageFactory } from '../factories/arbitrage.factory';
import { DashboardService } from './dashboard.service';
import { ArbitrageStatusEnum } from '../core/enum/arbitrage.enum';
import { roundToPrecision } from '../core/utils/math.util';
import { SessionService } from '../session.service';
import { Router } from '@angular/router';

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
    private dashboardService: DashboardService,
    private session: SessionService,
    private router: Router
  ) {}
  
  async ngOnInit(): Promise<void> {
    this.session.arbitragesStream.subscribe((arbitrages:Arbitrage[])=>{
      this.arbitrages = arbitrages;
      this.arbitragesByDay = this.dashboardService.groupArbitragesByDay({arbitrages});
      this.dailyPerformance = Object.entries(this.arbitragesByDay).map(([day, arbitrages]) => this.dashboardService.getDailyPerformance({ day, arbitrages }))
    });
  }

  handleArbitrageSelected(event: CustomEvent) {
    const arbitrageId = event.detail;
    this.router.navigate(['/arbitrage', arbitrageId]);
  }
}
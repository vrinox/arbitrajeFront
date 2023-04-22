import { Component } from '@angular/core';
import { SessionService } from '../session.service';
import { Arbitrage } from '../entities/arbitrage.entity';
import { DashboardService } from '../dashboard/dashboard.service';
import { DailyPerformanceData } from '../core/interfaces/arbitrage.interface';

@Component({
  selector: 'app-compare',
  templateUrl: './compare.component.html',
  styleUrls: ['./compare.component.sass']
})
export class CompareComponent {
  mainArbitrage: Arbitrage = {} as Arbitrage;
  compareArbitrage: Arbitrage = {} as Arbitrage;
  dayMainSelected: DailyPerformanceData | null = null;
  dayCompareSelected: DailyPerformanceData | null = null;
  days: DailyPerformanceData[] = [];
  constructor(
    private session: SessionService,
    private dashboardService: DashboardService
  ) {
    session.arbitragesStream.subscribe(() => {
      const arbitragesByDay = dashboardService.groupArbitragesByDay({ arbitrages: session.arbitragesCache })
      this.days = Object.entries(arbitragesByDay).map(([day, arbitrages]) => dashboardService.getDailyPerformance({ arbitrages, day }));
    })
  }
  changeDayMain(event: any) {
    const dateSelected = event.srcElement.value;
    const day = this.days.find(({ date }) => date === dateSelected);
    this.dayMainSelected = day ? day : null;
  }
  handleMainArbitrageSelected(event: CustomEvent) {
    const arbitrageSelected = this.dayMainSelected!.arbitrages.find(({ arbitrageId }) => event.detail === arbitrageId);
    if (arbitrageSelected) this.mainArbitrage = arbitrageSelected;
  }
  changeDayCompare(event: any) {
    const dateSelected = event.srcElement.value;
    const day = this.days.find(({ date }) => date === dateSelected);
    this.dayCompareSelected = day ? day : null;
  }
  handleCompareArbitrageSelected(event: CustomEvent) {
    const arbitrageSelected = this.dayCompareSelected!.arbitrages.find(({ arbitrageId }) => event.detail === arbitrageId);
    if (arbitrageSelected) this.compareArbitrage = arbitrageSelected;
  }
}

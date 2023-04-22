import { Injectable } from '@angular/core';
import { Arbitrage } from './entities/arbitrage.entity';
import { SocketIOServiceService } from './socket-ioservice.service';
import { IArbitrage } from './core/interfaces/arbitrage.interface';
import { ArbitrageFactory } from './factories/arbitrage.factory';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  arbitragesStream: BehaviorSubject<Arbitrage[]> = new BehaviorSubject([] as Arbitrage[]);
  arbitragesCache: Arbitrage[] = [];
  constructor(
    private socketService: SocketIOServiceService,
    private arbitrageFactory: ArbitrageFactory
  ) {
    this.socketService.getAllArbitrages();
    this.socketService.dailyPerformance().subscribe((arbitrages: IArbitrage[]) => {
      this.arbitragesCache = arbitrages.filter(({ realOrders }) => realOrders.length).map(this.arbitrageFactory.createArbitrage);
      this.arbitragesStream.next(this.arbitragesCache);
    });
  }
}

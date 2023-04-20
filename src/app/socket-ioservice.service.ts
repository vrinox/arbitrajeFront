import { Injectable } from '@angular/core';
import { IArbitrage } from './core/interfaces/arbitrage.interface';
import { Arbitrage } from './entities/arbitrage.entity';
import { BehaviorSubject } from 'rxjs';
import { ArbitrageFactory } from './factories/arbitrage.factory';
import {io} from 'socket.io-client';
import { environment } from './core/environments/enviroment';
import { Observable } from 'rxjs';
import { SocketNotificationTypeEnum } from './core/enum/arbitrage.enum';

@Injectable({
  providedIn: 'root'
})
export class SocketIOServiceService {
  private socket;
  private arbitrages: BehaviorSubject<Arbitrage[]> = new BehaviorSubject([] as Arbitrage[]);

  constructor(private arbitrageFactory: ArbitrageFactory) {
    this.socket = io(environment.socketUrl);
    this.listenForArbitrageUpdates();
  }

  private listenForArbitrageUpdates() {
    this.socket.on('arbitrageUpdate', (data: IArbitrage) => {
      const arbitrage = this.arbitrageFactory.createArbitrage(data);
      const currentArbitrages = this.arbitrages.getValue();
      currentArbitrages.push(arbitrage);
      this.arbitrages.next(currentArbitrages);
    });
  }

  dailyPerformance(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on(SocketNotificationTypeEnum.DAY_PERFORMANCE, (arbitrages) => {
        observer.next(arbitrages);
      });

      // This will be called when the subscriber unsubscribes
      return () => {
        this.socket.off(SocketNotificationTypeEnum.DAY_PERFORMANCE);
      };
    });
  }

  getArbitragesByDate({date}:{date: number}): void {
    console.log(`this is the date ${date}`);
    this.socket.emit('getArbitragesByDate', { date });
  }

  getAllArbitrages(): void {
    this.socket.emit('getAllArbitrages', {  });
  }

  getArbitrages() {
    return this.arbitrages.asObservable();
  }
}

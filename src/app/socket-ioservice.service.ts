import { Injectable } from '@angular/core';
import { AccountBalance, IArbitrage, Order, exchangePricesCache } from './core/interfaces/arbitrage.interface';
import { Arbitrage } from './entities/arbitrage.entity';
import { BehaviorSubject } from 'rxjs';
import { ArbitrageFactory } from './factories/arbitrage.factory';
import {io} from 'socket.io-client';
import { environment } from './core/environments/enviroment';
import { Observable } from 'rxjs';
import { SocketNotificationTypeEnum } from './core/enum/arbitrage.enum';
export interface AccountSnapshot{
  orders: Order[];
  balances: AccountBalance;
}
@Injectable({
  providedIn: 'root'
})
export class SocketIOServiceService {
  private socket;
  private arbitrages: BehaviorSubject<Arbitrage[]> = new BehaviorSubject([] as Arbitrage[]);
  activeArbitrage: BehaviorSubject<Arbitrage> = new BehaviorSubject({} as Arbitrage);
  account: BehaviorSubject<AccountSnapshot> = new BehaviorSubject({} as AccountSnapshot);
  prices: BehaviorSubject<exchangePricesCache> = new BehaviorSubject({} as exchangePricesCache);
  isAccountConnected: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private arbitrageFactory: ArbitrageFactory) {
    this.socket = io(environment.socketUrl);
    this.listenForArbitrageUpdates();
    this.listenForActiveArbitrage();
    this.listenForAccountUpdates();
    this.listenForPricesUpdate();
  }

  private listenForPricesUpdate(){
    this.socket.on(SocketNotificationTypeEnum.PRICES_UPDATE, (data:exchangePricesCache) => {
      this.prices.next(data);
    })
  }

  private listenForAccountUpdates(){
    this.socket.on(SocketNotificationTypeEnum.ACCOUNT_UPDATE, (data: AccountSnapshot) => {
      this.isAccountConnected.next(true);
      this.account.next(data);
    });
  }

  private listenForActiveArbitrage(){
    this.socket.on(SocketNotificationTypeEnum.ACTIVE_ARBITRAGE, (data: IArbitrage) => {
      const arbitrage = this.arbitrageFactory.createArbitrage(data);
      this.activeArbitrage.next(arbitrage);
    });
  }

  private listenForArbitrageUpdates() {
    this.socket.on(SocketNotificationTypeEnum.ACTIVE_ARBITRAGE, (data: IArbitrage) => {
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

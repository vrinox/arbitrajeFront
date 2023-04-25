import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AccountSnapshot, SocketIOServiceService } from './socket-ioservice.service';
import { Arbitrage } from './entities/arbitrage.entity';
import { Order, exchangePricesCache } from './core/interfaces/arbitrage.interface';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  title = 'crypto-arbitrage-dashboard';
  activeArbitrage: Arbitrage = {} as Arbitrage;
  accountSnapshot: AccountSnapshot = {} as AccountSnapshot;
  accountConnected: boolean = false;
  prices: exchangePricesCache | null = null ;
  constructor(
    private router: Router,
    private socket: SocketIOServiceService
  ){
    this.socket.isAccountConnected.subscribe( value => {this.accountConnected = value})
    this.socket.activeArbitrage.subscribe((arbitrage: Arbitrage)=>{
      this.activeArbitrage = (arbitrage.arbitrageId) ? arbitrage: {} as Arbitrage;
    });
    this.socket.account.subscribe((snapshot:AccountSnapshot)=>{
      snapshot.orders = snapshot.orders?.map((order:Order)=>{
        if(this.prices) order.updatedPrice = Number(this.prices[order.symbol]);
        return order;
      })
      this.accountSnapshot = snapshot;
    });
    this.socket.prices.subscribe((data:exchangePricesCache)=>{
      this.prices = data;
    }) 
  }
  goToCompare(){
    this.router.navigate(['/compare']);
  }
}

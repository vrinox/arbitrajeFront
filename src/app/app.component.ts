import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AccountSnapshot, SocketIOServiceService } from './socket-ioservice.service';
import { Arbitrage } from './entities/arbitrage.entity';
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
  constructor(
    private router: Router,
    private socket: SocketIOServiceService
  ){
    this.socket.isAccountConnected.subscribe( value => {this.accountConnected = value})
    this.socket.activeArbitrage.subscribe((arbitrage: Arbitrage)=>{
      this.activeArbitrage = (arbitrage.arbitrageId) ? arbitrage: {} as Arbitrage;
    });
    this.socket.account.subscribe((snapshot:AccountSnapshot)=>{
      console.log(snapshot)
      this.accountSnapshot = snapshot;
    })
  }
  goToCompare(){
    this.router.navigate(['/compare']);
  }
}

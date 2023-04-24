import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SocketIOServiceService } from './socket-ioservice.service';
import { Arbitrage } from './entities/arbitrage.entity';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  title = 'crypto-arbitrage-dashboard';
  activeArbitrage: Arbitrage = {} as Arbitrage;
  constructor(
    private router: Router,
    private socket: SocketIOServiceService
  ){
    this.socket.activeArbitrage.subscribe((arbitrage: Arbitrage)=>{
      this.activeArbitrage = (arbitrage.arbitrageId) ? arbitrage: {} as Arbitrage;
    });
  }
  goToCompare(){
    this.router.navigate(['/compare']);
  }
}

import { Component, OnInit } from '@angular/core';
import { Arbitrage } from '../entities/arbitrage.entity';
import { SessionService } from '../session.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-arbitrage-detail',
  templateUrl: './arbitrage-detail.component.html',
  styleUrls: ['./arbitrage-detail.component.sass']
})
export class ArbitrageDetailComponent implements OnInit {
  arbitrage: Arbitrage = {} as Arbitrage;
  constructor(
    private session: SessionService,
    private route: ActivatedRoute
  ) {

  }
  ngOnInit(): void {
    const arbitrageId = this.route.snapshot.paramMap.get('id');
    const arbitrage = this.session.arbitragesCache.find((arbitrage: Arbitrage) => arbitrage.arbitrageId === arbitrageId);
    if (arbitrage) this.arbitrage = arbitrage;
  }
 
}

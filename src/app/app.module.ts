import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ArbitrageFactory } from './factories/arbitrage.factory';
import { ArbitrageDetailComponent } from './arbitrage-detail/arbitrage-detail.component';
import { CompareComponent } from './compare/compare.component';

import './components/arbitrage-detail/arbitrage-detail';
import './components/arbitrage-detail/price-variation-list-item';
import './components/arbitrage-detail/real-order-display';
import './components/arbitrage-detail/arbitrage-log';
import './components/daily-performance/daily-performance';
import './components/daily-performance/arbitrage-min-list';
import './components/arbitrage-min-card';
import './components/app-header';
import './components/arbitrage-detail/min-donnut-chart';
import './components/monthly-resumen/monthly-resumen';
import './components/active-arbitrage-bar';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    ArbitrageDetailComponent,
    CompareComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatCardModule,
    MatGridListModule,
    MatIconModule,
    MatTableModule,
    MatListModule,
    MatDividerModule,
    MatButtonModule,
    MatChipsModule,
    MatProgressBarModule
  ],
  providers: [ArbitrageFactory],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArbitrageDetailComponent } from './arbitrage-detail/arbitrage-detail.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CompareComponent } from './compare/compare.component';

const routes: Routes = [
  { path: 'arbitrage/:id', component: ArbitrageDetailComponent },
  { path: 'compare', component: CompareComponent },
  { path: '', component: DashboardComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

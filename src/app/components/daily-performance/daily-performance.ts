import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { DailyPerformanceData } from '../../interfaces/arbitrage.interface';

@customElement('daily-performance')
export class DailyPerformance extends LitElement {
  @property({ type: Object }) data: DailyPerformanceData = {
    totalArbitrages: 0,
    successfulArbitrages: 0,
    arbitragesWithProfit: 0,
    arbitragesWithLoss: 0,
    profitLoss: 0,
    averageTime: 0,
    usedCurrencies: {},
    totalFees: 0,
    arbitrages: [],
    date: '',
    arbitragesFailed: 0
  };

  static override styles = css`
    :host {
      display: block;
      font-family: 'Roboto', sans-serif;
      margin:10px;
      width: calc(50vw - 30px);
      max-width:500px;
    }
    .min-container{
      display: flex;
      width: calc(100vw -20px);
      overflow: hidden;
      flex-wrap: wrap
    }
    .daily{
      color: black;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      max-width: calc(50vw - 62px);
      overflow:hidden;
    }
    .title-bar{
      background-color: #000;
      padding:10px;
      color:white;
      font-size: 2em;
    }
    .content{
      padding:16px;
    }
  `;

  override render() {
    const {
      totalArbitrages,
      successfulArbitrages,
      arbitragesWithProfit,
      arbitragesWithLoss,
      profitLoss,
      averageTime,
      usedCurrencies,
      totalFees,
      arbitrages,
      date,
      arbitragesFailed
    } = this.data;
    return html`
    <div class="daily">
      <div class="title-bar"> ${date}</div>
      <div class="content">
        <div fxLayout="row wrap" fxLayoutGap="20px">
          <div fxFlex.gt-sm="33" fxFlex.md="50" fxFlex.sm="100">
            <mat-card>
              <h2>Total Arbitrages</h2>
              <mat-card-content>
                <b>Total:</b>${ totalArbitrages } <b>Successful:</b>${successfulArbitrages} <b>With
                  Profit:</b>${arbitragesWithProfit} <b>failed:</b>${arbitragesFailed}
              </mat-card-content>
            </mat-card>
          </div>
          <div fxFlex.gt-sm="33" fxFlex.md="50" fxFlex.sm="100">
            <mat-card>
              <mat-card-title>Profit/loss</mat-card-title>
              <mat-card-content style="color: ${ profitLoss >= 0 ? 'green' : 'red'}">
                ${profitLoss}$
              </mat-card-content>
            </mat-card>
          </div>
          <div fxFlex.gt-sm="33" fxFlex.md="50" fxFlex.sm="100">
            <mat-card>
              <mat-card-title>Fees</mat-card-title>
              <mat-card-content>
                ${totalFees}BNB
              </mat-card-content>
            </mat-card>
          </div>
        </div>
        <h2>Arbitrages</h2>
        <div class="min-container">
          ${arbitrages.map(arbitrage => html`<arbitrage-min-card  .arbitrage=${arbitrage} />`)}
        </div>
      </div>
      <br>
  </div>
  `;
  }
}
import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { DailyPerformanceData } from '../../core/interfaces/arbitrage.interface';
import { ColorsEnum } from '../../core/enum/colors.enum';
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
      flex-wrap: wrap;
      width: 456px;
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
    .three-or-less{
      display: flex;
      justify-content: flex-start;
    }
    .three-or-more{
      display: flex;
      justify-content: center;
    }
  `;

  override render() {
    const {
      profitLoss,
      averageTime,
      usedCurrencies,
      totalFees,
      arbitrages,
      date,
      successfulArbitrages,
      totalArbitrages,
      arbitragesFailed,
      arbitragesWithLoss,
      arbitragesWithProfit
    } = this.data;
    const data1 = {
      labels: [`OK ${successfulArbitrages}/${totalArbitrages}`, `KO ${arbitragesFailed}/${totalArbitrages}`],
      data: [successfulArbitrages, arbitragesFailed],
      colors: [ColorsEnum.blue, ColorsEnum.grey],
      legend:true
    }
    const data2 = {
      labels: [`Profit ${arbitragesWithProfit}/${totalArbitrages}`, `Loss ${arbitragesWithLoss}/${totalArbitrages}`],
      data: [arbitragesWithProfit, arbitragesWithLoss],
      colors: [ColorsEnum.green, ColorsEnum.red],
      legend:true
    }
    const data3 = {
      labels: Object.keys(usedCurrencies),
      data: Object.values(usedCurrencies),
      legend: false
    }
    return html`
   <div class="daily">
    <div class="title-bar"> ${date}</div>
    <div class="content">
      <div fxFlex.gt-sm="33" fxFlex.md="50" fxFlex.sm="100">
        <mat-card>
          <b>Profit/loss</b>
          <span style="color: ${profitLoss >= 0 ? ColorsEnum.green : ColorsEnum.red}">
            ${profitLoss.toFixed(2)}$
          </span>
        </mat-card>
      </div>
      <div fxFlex.gt-sm="33" fxFlex.md="50" fxFlex.sm="100">
        <mat-card>
          <b>Fees</b> ${totalFees.toFixed(6)}BNB
        </mat-card>
      </div>
      <div fxLayout="row wrap" fxLayoutGap="20px">
        <div fxFlex.gt-sm="33" fxFlex.md="50" fxFlex.sm="100">
          <mat-card>
            <h2>Total Arbitrages</h2>
            <mat-card-content style="display:flex">
              <div style="width:30%"><min-donnut-chart .data=${data1} /></div>
              <div style="width:30%"><min-donnut-chart .data=${data2} /></div>
              <div style="width:30%"><min-donnut-chart .data=${data3} /></div>
            </mat-card-content>
          </mat-card>
        </div>
      </div>
      <h2>Arbitrages</h2>
      <div class="${arbitrages.length >= 3? " three-or-more":"three-or-less"}">
        <div class="min-container ">
          ${arbitrages.map(arbitrage => html`<arbitrage-min-card .arbitrage=${arbitrage} />`)}
        </div>
      </div>
    </div>
    <br>
  </div>`;
  }
}
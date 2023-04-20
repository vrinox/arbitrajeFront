import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { DailyPerformanceData } from '../../core/interfaces/arbitrage.interface';
import { Chart, PieController, ArcElement, Legend, Tooltip } from 'chart.js';
import { ColorsEnum } from '../../core/enum/colors.enum';
Chart.register(PieController, ArcElement, Legend, Tooltip);
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

  initializeChart() {
    const { totalArbitrages, successfulArbitrages, arbitragesWithProfit, arbitragesFailed } = this.data;
    const canvas: HTMLCanvasElement = this.shadowRoot?.querySelector('#chart') as HTMLCanvasElement;
    if(canvas){
      const ctx = canvas.getContext('2d');
      if (ctx) {
        new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: [`OK ${successfulArbitrages}/${totalArbitrages}`, `KO ${arbitragesFailed}/${totalArbitrages}`],
            datasets: [
              {
                data: [successfulArbitrages, arbitragesFailed],
                backgroundColor: [ColorsEnum.green, ColorsEnum.red],
                borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 206, 86, 1)'],
                borderWidth: 1,
              },
            ],
          },
          options: {
            plugins: {
              legend: {
                position: 'bottom',
              },
            },
          },
        });
      }
    }
    
  }
  override firstUpdated() {
    this.initializeChart();
  }

  override render() {
    const {
      profitLoss,
      averageTime,
      usedCurrencies,
      totalFees,
      arbitrages,
      date
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
                <div style="width:30%"><canvas id="chart"></canvas></div>
              </mat-card-content>
            </mat-card>
          </div>
          <div fxFlex.gt-sm="33" fxFlex.md="50" fxFlex.sm="100">
            <mat-card>
              <mat-card-title>Profit/loss</mat-card-title>
              <mat-card-content style="color: ${profitLoss >= 0 ? 'green' : 'red'}">
                ${profitLoss.toFixed(2)}$
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
        <div class="${arbitrages.length >= 3? "three-or-more":"three-or-less"}">
          <div class="min-container ">
            ${arbitrages.map(arbitrage => html`<arbitrage-min-card .arbitrage=${arbitrage} />`)}
          </div>
        </div>
      </div>
      <br>
  </div>
  `;
  }
}
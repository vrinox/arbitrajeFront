// arbitrage-detail.ts
import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Arbitrage } from '../../entities/arbitrage.entity';
import { ArbitrageStatusEnum } from '../../core/enum/arbitrage.enum';
import { roundToPrecision } from '../../core/utils/math.util';
import { CalculatedOrderData, PriceVariationItem } from '../../core/interfaces/arbitrage.interface';
import { ColorsEnum } from '../../core/enum/colors.enum';
import { formatDate, msToTime } from '../../core/utils/time.util';

@customElement('arbitrage-detail')
export class ArbitrageDetail extends LitElement {
  @property({ type: Object }) arbitrage: Arbitrage = {} as Arbitrage;

  static override styles = css`
    :host {
        display: block;
        font-family: 'Roboto', sans-serif;
      }

      .detail {
        background-color: #ffffff;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        margin-bottom: 16px;
        overflow: hidden;
        margin:10px;
      }
      
      .container{        
        padding: 16px;
      }

      h3 {
        font-size: 16px;
        margin-bottom: 8px;
      }

      p, ul {
        font-size: 14px;
        margin-top: 0;
        margin-bottom: 16px;
      }

      ul {
        padding-left: 20px;
      }

      li {
        margin-bottom: 4px;
      }

      .price-variations li {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      
  `;

  getPriceVariations(arbitrage: Arbitrage): PriceVariationItem[] {
    const priceVariations: { calculated: number, real: number, percentDiff: number }[] = [];

    for (let i = 0; i < arbitrage.realOrders.length; i++) {
      const calculatedPrice = arbitrage.calculatedOrders[i].price;
      const realPrice = Number(arbitrage.realOrders[i].price);
      const percentDiff = ((realPrice - calculatedPrice) / calculatedPrice) * 100;

      priceVariations.push({ calculated: calculatedPrice, real: realPrice, percentDiff });
    }

    return priceVariations;
  }

  getSimulationDifferences(): number {
    if (this.arbitrage.status !== ArbitrageStatusEnum.END) return 0;
    const simulatedProfit = this.arbitrage.getSimulateProfit();
    const realProfit = this.arbitrage.calculateRealProfit();
    return roundToPrecision(realProfit - simulatedProfit, 2);
  }
  getExecutionTime(){
    if(!this.arbitrage.finishAt) return 0 
    return msToTime(this.arbitrage.finishAt - this.arbitrage.createdAt)
  }

  override render() {
    if(!this.arbitrage.arbitrageId) return nothing;
    const simulationDiff = this.getSimulationDifferences();
    const [intermediate, ticker] = this.arbitrage.symbols[1].split('/');
    const realProfit = this.arbitrage.calculateRealProfit();
    const feeCurrency = this.arbitrage.feeCurrency;
    return html`
    <div class="detail">
      <card-title style="font-size: 1.5em"> Arbitrage [${intermediate}/${ticker}]</card-title>
      <div class="container">
        <div>
          <h3>Data:</h3>
          <i>Status:</i> ${this.arbitrage.status}<br>
          <i>Arbitrage Id:</i> ${this.arbitrage.arbitrageId}<br>
          <i>Simulation Differences:</i><span style="color: ${ simulationDiff >= 0 ? ColorsEnum.green : ColorsEnum.red}"> ${simulationDiff}$</span><br>
          <i>Real Profit/Loss:</i><span style="color: ${ realProfit >= 0 ? ColorsEnum.green : ColorsEnum.red}"> ${realProfit}$</span><br>
          <i>Fees:</i> ${this.arbitrage.calculateRealFees()} ${feeCurrency}<br>          
        </div>
        <div>
          <h3>Time</h3>
          <i>Created At:</i>${formatDate(new Date(this.arbitrage.createdAt))}<br>
          ${this.arbitrage.finishAt === 0? '': html`<i>Finish At:</i>${formatDate(new Date(this.arbitrage.finishAt))}</div><br>`}
          ${this.arbitrage.finishAt === 0? '': html`<i>Execution:</i>${this.getExecutionTime()}</div>`}
        </div>
        <div>
          <h3>Price Variations:</h3>
          <mat-list class="price-variations">
            ${this.getPriceVariations(this.arbitrage).map(priceVariation => html`
            <price-variation-list-item .priceVariationItem=${priceVariation}>`)}
          </mat-list>
        </div>
        <div>
          <h3>Orders:</h3>
          <mat-list>
            ${this.arbitrage.calculatedOrders.map((calculatedOrder: CalculatedOrderData, i) => {
              const order = this.arbitrage.realOrders[i];
                return html`<real-order-display .order=${order} .calculated=${calculatedOrder} .index=${i+1}></real-order-display>`;
              })}
          </mat-list>
        </div>
        <div style="width: 100%">
          <h3>Log:</h3>
          <ul>
            ${this.arbitrage.log.map(logData => html`<arbitrage-log-display .log=${logData} />`)}
          </ul>
        </div>
        <div style="width: 100%">
          <h3>Balance updates:</h3>
          <balance-update-display .balanceStatus=${this.arbitrage.BalanceUpdates}></balance-update-display>
        </div>
      </div>
    </div>`;
  }
}
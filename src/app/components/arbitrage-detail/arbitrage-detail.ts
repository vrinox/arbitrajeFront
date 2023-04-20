// arbitrage-detail.ts
import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Arbitrage } from '../../entities/arbitrage.entity';
import { ArbitrageStatusEnum } from '../../core/enum/arbitrage.enum';
import { roundToPrecision } from '../../core/utils/math.util';
import { PriceVariationItem } from '../../core/interfaces/arbitrage.interface';
import { ColorsEnum } from '../../core/enum/colors.enum';

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
    return ((this.arbitrage.finishAt - this.arbitrage.createdAt) / 60000).toFixed(2)
  }

  override render() {
    const simulationDiff = this.getSimulationDifferences();
    const realProfit = this.arbitrage.calculateRealProfit();
    const feeCurrency = this.arbitrage.feeCurrency;
    return html`
    <div class="detail">
      <h2>Arbitrage Detail</h2>
      <div class="grid-container">
        <div>
          <h3>Data:</h3>
          <i>Status:</i> ${this.arbitrage.status}<br>
          <i>Arbitrage Id:</i> ${this.arbitrage.arbitrageId}<br>
          <i>Simulation Differences:</i><span style="color: ${ simulationDiff >= 0 ? ColorsEnum.green : ColorsEnum.red}"> ${simulationDiff}$</span><br>
          <i>Real Profit/Loss:</i><span style="color: ${ realProfit >= 0 ? ColorsEnum.green : ColorsEnum.red}"> ${realProfit}$</span><br>
          <i>Execution Time:</i> ${this.getExecutionTime()} min<br>
          <i>Fees:</i> ${this.arbitrage.calculateRealFees()} ${feeCurrency}<br>
        </div>
        <div>
          <h3>Price Variations:</h3>
          <mat-list class="price-variations">
            ${this.getPriceVariations(this.arbitrage).map(priceVariation => html`
            <price-variation-list-item .priceVariationItem=${priceVariation}>`)}
          </mat-list>
        </div>
        <div>
          <h3>Real Orders:</h3>
          <mat-list>
            ${this.arbitrage.realOrders.map(order => html`<real-order-display .order=${order}>`)}
          </mat-list>
        </div>
        <div style="width: 100%">
          <h3>Log:</h3>
          <ul>
            ${this.arbitrage.log.map(logData => html`<arbitrage-log-display .log=${logData} />`)}
          </ul>
        </div>
      </div>
    </div>`;
  }
}
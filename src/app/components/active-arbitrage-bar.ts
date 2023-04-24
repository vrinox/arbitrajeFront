import { LitElement, html, css, nothing, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Arbitrage } from '../entities/arbitrage.entity';
import { CalculatedOrderData, PriceVariationItem } from '../core/interfaces/arbitrage.interface';
import { formatDate, msToTime } from '../core/utils/time.util';
import { ArbitrageStatusEnum } from '../core/enum/arbitrage.enum';
import { ColorsEnum } from '../core/enum/colors.enum';

@customElement('active-arbitrage-bar')
export class ActiveArbitrageBar extends LitElement {
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
        margin:10px;
        width: calc(100% - 20px - 32px);
        overflow: hidden;
      }
      .container{        
        padding: 16px;
        display:flex;
        flex-direction: row;
        flex-wrap: nowrap;
      }
      .title{
        color: white;
        padding: 5px;
        background-color: ${unsafeCSS(ColorsEnum.blue)}
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

  override render() {
    if(!this.arbitrage.arbitrageId) return nothing;
    const [intermediate, ticker] = this.arbitrage.symbols[1].split('/');
    const feeCurrency = this.arbitrage.feeCurrency;
    return html`
     <div class="detail">
      <div class="title">Active [${intermediate}/${ticker}]</div>
      <div class="container">
        <div class="element">
          <strong>Data:</strong><br>
          <i>Status:</i> ${this.arbitrage.status}<br>
          <i>Arbitrage Id:</i> ${this.arbitrage.arbitrageId}<br>
          <i>Fees:</i> ${this.arbitrage.calculateRealFees()} ${feeCurrency}<br>  
          <i>Created At:</i>${formatDate(new Date(this.arbitrage.createdAt))}<br>        
        </div>
        <div class="element">
          <strong>Price Variations:</strong><br>
          <mat-list class="price-variations">
            ${this.getPriceVariations(this.arbitrage).map(priceVariation => html`
            <price-variation-list-item .priceVariationItem=${priceVariation}>`)}
          </mat-list>
        </div>
        <div class="element">
          <strong>Orders:</strong><br>
          <mat-list>
            ${this.arbitrage.calculatedOrders.map((calculatedOrder: CalculatedOrderData, i) => {
              const {price, amount, type} = calculatedOrder
              const order = this.arbitrage.realOrders[i];
                return html`
                  <strong>Order${i+1}</strong><br>
                  
                  [Simulated] ${type} ${amount} at price:${price} 
                  ${order? html`<real-order-display .order=${order} ></real-order-display>`: nothing}
                  `
              })}
          </mat-list>
        </div>
        <div  class="element">
          <strong>Log:</strong><br>
          <ul>
            ${this.arbitrage.log.map(logData => html`<arbitrage-log-display .log=${logData} />`)}
          </ul>
        </div>
      </div>
    </div>`;
  }
}
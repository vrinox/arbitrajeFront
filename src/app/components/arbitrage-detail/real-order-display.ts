import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { CalculatedOrderData, Order } from '../../core/interfaces/arbitrage.interface';

@customElement('real-order-display')
export class RealOrderDisplay extends LitElement {
  @property({ type: Object }) order: Order = {} as Order;
  @property({ type: Object }) calculated: CalculatedOrderData = {} as CalculatedOrderData;
  @property({ type: Number}) index: number = 0;

  static override styles = css`
    :host {
      display: block;
      font-family: 'Roboto', sans-serif;
      margin:10px;
    }
  `;

  override render() {
    const {price, amount, type, symbol} = this.calculated
    return html`
    <div>
      <strong>Order${this.index} [${symbol}]</strong><br>
                  
      [Simulated] ${type} ${amount} at price:${price}<br>
      ${this.order.orderId? html`[Real] ${this.order.side} ${this.order.origQty} at ${this.order.price} <br>`: nothing }
    </div>
  `;
  }
}
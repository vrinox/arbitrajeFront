import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Order } from '../../interfaces/arbitrage.interface';

@customElement('real-order-display')
export class RealOrderDisplay extends LitElement {
  @property({ type: Object }) order: Order = {} as Order;

  static override styles = css`
    :host {
      display: block;
      font-family: 'Roboto', sans-serif;
      margin:10px;
    }
  `;

  override render() {
    const { symbol,side, origQty, price } = this.order;
    return html`
    <mat-list-item>
      <b>[${symbol}]</b> ${side} ${Number(origQty)} at ${Number(price)}
    </mat-list-item>
  `;
  }
}
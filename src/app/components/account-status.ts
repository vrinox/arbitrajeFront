import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Order } from '../core/interfaces/arbitrage.interface';
import { AccountSnapshot } from '../socket-ioservice.service';
import { formatDate, msToTime } from '../core/utils/time.util';

@customElement('account-status-card')
export class AccountStatusCard extends LitElement {
  @property({ type: Object}) accountSnapshot: AccountSnapshot = {
    orders: [] as Order[],
    balances: {}
  } as AccountSnapshot;

  static override styles = css`
    :host {
      display: block;
      font-family: 'Roboto', sans-serif;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      margin-bottom: 16px;
      margin:10px;
      overflow: hidden;
      width: calc(50% - 20px - 32px);
    }
    .container{
      display:flex;
      flex-direction: row;
      flex-wrap: wrap;
      padding: 16px;
    }
    .balances,.orders{
      width: 50%;
    }
  `;

  override render() {
    if(!this.accountSnapshot.balances) return nothing;
    return html`
    <card-title>Account status</card-title>
    <div class="container">
      <div class="balances">
        <strong>Balances:</strong><br>
        ${Object.entries(this.accountSnapshot.balances)
        .filter(([key,value])=> value !== 0)
        .map(([key, value])=>{
          return html`[${key}]: ${value.toFixed(8)}<br>`;
        })}
      </div>
      <div class="orders">
        <strong>Orders:</strong><br>
        ${this.accountSnapshot.orders.map((order:Order)=>{
          const {side, origQty, price, updateTime} = order;
          return html`<div>[${side}] ${Number(origQty)} at ${Number(price)} took:${msToTime(Date.now() - updateTime)}</div><br>`
        })}
      </div>
    </div>
    
  `;
  }
}
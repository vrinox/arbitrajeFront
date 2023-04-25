import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Order, exchangePricesCache } from '../core/interfaces/arbitrage.interface';
import { AccountSnapshot, SocketIOServiceService } from '../socket-ioservice.service';
import { formatDate, msToTime } from '../core/utils/time.util';
import { ColorsEnum } from '../core/enum/colors.enum';

@customElement('account-status-card')
export class AccountStatusCard extends LitElement {
  @property({ type: Object}) accountSnapshot: AccountSnapshot = {
    orders: [] as Order[],
    balances: {}
  } as AccountSnapshot;
  @property({type: Object}) prices: exchangePricesCache | null = null;
  @property({ type: Array }) elapsedTimes: number[] = [];

  private intervalId?: any;

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
  protected override firstUpdated() {
    this.updateElapsedTimes();
    this.intervalId = setInterval(() => {
      this.updateElapsedTimes();
    }, 1000);
  }
  private updateElapsedTimes() {
    if(!this.accountSnapshot.orders || this.accountSnapshot.orders.length === 0) return ;
    this.elapsedTimes = this.accountSnapshot.orders.map(
      (order) => Date.now() - order.updateTime
    );
  }
  
  override disconnectedCallback() {
    super.disconnectedCallback();
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
  override render() {
    
    if(!this.accountSnapshot.balances) return nothing;
    let total = 0;
    return html`
    <card-title>Account status</card-title>
    <div class="container">
      <div class="balances">
        <strong>Balances:</strong><br>
        ${Object.entries(this.accountSnapshot.balances)
        .filter(([key,value])=> value !== 0)
        .map(([key, value])=>{
          const prices = this.prices![`${key}USDT`];
          let available = prices?.BUY ? prices.BUY * Number(value): 0;
          if(key === 'USDT') available = value;
          total += available;
          return html`[${key}]: ${value.toFixed(8)} / ${available.toFixed(2)}$ <br>`;
        })}
        <b>Available</b>${total.toFixed(2)}$
      </div>
      <div class="orders">
        <strong>Orders:</strong><br>
        ${this.accountSnapshot.orders.map((order:Order, index: number)=>{
          const {side, origQty, price, symbol} = order;
          const updatedPrice = this.prices![symbol][side];
          const percentDiff = ((updatedPrice - Number(price)) / Number(price)) * 100;
          return html`
            <div>
              [${symbol}][${side}] ${Number(origQty)} at ${Number(price)} actualPrice:${updatedPrice}<br>
              <span style="color:${percentDiff > 0? ColorsEnum.green: ColorsEnum.red}">diff:${percentDiff.toFixed(2)}%</span> 
              took:${msToTime(this.elapsedTimes[index])}
            </div><br>`
        })}
      </div>
    </div>    
  `;
  }
}
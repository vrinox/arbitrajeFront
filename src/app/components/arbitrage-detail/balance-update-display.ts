import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { BalanceUpdates, Order } from '../../core/interfaces/arbitrage.interface';

@customElement('balance-update-display')
export class BalanceUpdateDisplay extends LitElement {
  @property({ type: Object }) balanceStatus: BalanceUpdates = {} as BalanceUpdates;

  static override styles = css`
    :host {
      display: block;
      font-family: 'Roboto', sans-serif;
      margin:10px;
    }
  `;

  override render() {    
    return html`
    <div>
      ${Object.entries(this.balanceStatus).map(any => {
        const [key, balances] = any;
        return html`<b>[${key}]</b><br> ${Object.keys(balances).map(coin => html`[${coin}]: ${balances[coin]}<br>`)}<br>`
      })}
    </div>
  `;}
}
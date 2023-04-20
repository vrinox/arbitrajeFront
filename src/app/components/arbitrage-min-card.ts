import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Arbitrage } from '../entities/arbitrage.entity';
import { ArbitrageStatusEnum } from '../core/enum/arbitrage.enum';
import { ColorsEnum } from '../core/enum/colors.enum';

@customElement('arbitrage-min-card')
export class ArbitrageMinCard extends LitElement {
  @property({ type: Object }) arbitrage: Arbitrage = {} as Arbitrage;

  static override styles = css`
    :host {
      display: block;
      font-family: 'Roboto', sans-serif;
      margin:5px;
    }
    .card{
      color: white;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      padding: 16px;
      max-width: calc(50vw - 62px);
      min-width: 110px
    }
    .icon-cont{
      float: right;
      margin-top: -7px
    }
    .content{
      font-size: 2em;
      margin-top:10px;
    }
    .title{
      padding-top:5px;
      padding-bottom: 5px
    }
  `;
  printStatusIcon(){
    const icons = {
      [ArbitrageStatusEnum.REVERSED]: 'close',
      [ArbitrageStatusEnum.END]: 'check',
      [ArbitrageStatusEnum.INIT]: 'clock',
      [ArbitrageStatusEnum.ORDER_1]: 'sync',
      [ArbitrageStatusEnum.ORDER_2]: 'sync',
      [ArbitrageStatusEnum.ORDER_3]: 'sync'
    }
    return html`<i class="material-icons" aria-hidden="false" >${icons[this.arbitrage.status]}</i>`;
  }
  override render() {
    const {symbols } = this.arbitrage;
    const [ticker, intermediate] = symbols[1].split('/');
    const profitLoss = this.arbitrage.calculateRealProfit();
    return html`
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <div class='card' style="background-color:${profitLoss >= 0? ColorsEnum.green: ColorsEnum.red}">
      <div class='title'>[${intermediate}/${ticker}] 
        <div class='icon-cont'>
          ${this.printStatusIcon()}
        </div>
      </div>
      <div class="content">${profitLoss}$</div>
    </div>
  `;
  }
}
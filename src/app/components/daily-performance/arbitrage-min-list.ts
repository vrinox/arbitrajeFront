import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Arbitrage } from '../../entities/arbitrage.entity';

@customElement('arbitrage-min-list')
export class ArbitrageMinList extends LitElement {
  @property({ type: Object }) arbitrages: Arbitrage[] = [];

  static override styles = css`
    :host {
      display: block;
      font-family: 'Roboto', sans-serif;
      margin:10px;
    }
    .min-container{
      display: flex;
      width: calc(100vw -20px);
      overflow: hidden;
      flex-wrap: wrap;
    }
  `;
  handleArbitrageSelected(event: CustomEvent) {
    this.dispatchEvent(new CustomEvent('arbitrageSelected', { detail: event.detail }));
  }
  override render() {

    return html`
    <div class="min-container ">
      ${this.arbitrages.map(arbitrage => html`<arbitrage-min-card .arbitrage=${arbitrage} @arbitrageSelected=${this.handleArbitrageSelected}/>`)}
    </div>
  `;
  }
}
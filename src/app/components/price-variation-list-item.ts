// arbitrage-detail.ts
import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { PriceVariationItem } from '../interfaces/arbitrage.interface';

@customElement('price-variation-list-item')
export class PriceVariationListItem extends LitElement {
  @property({ type: Object }) priceVariationItem: PriceVariationItem = { calculated: 0, real: 0, percentDiff: 0 };

  static override styles = css`
    :host {
      display: block;
      font-family: 'Roboto', sans-serif;
      margin:10px;
    }
  `;

  override render() {
    const {calculated, real, percentDiff} = this.priceVariationItem;
    return html`
    <mat-list-item>
        <div>Calculated: ${Number(calculated)}</div>
        <div>Real: ${Number(real)}</div>
        <strong style="color: ${percentDiff >= 0 ? 'green' : 'red'}">
          Percent Difference: ${percentDiff.toFixed(2)}%
        </strong>
    </mat-list-item>
  `;
  }
}
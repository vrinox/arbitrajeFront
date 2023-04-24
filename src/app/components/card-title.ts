import { LitElement, html, css, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators.js';
import { ColorsEnum } from '../core/enum/colors.enum';

@customElement('card-title')
export class cardTitle extends LitElement {
  
  static override styles = css`
    :host {
      display: block;
      font-family: 'Roboto', sans-serif;
      color: white;
      padding: 10px;
      background-color: ${unsafeCSS(ColorsEnum.blue)}
    }
    
  `;

  override render() {
    return html`
    <slot></slot>
  `;
  }
}
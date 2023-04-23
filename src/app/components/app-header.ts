import { LitElement, html, css, unsafeCSS  } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ColorsEnum } from '../core/enum/colors.enum';
@customElement('app-header')
export class AppHeader extends LitElement {
  static override styles = css`
    :host {
      display: block;
      font-family: 'Roboto', sans-serif;      
      margin: 0px;      
      background-color: ${unsafeCSS(ColorsEnum.blue)};
    }
    div{
      padding-top:15px;
      padding-left:15px;
      height:50px;
      color:white;
      font-size: 3em;
    }
  `;

  override render() {
    return html`<div>ProfitChain</div>`;
  }
}
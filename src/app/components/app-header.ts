import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('app-header')
export class AppHeader extends LitElement {

  static override styles = css`
    :host {
      display: block;
      font-family: 'Roboto', sans-serif;      
      margin: 0px;      
      background-color: black;
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
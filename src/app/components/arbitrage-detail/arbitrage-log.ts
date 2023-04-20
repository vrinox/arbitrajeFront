import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ArbitrageLog } from '../../core/interfaces/arbitrage.interface';
import { ColorsEnum } from '../../core/enum/colors.enum';

@customElement('arbitrage-log-display')
export class ArbitrageLogDisplay extends LitElement {
  @property({ type: Object }) log: ArbitrageLog = {msg:'',step:''} 

  static override styles = css`
    :host {
      display: block;
      font-family: 'Roboto', sans-serif;
      margin:10px;
    }
  `;
  isFailed(){
    if(this.log.step === 'failed') return true;
    if(this.log.msg.includes('failed')) return true;
    return false
  }
  isComplete(){
    if(this.log.msg.includes('complete')) return true;
    return false;
  }
  isPriceLog(){
    if(this.log.msg.includes('PriceLog')) return true;
    return false;
  }
  getColor(){
    if(this.isFailed()) return ColorsEnum.red;
    if(this.isComplete()) return ColorsEnum.green;
    if(this.isPriceLog()) return '#3700b3';
    return 'black';
  }

  override render() {
    const { msg, step } = this.log;
    return html`
    <mat-list-item >
      <strong style="color: ${this.getColor()}">[${step}]</strong> ${msg}
    </mat-list-item>
  `;
  }
}
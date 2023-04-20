import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Chart, PieController, ArcElement, Legend, Tooltip } from 'chart.js';
Chart.register(PieController, ArcElement, Legend, Tooltip);

@customElement('min-donnut-chart')
export class MinDonnutChart extends LitElement {
  @property({ type: Object }) data: any;

  static override styles = css`
    :host {
      display: block;
    }
  `;
  initializeChart() {
    const { labels, data, colors } = this.data;
    const canvas: HTMLCanvasElement = this.shadowRoot?.querySelector('#chart') as HTMLCanvasElement;
    if(canvas){
      const ctx = canvas.getContext('2d');
      if (ctx) {
        new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels,
            datasets: [
              {
                data,
                backgroundColor: colors,
                borderColor: colors,
                borderWidth: 1,
              },
            ],
          },
          options: {
            plugins: {
              legend: {
                position: 'bottom',
              },
            },
          },
        });
      }
    }  
  }

  override firstUpdated() {
    this.initializeChart();
  }

  override render() {
    return html`<canvas id="chart"></canvas>`;
  }
}
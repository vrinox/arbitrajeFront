import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Chart, PieController, ArcElement, Legend, Tooltip, ChartConfiguration } from 'chart.js';
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
    let { labels, data, colors, legend } = this.data;
    let options: ChartConfiguration['options'] = {
      plugins: {
        legend: {
          position: 'bottom',
        },
      },
    };
    if (!legend) {
      options = {
        plugins: {
          legend: {
            display: false,
          },
        },
      };
    }
    if (!colors) colors = this.getRandomMaterialColors(data);
    const canvas: HTMLCanvasElement = this.shadowRoot?.querySelector('#chart') as HTMLCanvasElement;
    if (canvas) {
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
          options: options
        });
      }
    }
  }
  getRandomMaterialColors(inputArray: string[]): string[] {
    const materialColors = [
      '#F44336', // Red
      '#E91E63', // Pink
      '#9C27B0', // Purple
      '#673AB7', // Deep Purple
      '#3F51B5', // Indigo
      '#2196F3', // Blue
      '#03A9F4', // Light Blue
      '#00BCD4', // Cyan
      '#009688', // Teal
      '#4CAF50', // Green
      '#8BC34A', // Light Green
      '#CDDC39', // Lime
      '#FFEB3B', // Yellow
      '#FFC107', // Amber
      '#FF9800', // Orange
      '#FF5722', // Deep Orange
      '#795548', // Brown
      '#607D8B', // Blue Grey
    ];

    const randomColors = [];
    let prevColorIndex = -1;

    for (let i = 0; i < inputArray.length; i++) {
      let randomIndex = Math.floor(Math.random() * materialColors.length);

      // Ensure the same color is not repeated in consecutive positions
      while (randomIndex === prevColorIndex) {
        randomIndex = Math.floor(Math.random() * materialColors.length);
      }

      randomColors.push(materialColors[randomIndex]);
      prevColorIndex = randomIndex;
    }

    return randomColors;
  }

  override firstUpdated() {
    this.initializeChart();
  }

  override render() {
    return html`<canvas id="chart"></canvas>`;
  }
}
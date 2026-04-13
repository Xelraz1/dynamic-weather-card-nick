import { LitElement, html, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { getWeatherConditionIcon } from '../icons/svg-icons.js';
import { setupHorizontalScroll } from '../utils.js';
import { i18n } from '../internationalization/index.js';
import { forecastStyles } from './forecast-styles.js';
import type { WeatherForecast } from '../types.js';

export class DailyForecast extends LitElement {
  @property({ type: Array }) forecast: WeatherForecast[] = [];
  @property({ type: String }) lang: string = 'en';

  static styles = forecastStyles;

  private _cleanup: (() => void) | null = null;

  connectedCallback(): void {
    super.connectedCallback();
    this.updateComplete.then(() => {
      this._cleanup = setupHorizontalScroll(this.shadowRoot, '.forecast-scroll');
    });
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._cleanup?.();
    this._cleanup = null;
  }

  private getHighTemp(item: WeatherForecast): number {
    return Math.round(item.temperature ?? item.temp ?? item.native_temperature ?? 0);
  }

  private getLowTemp(item: WeatherForecast): number {
    return Math.round(item.templow ?? item.native_templow ?? 0);
  }

  private getPrecipitation(item: WeatherForecast): number | null {
    const precip = item.precipitation_probability ?? item.precipitation;
    return precip != null ? Math.round(precip) : null;
  }

  private formatDayName(datetime: string): string {
    if (!datetime) return '';
    const date = new Date(datetime);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleDateString(this.lang || undefined, {
      weekday: 'short'
    });
  }

  render(): TemplateResult {
    if (this.forecast.length === 0) return html``;

    return html`
      <div class="forecast-container">
        <div class="forecast-title">${i18n.t('daily_forecast_title')}</div>
        <div class="forecast-scroll">
          ${this.forecast.map(item => {
    const precipitation = this.getPrecipitation(item);
    const condition = item.condition || 'sunny';
    const highTemp = this.getHighTemp(item);
    const lowTemp = this.getLowTemp(item);

    return html`
              <div class="forecast-item">
                <div class="forecast-day">${this.formatDayName(item.datetime)}</div>
                <div class="forecast-icon">${getWeatherConditionIcon(condition)}</div>
                ${precipitation != null && precipitation > 0 ? html`
                  <div class="forecast-precip">${precipitation}%</div>
                ` : html``}
                <div class="forecast-temps">
                  <span class="temp-high">${highTemp}°</span>
                  <span class="temp-low">${lowTemp}°</span>
                </div>
              </div>
            `;
  })}
        </div>
      </div>
    `;
  }
}

customElements.define('daily-forecast', DailyForecast);

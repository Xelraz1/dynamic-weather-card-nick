import { css } from 'lit';

export const forecastStyles = css`
  :host {
    display: block;
  }

  :host([hidden]) {
    display: none;
  }

  .forecast-container {
    margin-top: 20px;
    padding-top: 20px;
    padding-bottom: 10px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    width: 100%;
  }

  .forecast-title {
    font-size: 13px;
    font-weight: 600;
    opacity: 0.7;
    margin-bottom: 16px;
    text-transform: uppercase;
    letter-spacing: 0.8px;
  }

  .forecast-scroll {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(70px, 1fr));
    gap: 12px;
    overflow-x: auto;
    overflow-y: hidden;
    padding-bottom: 8px;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
  }

  /* Show up to 5 items in a row on wider screens */
  @media (min-width: 400px) {
    .forecast-scroll {
      grid-template-columns: repeat(5, 1fr);
    }
  }

  .forecast-scroll::-webkit-scrollbar {
    height: 6px;
  }

  .forecast-scroll::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
  }

  .forecast-scroll::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 3px;
  }

  .forecast-scroll::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.5);
  }

  .forecast-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 12px 8px;
    background: rgba(255, 255, 255, 0.08);
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    transition: all 0.3s ease;
    opacity: 0;
    animation: slideIn 0.5s ease forwards;
  }

  .forecast-item:nth-child(1) { animation-delay: 0.1s; }
  .forecast-item:nth-child(2) { animation-delay: 0.15s; }
  .forecast-item:nth-child(3) { animation-delay: 0.2s; }
  .forecast-item:nth-child(4) { animation-delay: 0.25s; }
  .forecast-item:nth-child(5) { animation-delay: 0.3s; }
  .forecast-item:nth-child(6) { animation-delay: 0.35s; }
  .forecast-item:nth-child(7) { animation-delay: 0.4s; }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .forecast-item:hover {
    background: rgba(255, 255, 255, 0.12);
    transform: translateY(-2px);
  }

  .forecast-day {
    font-size: 15px;
    font-weight: 600;
    opacity: 0.9;
  }

  .forecast-icon {
    line-height: 1;
  }

  .forecast-icon svg {
    width: 40px;
    height: 40px;
    display: block;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
  }

  /* Animate the cloud icons */
  .forecast-icon svg .cloud {
    animation: cloudFloat 3s ease-in-out infinite;
  }

  @keyframes cloudFloat {
    0%, 100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-3px);
    }
  }

  .forecast-precip {
    font-size: 12px;
    font-weight: 700;
    color: #FFFFFF;
    background: rgba(0, 0, 0, 0.5);
    padding: 2px 8px;
    border-radius: 8px;
    margin-top: -4px;
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.8);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  .forecast-temps {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
  }

  .temp-high {
    font-size: 17px;
    font-weight: 600;
    opacity: 1;
  }

  .temp-low {
    font-size: 15px;
    font-weight: 500;
    opacity: 0.6;
  }

  .forecast-unavailable {
    opacity: 0.6;
    font-size: 14px;
  }
`;

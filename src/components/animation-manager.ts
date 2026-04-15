import { SunnyAnimation } from '../animations/sunny.js';
import { RainyAnimation } from '../animations/rainy.js';
import { SnowyAnimation } from '../animations/snowy.js';
import { CloudyAnimation } from '../animations/cloudy.js';
import { FoggyAnimation } from '../animations/foggy.js';
import { HailAnimation } from '../animations/hail.js';
import { ThunderstormAnimation } from '../animations/thunderstorm.js';
import type { TimeOfDay } from '../types.js';

interface Animations {
  sunny: SunnyAnimation;
  rainy: RainyAnimation;
  snowy: SnowyAnimation;
  cloudy: CloudyAnimation;
  foggy: FoggyAnimation;
  hail: HailAnimation;
  thunderstorm: ThunderstormAnimation;
}

export class AnimationManager {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private animationFrame: number | null = null;
  private animations: Partial<Animations> = {};
  private resizeObserver: ResizeObserver | null = null;
  private width: number = 0;
  private height: number = 0;
  private container: Element | null = null;
  private getDrawParams: () => { condition: string; timeOfDay: TimeOfDay } | null;
  private handleVisibilityChange = (): void => {
    if (document.hidden) {
      this.stopAnimation();
    } else {
      this.startAnimation();
    }
  };
import { BaseAnimation } from './base';
import { RainyAnimation } from './rainy';
import { TimeOfDay } from '../types';

interface LightningBolt {
  x: number;
  y: number;
  segments: { x: number; y: number }[];
  opacity: number;
  createdAt: number;
  duration: number;
}

/**
 * Thunderstorm weather animation with visible lightning bolts
 */
export class ThunderstormAnimation extends BaseAnimation {
  private rainyAnimation: RainyAnimation;
  private lightningBolts: LightningBolt[] = [];
  private lastLightningTime: number = 0;

  constructor(ctx: CanvasRenderingContext2D) {
    super(ctx);
    this.rainyAnimation = new RainyAnimation(ctx);
  }

  /**
   * Draw thunderstorm weather
   * @param time - Animation time (unused, for interface compatibility)
   * @param width - Canvas width
   * @param height - Canvas height
   * @param timeOfDay - Time of day info
   * @param withRain - Include rain flag
   */
  draw(time: number, width: number, height: number, timeOfDay: TimeOfDay, withRain: boolean = true): void {
    const currentTime = Date.now() * 0.001;

    // Dark clouds
    this.drawClouds(currentTime, width, height, 1.0);

    // Rain if specified
    if (withRain) {
      this.rainyAnimation.draw(time, width, height, timeOfDay, false);
    }

    // Lightning effects
    this.updateLightningBolts(width, height, currentTime);
    this.drawLightningBolts();
    this.drawLightningFlash(width, height, currentTime);
  }

  /**
   * Create a new lightning bolt
   */
  private createLightningBolt(width: number, height: number): LightningBolt {
    const startX = Math.random() * width;
    const startY = 0;
    
    // Create jagged lightning path
    const segments: { x: number; y: number }[] = [{ x: startX, y: startY }];
    let currentX = startX;
    let currentY = startY;
    const targetY = height * (0.3 + Math.random() * 0.4);
    const numSegments = 6 + Math.floor(Math.random() * 4);
    
    for (let i = 0; i < numSegments; i++) {
      const progress = (i + 1) / numSegments;
      currentY = startY + (targetY - startY) * progress;
      currentX += (Math.random() - 0.5) * 40;
      
      // Keep within bounds
      currentX = Math.max(20, Math.min(width - 20, currentX));
      
      segments.push({ x: currentX, y: currentY });
      
      // Sometimes add a branch
      if (Math.random() > 0.7 && i < numSegments - 1) {
        const branchLength = 2 + Math.floor(Math.random() * 3);
        let branchX = currentX;
        let branchY = currentY;
        
        for (let j = 0; j < branchLength; j++) {
          branchX += (Math.random() - 0.5) * 30;
          branchY += (targetY - startY) / numSegments * 0.5;
          segments.push({ x: branchX, y: branchY });
        }
        // Return to main path
        segments.push({ x: currentX, y: currentY });
      }
    }
    
    return {
      x: startX,
      y: startY,
      segments,
      opacity: 1,
      createdAt: Date.now() * 0.001,
      duration: 0.15 + Math.random() * 0.1 // Very brief flash
    };
  }

  /**
   * Update lightning bolt states
   */
  private updateLightningBolts(width: number, height: number, currentTime: number): void {
    // Remove old bolts
    this.lightningBolts = this.lightningBolts.filter(bolt => {
      const age = currentTime - bolt.createdAt;
      return age < bolt.duration;
    });

    // Create new lightning bolts randomly
    // Flash pattern matches the screen flash timing
    const flashPattern = Math.sin(currentTime * 2.5) * Math.sin(currentTime * 5.3) * Math.sin(currentTime * 7.1);
    const flashIntensity = Math.max(0, flashPattern);

    // Trigger lightning when flash intensity peaks
    if (flashIntensity > 0.5 && currentTime - this.lastLightningTime > 0.3) {
      this.lightningBolts.push(this.createLightningBolt(width, height));
      this.lastLightningTime = currentTime;
      
      // Sometimes create multiple bolts
      if (Math.random() > 0.7) {
        setTimeout(() => {
          this.lightningBolts.push(this.createLightningBolt(width, height));
        }, 50);
      }
    }

    // Update bolt opacity (fade out)
    this.lightningBolts.forEach(bolt => {
      const age = currentTime - bolt.createdAt;
      const fadeProgress = age / bolt.duration;
      bolt.opacity = 1 - fadeProgress;
    });
  }

  /**
   * Draw all lightning bolts
   */
  private drawLightningBolts(): void {
    this.lightningBolts.forEach(bolt => {
      if (bolt.segments.length < 2) return;

      this.ctx.save();
      this.ctx.globalAlpha = bolt.opacity;
      
      // Main bolt - bright white/yellow
      this.ctx.strokeStyle = '#FFE57F';
      this.ctx.lineWidth = 3;
      this.ctx.shadowBlur = 15;
      this.ctx.shadowColor = '#FFE57F';
      this.ctx.lineCap = 'round';
      this.ctx.lineJoin = 'round';

      this.ctx.beginPath();
      this.ctx.moveTo(bolt.segments[0].x, bolt.segments[0].y);
      
      for (let i = 1; i < bolt.segments.length; i++) {
        this.ctx.lineTo(bolt.segments[i].x, bolt.segments[i].y);
      }
      
      this.ctx.stroke();

      // Inner glow - white
      this.ctx.strokeStyle = '#FFFFFF';
      this.ctx.lineWidth = 1.5;
      this.ctx.shadowBlur = 8;
      this.ctx.shadowColor = '#FFFFFF';

      this.ctx.beginPath();
      this.ctx.moveTo(bolt.segments[0].x, bolt.segments[0].y);
      
      for (let i = 1; i < bolt.segments.length; i++) {
        this.ctx.lineTo(bolt.segments[i].x, bolt.segments[i].y);
      }
      
      this.ctx.stroke();

      this.ctx.restore();
    });
  }

  /**
   * Draw lightning flash effect (screen flash)
   * @param width - Canvas width
   * @param height - Canvas height
   * @param time - Animation time
   */
  private drawLightningFlash(width: number, height: number, time: number): void {
    // Create unpredictable flash pattern
    const flashPattern = Math.sin(time * 2.5) * Math.sin(time * 5.3) * Math.sin(time * 7.1);
    const flashIntensity = Math.max(0, flashPattern);

    // Flashes occur less frequently and more sharply
    if (flashIntensity > 0.4) {
      const normalizedIntensity = (flashIntensity - 0.4) / 0.6;
      const alpha = normalizedIntensity * 0.6;

      // Smooth fade for realistic effect
      const fadeAlpha = Math.min(alpha, Math.sin(normalizedIntensity * Math.PI) * 0.6);

      this.ctx.fillStyle = `rgba(255, 255, 255, ${fadeAlpha})`;
      this.ctx.fillRect(0, 0, width, height);
    }
  }
}

'use client';

import { useEffect, useRef, useState } from 'react';
import type { AROverlay } from '@/types';

interface ProfessionalAROverlayProps {
  detections: any[];
  overlays: AROverlay[];
}

/**
 * Professional AR Overlay Component
 * World-class AR rendering with smooth animations, depth effects, and realistic overlays
 * Inspired by HomeCourt Basketball and Google AR
 */
export default function ProfessionalAROverlay({ detections, overlays }: ProfessionalAROverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const videoElement = document.querySelector('video');
    if (!videoElement) return;

    // Set canvas size to match video
    const resizeCanvas = () => {
      canvas.width = videoElement.clientWidth;
      canvas.height = videoElement.clientHeight;
      setIsReady(true);
      console.log('✅ Professional AR Canvas Ready:', canvas.width, 'x', canvas.height);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Professional animation loop with smooth 60 FPS
    let lastTime = performance.now();
    let particleStates: any[] = [];

    const animate = (currentTime: number) => {
      if (!ctx || !canvas) return;

      const deltaTime = (currentTime - lastTime) / 1000; // Convert to seconds
      lastTime = currentTime;

      // Clear with subtle fade for motion trails
      ctx.fillStyle = 'rgba(0, 0, 0, 0.03)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (detections.length > 0 && overlays.length > 0) {
        const detection = detections[0];
        const [x, y, width, height] = detection.bbox;

        const videoWidth = videoElement.videoWidth || 640;
        const videoHeight = videoElement.videoHeight || 480;
        const scaleX = canvas.width / videoWidth;
        const scaleY = canvas.height / videoHeight;

        const scaledX = x * scaleX;
        const scaledY = y * scaleY;
        const scaledWidth = width * scaleX;
        const scaledHeight = height * scaleY;

        // Draw professional bounding box with glow effect
        drawGlowingBoundingBox(ctx, scaledX, scaledY, scaledWidth, scaledHeight);

        // Draw all overlays with professional effects
        overlays.forEach((overlay, index) => {
          drawProfessionalOverlay(
            ctx,
            overlay,
            scaledX,
            scaledY,
            scaledWidth,
            scaledHeight,
            currentTime,
            particleStates,
            index
          );
        });
      }

      requestAnimationFrame(animate);
    };

    const animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [overlays, detections]);

  const drawGlowingBoundingBox = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number
  ) => {
    // Outer glow
    ctx.shadowColor = '#00ff00';
    ctx.shadowBlur = 20;
    ctx.strokeStyle = 'rgba(0, 255, 0, 0.6)';
    ctx.lineWidth = 3;
    ctx.strokeRect(x, y, width, height);

    // Inner highlight
    ctx.shadowBlur = 0;
    ctx.strokeStyle = 'rgba(0, 255, 0, 0.9)';
    ctx.lineWidth = 2;
    ctx.strokeRect(x + 2, y + 2, width - 4, height - 4);

    // Corner markers (professional touch)
    drawCornerMarkers(ctx, x, y, width, height);
  };

  const drawCornerMarkers = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number
  ) => {
    const markerLength = 20;
    ctx.strokeStyle = '#00ff00';
    ctx.lineWidth = 4;

    // Top-left
    ctx.beginPath();
    ctx.moveTo(x, y + markerLength);
    ctx.lineTo(x, y);
    ctx.lineTo(x + markerLength, y);
    ctx.stroke();

    // Top-right
    ctx.beginPath();
    ctx.moveTo(x + width - markerLength, y);
    ctx.lineTo(x + width, y);
    ctx.lineTo(x + width, y + markerLength);
    ctx.stroke();

    // Bottom-left
    ctx.beginPath();
    ctx.moveTo(x, y + height - markerLength);
    ctx.lineTo(x, y + height);
    ctx.lineTo(x + markerLength, y + height);
    ctx.stroke();

    // Bottom-right
    ctx.beginPath();
    ctx.moveTo(x + width - markerLength, y + height);
    ctx.lineTo(x + width, y + height);
    ctx.lineTo(x + width, y + height - markerLength);
    ctx.stroke();
  };

  const drawProfessionalOverlay = (
    ctx: CanvasRenderingContext2D,
    overlay: AROverlay,
    bboxX: number,
    bboxY: number,
    bboxWidth: number,
    bboxHeight: number,
    currentTime: number,
    particleStates: any[],
    index: number
  ) => {
    const centerX = bboxX + bboxWidth / 2;
    const centerY = bboxY + bboxHeight / 2;

    switch (overlay.type) {
      case 'label':
        drawProfessionalLabel(ctx, overlay, bboxX, bboxY, bboxWidth, bboxHeight, currentTime);
        break;
      case 'arrow':
        drawAnimatedArrow(ctx, overlay, centerX, centerY, currentTime);
        break;
      case 'particles':
        drawProfessionalParticles(ctx, overlay, bboxX, bboxY, bboxWidth, bboxHeight, currentTime, particleStates, index);
        break;
      case 'vector':
        drawProfessionalVector(ctx, overlay, centerX, centerY, currentTime);
        break;
      case 'flow':
        drawFlowAnimation(ctx, overlay, centerX, centerY, bboxWidth, currentTime);
        break;
      default:
        // Fallback to basic rendering
        break;
    }
  };

  const drawProfessionalLabel = (
    ctx: CanvasRenderingContext2D,
    overlay: AROverlay,
    bboxX: number,
    bboxY: number,
    bboxWidth: number,
    bboxHeight: number,
    currentTime: number
  ) => {
    const text = overlay.label || overlay.text || '';
    const position = overlay.position || 'top';
    const color = overlay.color || '#00ff00';

    // Calculate position
    let x = bboxX + bboxWidth / 2;
    let y = bboxY - 40;

    const posMap: Record<string, [number, number]> = {
      'top': [bboxX + bboxWidth / 2, bboxY - 40],
      'top-middle': [bboxX + bboxWidth / 2, bboxY - 20],
      'bottom': [bboxX + bboxWidth / 2, bboxY + bboxHeight + 40],
      'left': [bboxX - 80, bboxY + bboxHeight / 2],
      'right': [bboxX + bboxWidth + 80, bboxY + bboxHeight / 2],
      'center': [bboxX + bboxWidth / 2, bboxY + bboxHeight / 2],
      'top-left': [bboxX - 60, bboxY - 30],
      'bottom-left': [bboxX - 60, bboxY + bboxHeight + 30],
      'bottom-right': [bboxX + bboxWidth + 60, bboxY + bboxHeight + 30],
      'front': [bboxX + bboxWidth / 2, bboxY - 50],
      'front-top': [bboxX + bboxWidth / 2, bboxY - 60],
    };

    if (typeof position === 'string' && position in posMap) {
      [x, y] = posMap[position];
    }

    // Pulsing animation
    const pulse = 1 + Math.sin(currentTime / 300) * 0.1;
    
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(pulse, pulse);

    // Professional label background with gradient
    ctx.font = 'bold 15px "SF Pro Display", -apple-system, sans-serif';
    const textWidth = ctx.measureText(text).width;
    const padding = 12;
    const labelWidth = textWidth + padding * 2;
    const labelHeight = 32;

    // Gradient background
    const gradient = ctx.createLinearGradient(-labelWidth / 2, -labelHeight / 2, labelWidth / 2, labelHeight / 2);
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0.9)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.7)');

    // Draw rounded rectangle background
    drawRoundedRect(ctx, -labelWidth / 2, -labelHeight / 2, labelWidth, labelHeight, 8);
    ctx.fillStyle = gradient;
    ctx.fill();

    // Colored border with glow
    ctx.shadowColor = color;
    ctx.shadowBlur = 15;
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Reset shadow for text
    ctx.shadowBlur = 0;

    // Draw text with subtle shadow
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 0, 0);

    // Connection line to object
    ctx.restore();
    drawConnectionLine(ctx, x, y, bboxX + bboxWidth / 2, bboxY + bboxHeight / 2, color);
  };

  const drawRoundedRect = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number
  ) => {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  };

  const drawConnectionLine = (
    ctx: CanvasRenderingContext2D,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    color: string
  ) => {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.3;
    ctx.stroke();
    ctx.globalAlpha = 1.0;
  };

  const drawAnimatedArrow = (
    ctx: CanvasRenderingContext2D,
    overlay: AROverlay,
    x: number,
    y: number,
    currentTime: number
  ) => {
    const direction = overlay.direction || 'up';
    const color = overlay.color || '#ffff00';
    const label = overlay.label || '';

    // Pulsing animation
    const pulse = 1 + Math.sin(currentTime / 200) * 0.2;
    const offset = Math.sin(currentTime / 300) * 10;

    let angle = 0;
    const angleMap: Record<string, number> = {
      'up': -Math.PI / 2,
      'down': Math.PI / 2,
      'left': Math.PI,
      'right': 0,
      'forward': -Math.PI / 2,
    };

    angle = angleMap[direction] || 0;

    const length = 70 * pulse;
    const endX = x + Math.cos(angle) * length;
    const endY = y + Math.sin(angle) * length + (direction === 'up' ? offset : direction === 'down' ? -offset : 0);

    // Draw arrow shaft with gradient
    const gradient = ctx.createLinearGradient(x, y, endX, endY);
    gradient.addColorStop(0, 'rgba(255, 255, 0, 0.3)');
    gradient.addColorStop(1, color);

    ctx.strokeStyle = gradient;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(endX, endY);
    ctx.stroke();

    // Draw arrowhead
    const headLength = 20;
    const headAngle = Math.PI / 6;

    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.moveTo(endX, endY);
    ctx.lineTo(
      endX - headLength * Math.cos(angle - headAngle),
      endY - headLength * Math.sin(angle - headAngle)
    );
    ctx.lineTo(
      endX - headLength * Math.cos(angle + headAngle),
      endY - headLength * Math.sin(angle + headAngle)
    );
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;

    // Draw label if present
    if (label) {
      ctx.font = 'bold 13px sans-serif';
      ctx.fillStyle = color;
      ctx.textAlign = 'center';
      ctx.fillText(label, endX, endY - 25);
    }
  };

  const drawProfessionalParticles = (
    ctx: CanvasRenderingContext2D,
    overlay: AROverlay,
    bboxX: number,
    bboxY: number,
    bboxWidth: number,
    bboxHeight: number,
    currentTime: number,
    particleStates: any[],
    index: number
  ) => {
    const color = overlay.color || 'rgba(0, 255, 0, 0.5)';
    const particleCount = 30;

    // Initialize particles if not exists
    if (!particleStates[index]) {
      particleStates[index] = [];
      for (let i = 0; i < particleCount; i++) {
        particleStates[index].push({
          x: bboxX + Math.random() * bboxWidth,
          y: bboxY + Math.random() * bboxHeight,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          life: Math.random(),
        });
      }
    }

    const particles = particleStates[index];

    // Update and draw particles
    particles.forEach((particle: any) => {
      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.life -= 0.01;

      // Reset if out of bounds or dead
      if (
        particle.life <= 0 ||
        particle.x < bboxX ||
        particle.x > bboxX + bboxWidth ||
        particle.y < bboxY ||
        particle.y > bboxY + bboxHeight
      ) {
        particle.x = bboxX + Math.random() * bboxWidth;
        particle.y = bboxY + Math.random() * bboxHeight;
        particle.life = 1;
      }

      // Draw particle with gradient
      const gradient = ctx.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, 8);
      gradient.addColorStop(0, color.replace('0.5', String(particle.life * 0.8)));
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, 6 * particle.life, 0, Math.PI * 2);
      ctx.fill();
    });
  };

  const drawProfessionalVector = (
    ctx: CanvasRenderingContext2D,
    overlay: AROverlay,
    x: number,
    y: number,
    currentTime: number
  ) => {
    const rotation = (currentTime / 1000) % (Math.PI * 2);
    const length = 60;
    const color = overlay.color || '#ff0000';

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);

    // Draw vector with glow
    ctx.strokeStyle = color;
    ctx.lineWidth = 4;
    ctx.shadowColor = color;
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(length, 0);
    ctx.stroke();

    // Arrowhead
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(length, 0);
    ctx.lineTo(length - 15, -8);
    ctx.lineTo(length - 15, 8);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  };

  const drawFlowAnimation = (
    ctx: CanvasRenderingContext2D,
    overlay: AROverlay,
    x: number,
    y: number,
    width: number,
    currentTime: number
  ) => {
    const color = overlay.color || '#00ffff';
    const offset = (currentTime / 50) % 15;

    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.setLineDash([10, 5]);
    ctx.lineDashOffset = -offset;
    ctx.shadowColor = color;
    ctx.shadowBlur = 10;

    ctx.beginPath();
    ctx.arc(x, y, width / 3, 0, Math.PI * 2);
    ctx.stroke();

    ctx.setLineDash([]);
    ctx.shadowBlur = 0;
  };

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 25 }}
    />
  );
}

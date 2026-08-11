/**
 * particles.js - Live Interactive ASCII Waves + Left 20% Filter + White Fade Mask + Heavy Right Density
 * Drapiar IT SaaS Premium Design - Pristine Text Readability & Heavy Right-Side Wave Load
 */

(function () {
  'use strict';

  const CANVAS_ID = 'heroCanvas';
  const RAMP = ' .:-=+*#%@WMB8&';
  const CELL = 11;

  let canvas, ctx;
  let animationFrameId = null;
  let cols = 0, rows = 0;
  let width = 0, height = 0;
  let dpr = 1;

  let mouseX = -9999, mouseY = -9999;
  let targetMouseX = -9999, targetMouseY = -9999;
  let time = 0;

  // Offscreen canvas for generating tactile film grain
  let noiseCanvas, noiseCtx;

  function generateNoiseTexture() {
    noiseCanvas = document.createElement('canvas');
    noiseCanvas.width = 192;
    noiseCanvas.height = 192;
    noiseCtx = noiseCanvas.getContext('2d');

    const imgData = noiseCtx.createImageData(192, 192);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
      // Balanced tactile micro-grain noise (0..25)
      const noiseVal = Math.floor(Math.random() * 25);
      data[i] = 15;       // Neutral Dark Red
      data[i + 1] = 20;   // Neutral Dark Green
      data[i + 2] = 35;   // Neutral Dark Blue
      data[i + 3] = noiseVal; // Alpha grain (0..30)
    }
    noiseCtx.putImageData(imgData, 0, 0);
  }

  function initCanvas() {
    canvas = document.getElementById(CANVAS_ID) || document.getElementById('ascii-bg');
    if (!canvas) return false;

    ctx = canvas.getContext('2d');
    generateNoiseTexture();
    resizeCanvas();
    return true;
  }

  function resizeCanvas() {
    if (!canvas) return;
    const hero = document.querySelector('.hero') || canvas.parentElement;
    const rect = hero ? hero.getBoundingClientRect() : canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);

    width = rect.width || window.innerWidth;
    height = rect.height || 640;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    cols = Math.ceil(width / CELL);
    rows = Math.ceil(height / CELL);

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
    ctx.font = `bold ${CELL}px "Space Mono", monospace`;
    ctx.textBaseline = 'top';
  }

  // Multi-frequency wave noise
  function noise(x, y, t) {
    return (
      Math.sin(x * 0.14 + t * 1.4) +
      Math.cos(y * 0.18 - t * 1.1) +
      Math.sin((x * 0.7 + y * 0.9) * 0.08 + t * 0.8) +
      Math.cos((x * 0.3 - y * 0.4) * 0.12 + t * 0.6)
    ) / 4;
  }

  function renderFrame() {
    time += 0.024;

    // Instant Cursor Tracking (0.85 lerp speed)
    mouseX += (targetMouseX - mouseX) * 0.85;
    mouseY += (targetMouseY - mouseY) * 0.85;

    // 1. Crisp White Base Background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);

    // 2. Capa de Resplandor Ambiental (Únicamente en Bordes Derechos)
    const isMobile = width < 768;
    
    // Top-Right Edge Glow
    const topRightGlow = ctx.createRadialGradient(width, 0, 20, width, 0, 480);
    topRightGlow.addColorStop(0, 'rgba(0, 75, 255, 0.20)');
    topRightGlow.addColorStop(0.5, 'rgba(0, 10, 156, 0.06)');
    topRightGlow.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.fillStyle = topRightGlow;
    ctx.fillRect(0, 0, width, height);

    // Bottom-Right Edge Glow
    const bottomRightGlow = ctx.createRadialGradient(width, height, 20, width, height, 480);
    bottomRightGlow.addColorStop(0, 'rgba(0, 75, 255, 0.18)');
    bottomRightGlow.addColorStop(0.5, 'rgba(0, 10, 156, 0.05)');
    bottomRightGlow.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.fillStyle = bottomRightGlow;
    ctx.fillRect(0, 0, width, height);

    // 3. Dense ASCII Wave Matrix (Zero density on left 20% text side, Heavy load on right)
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const px = col * CELL;
        const py = row * CELL;

        const colRatio = col / cols;

        // Strict Left 20% Zero Bias: No wave rendering on the first 20% of canvas width
        if (colRatio < 0.20 && !isMobile) continue;

        // Exponential right side bias ramping up smoothly from 20% towards 100%
        const rightBias = Math.pow(Math.max(0, colRatio - 0.15) / 0.85, 1.1);

        const dx = px - mouseX;
        const dy = py - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const ripple = Math.max(0, 1 - dist / 360);

        const waveVal = (noise(col, row, time) + 1) / 2;

        let intensity = (waveVal * 1.5 + ripple * 0.9) * (rightBias * 1.5);
        intensity = Math.min(1, Math.max(0, intensity));

        if (intensity < 0.035) continue;

        const charIndex = Math.floor(intensity * (RAMP.length - 1));
        const char = RAMP[charIndex];

        // High-Contrast Drapiar Primary Blue opacity on right side waves
        const opacity = (0.48 + intensity * 0.52 + ripple * 0.45) * (rightBias * 0.92);
        ctx.fillStyle = `rgba(0, 10, 156, ${Math.min(1, opacity).toFixed(3)})`;

        ctx.fillText(char, px, py);
      }
    }

    // 4. White Horizontal Gradient Overlay Mask (Smooth transition from 20% to right side)
    if (!isMobile) {
      const whiteFadeGradient = ctx.createLinearGradient(0, 0, width * 0.55, 0);
      whiteFadeGradient.addColorStop(0, '#FFFFFF');
      whiteFadeGradient.addColorStop(0.20, 'rgba(255, 255, 255, 0.98)');
      whiteFadeGradient.addColorStop(0.48, 'rgba(255, 255, 255, 0.45)');
      whiteFadeGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.fillStyle = whiteFadeGradient;
      ctx.fillRect(0, 0, width, height);
    }

    // 5. Tactile Fine Grain Noise Overlay Layer
    if (noiseCanvas) {
      const pattern = ctx.createPattern(noiseCanvas, 'repeat');
      if (pattern) {
        ctx.fillStyle = pattern;
        ctx.fillRect(0, 0, width, height);
      }
    }
  }

  function animate() {
    if (document.visibilityState === 'hidden') {
      animationFrameId = requestAnimationFrame(animate);
      return;
    }

    renderFrame();
    animationFrameId = requestAnimationFrame(animate);
  }

  function start() {
    if (!initCanvas()) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      renderFrame();
      return;
    }

    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
    animate();
  }

  function updateMousePos(e) {
    if (!canvas) return;
    const hero = document.querySelector('.hero') || canvas;
    const rect = hero.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    if (clientX >= 0 && clientX <= rect.width && clientY >= 0 && clientY <= rect.height) {
      targetMouseX = clientX;
      targetMouseY = clientY;
      if (mouseX < -1000) {
        mouseX = clientX;
        mouseY = clientY;
      }
    } else {
      targetMouseX = -9999;
      targetMouseY = -9999;
    }
  }

  window.addEventListener('mousemove', updateMousePos, { passive: true });

  window.addEventListener('mouseleave', () => {
    targetMouseX = -9999;
    targetMouseY = -9999;
  });

  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }

  window.addEventListener('resize', () => {
    resizeCanvas();
  });
})();

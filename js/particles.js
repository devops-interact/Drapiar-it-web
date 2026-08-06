/**
 * particles.js - Live Interactive ASCII Matrix Waves
 * DrapiarIT SaaS Premium Design - High-Contrast Brand Blue ASCII Waves
 */

(function () {
  'use strict';

  const CANVAS_ID = 'heroCanvas';
  const RAMP = ' .:-=+*#%@';
  const CELL = 12; // 12px font cell size for crisp detail

  let canvas, ctx;
  let animationFrameId = null;
  let cols = 0, rows = 0;
  let width = 0, height = 0;
  let dpr = 1;

  let mouseX = -9999, mouseY = -9999;
  let targetMouseX = -9999, targetMouseY = -9999;
  let time = 0;

  function initCanvas() {
    canvas = document.getElementById(CANVAS_ID) || document.getElementById('ascii-bg');
    if (!canvas) return false;

    ctx = canvas.getContext('2d');
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

  const RAMP = ' .:-=+*#%@WMB8&';

  function noise(x, y, t) {
    return (
      Math.sin(x * 0.12 + t * 1.2) +
      Math.cos(y * 0.15 - t * 0.9) +
      Math.sin((x * 0.8 + y) * 0.07 + t * 0.6)
    ) / 3;
  }

  function renderFrame() {
    time += 0.022; // Fluid wave motion speed

    // Smooth lerp towards target mouse coordinates
    mouseX += (targetMouseX - mouseX) * 0.15;
    mouseY += (targetMouseY - mouseY) * 0.15;

    // Clear background with crisp white
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const px = col * CELL;
        const py = row * CELL;

        const dx = px - mouseX;
        const dy = py - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const ripple = Math.max(0, 1 - dist / 350);

        // Spatial weighting: smooth gradient concentrating wave density heavily on the right side
        const colRatio = col / cols;
        const rightBias = Math.pow(colRatio, 0.7);

        // Ambient noise wave value (0.0 to 1.0)
        const waveVal = (noise(col, row, time) + 1) / 2;

        let intensity = (waveVal * 1.1 + ripple * 0.7) * (0.2 + rightBias * 1.1);
        intensity = Math.min(1, Math.max(0, intensity));

        if (intensity < 0.04) continue;

        const charIndex = Math.floor(intensity * (RAMP.length - 1));
        const char = RAMP[charIndex];

        // Vivid & High-Contrast Drapiar IT Primary Blue (rgb(0, 10, 156))
        const opacity = (0.32 + intensity * 0.65 + ripple * 0.4) * (0.35 + rightBias * 0.65);
        ctx.fillStyle = `rgba(0, 10, 156, ${Math.min(1, opacity).toFixed(3)})`;

        ctx.fillText(char, px, py);
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

  // Mouse Interactivity (Window level)
  window.addEventListener('mousemove', (e) => {
    if (!canvas) return;
    const hero = document.querySelector('.hero') || canvas;
    const rect = hero.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    if (clientX >= 0 && clientX <= rect.width && clientY >= 0 && clientY <= rect.height) {
      targetMouseX = clientX;
      targetMouseY = clientY;
    } else {
      targetMouseX = -9999;
      targetMouseY = -9999;
    }
  });

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

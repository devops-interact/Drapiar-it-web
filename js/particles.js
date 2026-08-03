/**
 * particles.js - Interactive ASCII Matrix Canvas Animation + Image Sampling
 * DrapiarIT SaaS Premium Design - Font CELL size 13px
 */

(function () {
  'use strict';

  const CANVAS_ID = 'heroCanvas';
  const RAMP = ' .:-=+*#%@';
  const CELL = 13; // Larger ASCII character cell size as requested

  let canvas, ctx;
  let animationFrameId = null;
  let cols = 0, rows = 0;
  let width = 0, height = 0;
  let dpr = 1;

  let mouseX = -9999, mouseY = -9999;
  let targetMouseX = -9999, targetMouseY = -9999;
  let time = 0;

  // Offscreen sampling canvas for image pixel reading
  const sampleCanvas = document.createElement('canvas');
  const sampleCtx = sampleCanvas.getContext('2d', { willReadFrequently: true });

  let img = null;
  let imgData = null;

  function initCanvas() {
    canvas = document.getElementById(CANVAS_ID) || document.getElementById('ascii-bg');
    if (!canvas) return false;

    ctx = canvas.getContext('2d');
    resizeCanvas();

    // Auto-load hero background image from images/hero/ directory
    const heroSrc = canvas.getAttribute('data-hero-image') || 'images/hero/hero-main.png';
    const autoImg = new Image();
    autoImg.onload = () => {
      img = autoImg;
      sampleImage();
    };
    autoImg.src = heroSrc;

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
    ctx.font = `${CELL}px "Space Mono", monospace`;
    ctx.textBaseline = 'top';

    if (img) sampleImage();
  }

  function sampleImage() {
    if (!img) return;
    sampleCanvas.width = cols;
    sampleCanvas.height = rows;

    const imgRatio = img.width / img.height;
    const gridRatio = cols / rows;
    let sx, sy, sw, sh;

    if (imgRatio > gridRatio) {
      sh = img.height;
      sw = sh * gridRatio;
      sx = (img.width - sw) / 2;
      sy = 0;
    } else {
      sw = img.width;
      sh = sw / gridRatio;
      sx = 0;
      sy = (img.height - sh) / 2;
    }

    sampleCtx.drawImage(img, sx, sy, sw, sh, 0, 0, cols, rows);
    imgData = sampleCtx.getImageData(0, 0, cols, rows).data;
  }

  function noise(x, y, t) {
    return (
      Math.sin(x * 0.15 + t) +
      Math.sin(y * 0.12 - t * 0.8) +
      Math.sin((x + y) * 0.08 + t * 0.5)
    ) / 3;
  }

  function renderFrame() {
    time += 0.015;

    mouseX += (targetMouseX - mouseX) * 0.15;
    mouseY += (targetMouseY - mouseY) * 0.15;

    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, width, height);

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const px = col * CELL;
        const py = row * CELL;

        const dx = px - mouseX;
        const dy = py - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const ripple = Math.max(0, 1 - dist / 280);

        let r = 200, g = 200, b = 200, brightness01;

        if (imgData) {
          const idx = (row * cols + col) * 4;
          r = imgData[idx];
          g = imgData[idx + 1];
          b = imgData[idx + 2];
          brightness01 = (r * 0.299 + g * 0.587 + b * 0.114) / 255;
        } else {
          brightness01 = (noise(col, row, time) + 1) / 2;
        }

        let intensity = brightness01 * 0.85 + ripple * 0.6;
        intensity = Math.min(1, intensity);

        if (intensity < 0.03) continue;

        const charIndex = Math.floor(intensity * (RAMP.length - 1));
        const char = RAMP[charIndex];

        if (imgData) {
          const boost = 1 + ripple * 0.8;
          const cr = Math.min(255, r * boost);
          const cg = Math.min(255, g * boost);
          const cb = Math.min(255, b * boost);
          ctx.fillStyle = `rgb(${cr}, ${cg}, ${cb})`;
        } else {
          const brightness = Math.floor(60 + intensity * 195);
          ctx.fillStyle = `rgb(${brightness}, ${brightness}, ${brightness})`;
        }

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

  // Mouse & Drag events
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

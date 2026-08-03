/**
 * particles.js - Halftone Dot Matrix Canvas Shader + Interactive Mouse Ripple
 * DrapiarIT SaaS Premium Design - Electric Blue Halftone Vector Grid
 */

(function () {
  'use strict';

  const CANVAS_ID = 'heroCanvas';
  const SPACING = 14;     // Distance in px between dot centers
  const MIN_RADIUS = 1.2; // Minimum dot radius
  const MAX_RADIUS = 6.0; // Maximum dot radius

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

    cols = Math.ceil(width / SPACING);
    rows = Math.ceil(height / SPACING);

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);

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

  function noiseTerrain(col, row, t) {
    // Multi-octave wave superposition for terrain / ridge contours
    const wave1 = Math.sin(col * 0.07 + t * 0.5) * Math.cos(row * 0.08 + t * 0.4);
    const wave2 = Math.sin((col + row) * 0.05 - t * 0.6);
    const wave3 = Math.cos(col * 0.11 - row * 0.09 + t * 0.7);
    return (wave1 + wave2 + wave3) / 3;
  }

  function renderFrame() {
    time += 0.012;

    // Smooth mouse lerp
    mouseX += (targetMouseX - mouseX) * 0.15;
    mouseY += (targetMouseY - mouseY) * 0.15;

    // Electric Brand Blue Background fill (matching reference image)
    ctx.fillStyle = '#004BF6';
    ctx.fillRect(0, 0, width, height);

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const px = col * SPACING + SPACING / 2;
        const py = row * SPACING + SPACING / 2;

        const dx = px - mouseX;
        const dy = py - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const mouseRipple = Math.max(0, 1 - dist / 300); // 300px ripple radius

        let baseBrightness = 0.5;

        if (imgData) {
          const idx = (row * cols + col) * 4;
          const r = imgData[idx];
          const g = imgData[idx + 1];
          const b = imgData[idx + 2];
          baseBrightness = (r * 0.299 + g * 0.587 + b * 0.114) / 255;
        } else {
          baseBrightness = (noiseTerrain(col, row, time) + 1) / 2;
        }

        let intensity = baseBrightness * 0.65 + mouseRipple * 0.65;
        intensity = Math.min(1, Math.max(0, intensity));

        // Calculate dot radius and opacity
        const radius = MIN_RADIUS + intensity * (MAX_RADIUS - MIN_RADIUS);
        const alpha = 0.3 + intensity * 0.7;

        // Draw crisp white halftone circle dot
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(px, py, radius, 0, Math.PI * 2);
        ctx.fill();
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

  // Mouse Interactivity
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

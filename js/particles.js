/**
 * particles.js - Interactive ASCII Matrix Canvas Animation + Image Converter
 * DrapiarIT SaaS Premium Design
 */

(function () {
  'use strict';

  const CANVAS_ID = 'heroCanvas';
  const RAMP = ' .:-=+*#%@';
  const CELL = 11;

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

  function loadImageFile(file) {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const image = new Image();
      image.onload = () => {
        img = image;
        sampleImage();
      };
      image.src = e.target.result;
    };
    reader.readAsDataURL(file);
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

    ctx.clearRect(0, 0, width, height);

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const px = col * CELL;
        const py = row * CELL;

        const dx = px - mouseX;
        const dy = py - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const ripple = Math.max(0, 1 - dist / 280);

        let r = 0, g = 10, b = 156, brightness01;

        if (imgData) {
          const idx = (row * cols + col) * 4;
          r = imgData[idx];
          g = imgData[idx + 1];
          b = imgData[idx + 2];
          brightness01 = (r * 0.299 + g * 0.587 + b * 0.114) / 255;
        } else {
          brightness01 = (noise(col, row, time) + 1) / 2;
        }

        let intensity = brightness01 * 0.65 + ripple * 0.75;
        intensity = Math.min(1, intensity);

        if (intensity < 0.04) continue;

        const charIndex = Math.floor(intensity * (RAMP.length - 1));
        const char = RAMP[charIndex];

        if (imgData) {
          const boost = 1 + ripple * 0.8;
          const cr = Math.min(255, r * boost);
          const cg = Math.min(255, g * boost);
          const cb = Math.min(255, b * boost);
          ctx.fillStyle = `rgb(${cr}, ${cg}, ${cb})`;
        } else {
          // Brand Primary Blue tint (rgb(0, 10, 156)) with dynamic opacity
          const opacity = 0.04 + intensity * 0.35 + ripple * 0.45;
          ctx.fillStyle = `rgba(0, 10, 156, ${opacity.toFixed(3)})`;
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

  window.addEventListener('dragover', (e) => e.preventDefault());
  window.addEventListener('drop', (e) => {
    e.preventDefault();
    if (e.dataTransfer && e.dataTransfer.files[0]) {
      loadImageFile(e.dataTransfer.files[0]);
    }
  });

  const fileInput = document.getElementById('file-input');
  const uploadBtn = document.getElementById('upload-btn');

  if (uploadBtn && fileInput) {
    uploadBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => {
      if (e.target.files[0]) loadImageFile(e.target.files[0]);
    });
  }

  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }

  window.addEventListener('resize', () => {
    resizeCanvas();
  });
})();

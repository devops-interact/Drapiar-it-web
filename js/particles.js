/**
 * particles.js - Live Interactive ASCII Waves + Hero & Footer Canvas Effects
 * Drapiar IT SaaS Premium Design - Pristine Readability & 45-degree Top-Right Footer Wave
 */

(function () {
  'use strict';

  const HERO_CANVAS_ID = 'heroCanvas';
  const RAMP = ' .:-=+*#%@WMB8&';
  const CELL = 11;

  // Hero Canvas variables
  let heroCanvas, heroCtx;
  let heroAnimationId = null;
  let heroCols = 0, heroRows = 0;
  let heroWidth = 0, heroHeight = 0;
  let heroDpr = 1;
  let heroMouseX = -9999, heroMouseY = -9999;
  let heroTargetMouseX = -9999, heroTargetMouseY = -9999;
  let heroTime = 0;

  // Footer Canvas variables
  let footerCanvas, footerCtx;
  let footerCols = 0, footerRows = 0;
  let footerWidth = 0, footerHeight = 0;
  let footerTime = 0;
  let footerMouseX = -9999, footerMouseY = -9999;
  let footerTargetMouseX = -9999, footerTargetMouseY = -9999;

  // Offscreen canvas for tactile film grain
  let noiseCanvas, noiseCtx;

  function generateNoiseTexture() {
    noiseCanvas = document.createElement('canvas');
    noiseCanvas.width = 192;
    noiseCanvas.height = 192;
    noiseCtx = noiseCanvas.getContext('2d');

    const imgData = noiseCtx.createImageData(192, 192);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
      const noiseVal = Math.floor(Math.random() * 25);
      data[i] = 15;
      data[i + 1] = 20;
      data[i + 2] = 35;
      data[i + 3] = noiseVal;
    }
    noiseCtx.putImageData(imgData, 0, 0);
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

  /* ==========================================
     HERO ASCII CANVAS LOGIC
     ========================================== */
  function initHeroCanvas() {
    heroCanvas = document.getElementById(HERO_CANVAS_ID) || document.getElementById('ascii-bg');
    if (!heroCanvas) return false;

    heroCtx = heroCanvas.getContext('2d');
    resizeHeroCanvas();
    return true;
  }

  function resizeHeroCanvas() {
    if (!heroCanvas) return;
    const hero = document.querySelector('.hero') || heroCanvas.parentElement;
    const rect = hero ? hero.getBoundingClientRect() : heroCanvas.getBoundingClientRect();
    heroDpr = Math.min(window.devicePixelRatio || 1, 2);

    heroWidth = rect.width || window.innerWidth;
    heroHeight = rect.height || 640;

    heroCanvas.width = heroWidth * heroDpr;
    heroCanvas.height = heroHeight * heroDpr;
    heroCanvas.style.width = `${heroWidth}px`;
    heroCanvas.style.height = `${heroHeight}px`;

    heroCols = Math.ceil(heroWidth / CELL);
    heroRows = Math.ceil(heroHeight / CELL);

    heroCtx.setTransform(1, 0, 0, 1, 0, 0);
    heroCtx.scale(heroDpr, heroDpr);
    heroCtx.font = `bold ${CELL}px "Space Mono", monospace`;
    heroCtx.textBaseline = 'top';
  }

  function renderHeroFrame() {
    if (!heroCtx) return;
    heroTime += 0.024;

    heroMouseX += (heroTargetMouseX - heroMouseX) * 0.85;
    heroMouseY += (heroTargetMouseY - heroMouseY) * 0.85;

    // 1. Crisp White Base Background
    heroCtx.fillStyle = '#FFFFFF';
    heroCtx.fillRect(0, 0, heroWidth, heroHeight);

    const isMobile = heroWidth < 768;

    // 2. Full-Width Balanced Glows across entire Hero
    const centerGlow = heroCtx.createRadialGradient(heroWidth * 0.5, heroHeight * 0.5, 50, heroWidth * 0.5, heroHeight * 0.5, Math.max(heroWidth * 0.6, 600));
    centerGlow.addColorStop(0, 'rgba(0, 10, 156, 0.08)');
    centerGlow.addColorStop(0.5, 'rgba(0, 75, 255, 0.04)');
    centerGlow.addColorStop(1, 'rgba(255, 255, 255, 0)');

    heroCtx.fillStyle = centerGlow;
    heroCtx.fillRect(0, 0, heroWidth, heroHeight);

    const topLeftGlow = heroCtx.createRadialGradient(0, 0, 20, 0, 0, 550);
    topLeftGlow.addColorStop(0, 'rgba(0, 75, 255, 0.18)');
    topLeftGlow.addColorStop(0.5, 'rgba(0, 10, 156, 0.05)');
    topLeftGlow.addColorStop(1, 'rgba(255, 255, 255, 0)');

    heroCtx.fillStyle = topLeftGlow;
    heroCtx.fillRect(0, 0, heroWidth, heroHeight);

    const topRightGlow = heroCtx.createRadialGradient(heroWidth, 0, 20, heroWidth, 0, 550);
    topRightGlow.addColorStop(0, 'rgba(0, 75, 255, 0.18)');
    topRightGlow.addColorStop(0.5, 'rgba(0, 10, 156, 0.05)');
    topRightGlow.addColorStop(1, 'rgba(255, 255, 255, 0)');

    heroCtx.fillStyle = topRightGlow;
    heroCtx.fillRect(0, 0, heroWidth, heroHeight);

    // 3. Full-Width ASCII Wave Matrix across entire hero
    for (let row = 0; row < heroRows; row++) {
      for (let col = 0; col < heroCols; col++) {
        const px = col * CELL;
        const py = row * CELL;

        const dx = px - heroMouseX;
        const dy = py - heroMouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const ripple = Math.max(0, 1 - dist / 360);

        const waveVal = (noise(col, row, heroTime) + 1) / 2;

        let intensity = (waveVal * 1.5 + ripple * 0.8);
        intensity = Math.min(1, Math.max(0, intensity));

        const charIndex = Math.floor(intensity * (RAMP.length - 1));
        const char = RAMP[charIndex];

        const opacity = (0.28 + intensity * 0.65 + ripple * 0.45);
        heroCtx.fillStyle = `rgba(0, 10, 156, ${Math.min(1, opacity).toFixed(3)})`;

        heroCtx.fillText(char, px, py);
      }
    }

    // 5. Tactile Film Grain
    if (noiseCanvas) {
      const pattern = heroCtx.createPattern(noiseCanvas, 'repeat');
      if (pattern) {
        heroCtx.fillStyle = pattern;
        heroCtx.fillRect(0, 0, heroWidth, heroHeight);
      }
    }
  }

  /* ==========================================
     FOOTER ASCII CANVAS LOGIC (Fondo Azul + ASCII Gris Casi Blanco a 45° en Esquina Superior Derecha)
     ========================================== */
  function initFooterCanvas() {
    const footerElem = document.querySelector('.footer');
    if (!footerElem) return false;

    footerCanvas = document.getElementById('footerCanvas');
    if (!footerCanvas) {
      footerCanvas = document.createElement('canvas');
      footerCanvas.id = 'footerCanvas';
      footerElem.insertBefore(footerCanvas, footerElem.firstChild);
    }

    footerCtx = footerCanvas.getContext('2d');
    resizeFooterCanvas();
    return true;
  }

  function resizeFooterCanvas() {
    if (!footerCanvas) return;
    const footerElem = document.querySelector('.footer');
    const rect = footerElem ? footerElem.getBoundingClientRect() : footerCanvas.getBoundingClientRect();
    const footerDpr = Math.min(window.devicePixelRatio || 1, 2);

    footerWidth = rect.width || window.innerWidth;
    footerHeight = rect.height || 400;

    footerCanvas.width = footerWidth * footerDpr;
    footerCanvas.height = footerHeight * footerDpr;
    footerCanvas.style.width = `${footerWidth}px`;
    footerCanvas.style.height = `${footerHeight}px`;

    footerCols = Math.ceil(footerWidth / CELL);
    footerRows = Math.ceil(footerHeight / CELL);

    footerCtx.setTransform(1, 0, 0, 1, 0, 0);
    footerCtx.scale(footerDpr, footerDpr);
    footerCtx.font = `bold ${CELL}px "Space Mono", monospace`;
    footerCtx.textBaseline = 'top';
  }

  function renderFooterFrame() {
    if (!footerCtx) return;
    footerTime += 0.02;

    footerMouseX += (footerTargetMouseX - footerMouseX) * 0.85;
    footerMouseY += (footerTargetMouseY - footerMouseY) * 0.85;

    // 1. Solid Primary Blue Base (#000A9C)
    footerCtx.fillStyle = '#000A9C';
    footerCtx.fillRect(0, 0, footerWidth, footerHeight);

    // 2. Resplandor sutil en la esquina superior derecha
    const topRightGlow = footerCtx.createRadialGradient(footerWidth, 0, 10, footerWidth, 0, Math.max(footerWidth * 0.55, 420));
    topRightGlow.addColorStop(0, 'rgba(0, 140, 255, 0.22)');
    topRightGlow.addColorStop(0.5, 'rgba(0, 50, 180, 0.08)');
    topRightGlow.addColorStop(1, 'rgba(0, 10, 156, 0)');

    footerCtx.fillStyle = topRightGlow;
    footerCtx.fillRect(0, 0, footerWidth, footerHeight);

    // 3. ASCII Matrix inclinado a 45 grados y denso hacia la esquina superior derecha
    for (let row = 0; row < footerRows; row++) {
      for (let col = 0; col < footerCols; col++) {
        const px = col * CELL;
        const py = row * CELL;

        const colRatio = col / footerCols;         // 0 (izq) -> 1 (der)
        const rowRatio = row / footerRows;         // 0 (arriba) -> 1 (abajo)
        const invRowRatio = 1 - rowRatio;          // 1 (arriba) -> 0 (abajo)

        // Proyección a 45 grados cargada hacia la esquina superior derecha
        const diagRatio = (colRatio * 0.65 + invRowRatio * 0.35);
        const topRightBias = Math.pow(diagRatio, 1.35);

        if (topRightBias < 0.12) continue;

        const dx = px - footerMouseX;
        const dy = py - footerMouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const ripple = Math.max(0, 1 - dist / 300);

        // Ondas con inclinación de 45 grados (x+y y x-y)
        const waveVal = (noise(col * 0.75 + row * 0.75, col * 0.75 - row * 0.75, footerTime) + 1) / 2;

        let intensity = (waveVal * 1.4 + ripple * 0.8) * (topRightBias * 1.35);
        intensity = Math.min(1, Math.max(0, intensity));

        if (intensity < 0.04) continue;

        const charIndex = Math.floor(intensity * (RAMP.length - 1));
        const char = RAMP[charIndex];

        // Color Gris Casi Blanco (#E2E8F0) para alto contraste en fondo azul
        const opacity = (0.35 + intensity * 0.55 + ripple * 0.45) * (topRightBias * 0.85);
        footerCtx.fillStyle = `rgba(226, 232, 240, ${Math.min(0.90, opacity).toFixed(3)})`;

        footerCtx.fillText(char, px, py);
      }
    }

    // 4. Micro-textura de grano analógico
    if (noiseCanvas) {
      const pattern = footerCtx.createPattern(noiseCanvas, 'repeat');
      if (pattern) {
        footerCtx.fillStyle = pattern;
        footerCtx.fillRect(0, 0, footerWidth, footerHeight);
      }
    }
  }

  /* ==========================================
     MAIN ANIMATION LOOP & EVENTS
     ========================================== */
  function renderAll() {
    renderHeroFrame();
    renderFooterFrame();
  }

  function animate() {
    if (document.visibilityState === 'hidden') {
      heroAnimationId = requestAnimationFrame(animate);
      return;
    }

    renderAll();
    heroAnimationId = requestAnimationFrame(animate);
  }

  function start() {
    generateNoiseTexture();
    const hasHero = initHeroCanvas();
    const hasFooter = initFooterCanvas();

    if (!hasHero && !hasFooter) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      renderAll();
      return;
    }

    if (heroAnimationId) {
      cancelAnimationFrame(heroAnimationId);
    }
    animate();
  }

  function updateMousePos(e) {
    if (heroCanvas) {
      const hero = document.querySelector('.hero') || heroCanvas;
      const rect = hero.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;

      if (clientX >= 0 && clientX <= rect.width && clientY >= 0 && clientY <= rect.height) {
        heroTargetMouseX = clientX;
        heroTargetMouseY = clientY;
        if (heroMouseX < -1000) {
          heroMouseX = clientX;
          heroMouseY = clientY;
        }
      } else {
        heroTargetMouseX = -9999;
        heroTargetMouseY = -9999;
      }
    }

    if (footerCanvas) {
      const footerElem = document.querySelector('.footer') || footerCanvas;
      const rect = footerElem.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;

      if (clientX >= 0 && clientX <= rect.width && clientY >= 0 && clientY <= rect.height) {
        footerTargetMouseX = clientX;
        footerTargetMouseY = clientY;
        if (footerMouseX < -1000) {
          footerMouseX = clientX;
          footerMouseY = clientY;
        }
      } else {
        footerTargetMouseX = -9999;
        footerTargetMouseY = -9999;
      }
    }
  }

  window.addEventListener('mousemove', updateMousePos, { passive: true });

  window.addEventListener('mouseleave', () => {
    heroTargetMouseX = -9999;
    heroTargetMouseY = -9999;
    footerTargetMouseX = -9999;
    footerTargetMouseY = -9999;
  });

  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }

  window.addEventListener('resize', () => {
    resizeHeroCanvas();
    resizeFooterCanvas();
  });
})();

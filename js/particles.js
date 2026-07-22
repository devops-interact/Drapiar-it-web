/**
 * particles.js - Constellation Field Canvas Animation + Interactive Mouse Laser Hover
 * DrapiarIT SaaS Premium Design
 */

(function () {
  'use strict';

  const CANVAS_ID = 'heroCanvas';
  const NUM_PARTICLES = 160;
  const SPEED = 0.7;

  const TAGS = ['OBJ_0.98', 'DET_0.94', 'NODE_A1', 'TRK_0.96', 'SYS_0.92', 'CV_0.99', 'CAM_0.95'];

  let canvas, ctx;
  let animationFrameId = null;
  let particles = [];
  let width = 0;
  let height = 0;
  let dpr = 1;
  let mouse = { x: -1000, y: -1000, active: false };

  class Vector {
    constructor(x = 0, y = 0) {
      this.x = x;
      this.y = y;
    }

    add(v) {
      this.x += v.x;
      this.y += v.y;
      return this;
    }
  }

  class Particle {
    constructor(x, y, index) {
      this.position = new Vector(x, y);
      const angle = Math.random() * Math.PI * 2;
      const spd = (Math.random() * 0.6 + 0.3) * SPEED;
      this.velocity = new Vector(Math.cos(angle) * spd, Math.sin(angle) * spd);
      this.isCVTarget = index % 45 === 0;
      this.tagLabel = TAGS[index % TAGS.length];
      this.radius = 2.2;
    }

    update() {
      this.position.add(this.velocity);

      // Screen edge wrapping for uniform coverage across full hero
      if (this.position.x < -15) this.position.x = width + 15;
      if (this.position.x > width + 15) this.position.x = -15;
      if (this.position.y < -15) this.position.y = height + 15;
      if (this.position.y > height + 15) this.position.y = -15;
    }
  }

  function initCanvas() {
    canvas = document.getElementById(CANVAS_ID);
    if (!canvas) return false;

    ctx = canvas.getContext('2d');
    resizeCanvas();

    // Create particles evenly distributed across full hero dimensions
    particles = [];
    for (let i = 0; i < NUM_PARTICLES; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      particles.push(new Particle(x, y, i));
    }

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

    // CRITICAL: Reset matrix to prevent scaling accumulation
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
  }

  function drawCornerBracketBox(x, y, size = 38, bracketLen = 9, label = '', isHovered = false) {
    const half = size / 2;
    const left = x - half;
    const right = x + half;
    const top = y - half;
    const bottom = y + half;

    ctx.save();
    ctx.strokeStyle = isHovered ? 'rgba(0, 10, 156, 0.85)' : 'rgba(0, 10, 156, 0.22)';
    ctx.lineWidth = isHovered ? 1.6 : 1.2;

    // Top-Left corner
    ctx.beginPath();
    ctx.moveTo(left, top + bracketLen);
    ctx.lineTo(left, top);
    ctx.lineTo(left + bracketLen, top);
    ctx.stroke();

    // Top-Right corner
    ctx.beginPath();
    ctx.moveTo(right - bracketLen, top);
    ctx.lineTo(right, top);
    ctx.lineTo(right, top + bracketLen);
    ctx.stroke();

    // Bottom-Left corner
    ctx.beginPath();
    ctx.moveTo(left, bottom - bracketLen);
    ctx.lineTo(left, bottom);
    ctx.lineTo(left + bracketLen, bottom);
    ctx.stroke();

    // Bottom-Right corner
    ctx.beginPath();
    ctx.moveTo(right - bracketLen, bottom);
    ctx.lineTo(right, bottom);
    ctx.lineTo(right, bottom - bracketLen);
    ctx.stroke();

    // Label tag
    if (label) {
      ctx.font = isHovered ? '700 10px "Space Mono", monospace' : '700 9px "Space Mono", monospace';
      ctx.fillStyle = isHovered ? 'rgba(0, 10, 156, 0.95)' : 'rgba(0, 10, 156, 0.35)';
      ctx.fillText(label, right + 4, top + 8);
    }

    ctx.restore();
  }

  function renderFrame() {
    ctx.clearRect(0, 0, width, height);

    // Find the single closest particle to the mouse cursor
    let closestParticle = null;
    let minMouseDist = Infinity;

    if (mouse.active) {
      for (let p of particles) {
        const dx = p.position.x - mouse.x;
        const dy = p.position.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 130 && dist < minMouseDist) {
          minMouseDist = dist;
          closestParticle = p;
        }
      }
    }

    // Update & draw particles
    for (let p of particles) {
      p.update();

      const isClosest = (p === closestParticle);

      // Particle dot (highlighted on hover)
      ctx.beginPath();
      ctx.arc(p.position.x, p.position.y, isClosest ? 3.5 : p.radius, 0, Math.PI * 2);
      ctx.fillStyle = isClosest ? 'rgba(0, 10, 156, 0.95)' : 'rgba(0, 10, 156, 0.20)';
      ctx.fill();

      // Computer Vision Bounding Box Bracket (shows on closest particle or ambient targets)
      if (isClosest || p.isCVTarget) {
        drawCornerBracketBox(p.position.x, p.position.y, 38, 9, p.tagLabel, isClosest);
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

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      renderFrame(); // Single static render
      return;
    }

    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
    animate();
  }

  // Mouse Interactivity Listeners (Window Level)
  window.addEventListener('mousemove', (e) => {
    if (!canvas) return;
    const hero = document.querySelector('.hero') || canvas;
    const rect = hero.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    if (clientX >= 0 && clientX <= rect.width && clientY >= 0 && clientY <= rect.height) {
      mouse.x = clientX;
      mouse.y = clientY;
      mouse.active = true;
    } else {
      mouse.active = false;
    }
  });

  window.addEventListener('mouseleave', () => {
    mouse.active = false;
  });

  // Event Listeners
  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }

  window.addEventListener('resize', () => {
    resizeCanvas();
  });
})();

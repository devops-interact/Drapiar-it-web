/**
 * blueprints.js - Interactive Technology Blueprint Handler
 * Drapiar IT SaaS Blueprint Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // 1. MOUSE SPOTLIGHT TRACKER
  const heroes = document.querySelectorAll('.blueprint-hero');

  heroes.forEach(hero => {
    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      hero.style.setProperty('--mouse-x', `${x}%`);
      hero.style.setProperty('--mouse-y', `${y}%`);
    });
  });

  // 2. SERVICE 1: RPA TELEMETRY LOGS
  const heroRPA = document.getElementById('blueprint-rpa');
  if (heroRPA) {
    const logBox = heroRPA.querySelector('.telemetry-log-box');
    const logs = [
      '⚡ [ERP SAP] Solicitud leída',
      '🔄 [CRM Salesforce] Coincidencia validada',
      '✉️ [IMAP Email] Notificación generada',
      '🤖 [RPA Engine] 12 Tareas ejecutadas'
    ];
    let logIdx = 0;
    let rpaInterval = null;

    heroRPA.addEventListener('mouseenter', () => {
      rpaInterval = setInterval(() => {
        logIdx = (logIdx + 1) % logs.length;
        if (logBox) logBox.textContent = logs[logIdx];
      }, 700);
    });

    heroRPA.addEventListener('mouseleave', () => {
      clearInterval(rpaInterval);
      if (logBox) logBox.textContent = '🟢 Esperando solicitud de proceso...';
    });
  }

  // 3. SERVICE 2: IA AGÉNTICA TELEMETRY LOGS
  const heroIA = document.getElementById('blueprint-ia');
  if (heroIA) {
    const logBox = heroIA.querySelector('.telemetry-log-box');
    const logs = [
      '🧠 Thinking... [Analizando contexto]',
      '🔍 Reasoning... [Evaluando vectores]',
      '💾 Memory Loaded [RAG DB hit]',
      '🛠️ Tool Call Executed [Acción despachada]'
    ];
    let logIdx = 0;
    let iaInterval = null;

    heroIA.addEventListener('mouseenter', () => {
      iaInterval = setInterval(() => {
        logIdx = (logIdx + 1) % logs.length;
        if (logBox) logBox.textContent = logs[logIdx];
      }, 800);
    });

    heroIA.addEventListener('mouseleave', () => {
      clearInterval(iaInterval);
      if (logBox) logBox.textContent = '🧠 Agente en estado Standby';
    });
  }

  // 4. SERVICE 3: BPM LOW-CODE TELEMETRY LOGS
  const heroBPM = document.getElementById('blueprint-bpm');
  if (heroBPM) {
    const logBox = heroBPM.querySelector('.telemetry-log-box');
    const logs = [
      '▶️ Inicio de instancia #4092',
      '📋 Validación de reglas de negocio',
      '✅ Aprobación automática otorgada',
      '🏁 Fin de flujo (SLA: 1.2s)'
    ];
    let logIdx = 0;
    let bpmInterval = null;

    heroBPM.addEventListener('mouseenter', () => {
      bpmInterval = setInterval(() => {
        logIdx = (logIdx + 1) % logs.length;
        if (logBox) logBox.textContent = logs[logIdx];
      }, 750);
    });

    heroBPM.addEventListener('mouseleave', () => {
      clearInterval(bpmInterval);
      if (logBox) logBox.textContent = '🔄 Diagrama BPM listo para ejecutar';
    });
  }

  // 5. SERVICE 4: DESARROLLO DE SOFTWARE LOGS
  const heroDev = document.getElementById('blueprint-dev');
  if (heroDev) {
    const logBox = heroDev.querySelector('.telemetry-log-box');
    const logs = [
      '🌐 GET /api/v1/checkout HTTP/2',
      '⚡ Gateway Rate Limit OK',
      '🟢 Microservicio Orders: 200 OK (18ms)',
      '📦 Deployment Ready (v2.4.1 K8s)'
    ];
    let logIdx = 0;
    let devInterval = null;

    heroDev.addEventListener('mouseenter', () => {
      devInterval = setInterval(() => {
        logIdx = (logIdx + 1) % logs.length;
        if (logBox) logBox.textContent = logs[logIdx];
      }, 700);
    });

    heroDev.addEventListener('mouseleave', () => {
      clearInterval(devInterval);
      if (logBox) logBox.textContent = '☁️ Arquitectura activa & respondiendo';
    });
  }

  // 6. SERVICE 5: APLICACIONES MÓVILES LOGS
  const heroMobile = document.getElementById('blueprint-mobile');
  if (heroMobile) {
    const logBox = heroMobile.querySelector('.telemetry-log-box');
    const logs = [
      '📲 Dispositivo autenticado',
      '🔄 Sincronizando 3 APIs corporativas',
      '📍 Ubicación GPS recibida',
      '⚡ Notificación Push entregada'
    ];
    let logIdx = 0;
    let mobileInterval = null;

    heroMobile.addEventListener('mouseenter', () => {
      mobileInterval = setInterval(() => {
        logIdx = (logIdx + 1) % logs.length;
        if (logBox) logBox.textContent = logs[logIdx];
      }, 750);
    });

    heroMobile.addEventListener('mouseleave', () => {
      clearInterval(mobileInterval);
      if (logBox) logBox.textContent = '📱 App Móvil Lista (Status: Online)';
    });
  }

  // 7. SERVICE 6: CONSULTORÍA LOGS
  const heroConsulting = document.getElementById('blueprint-consulting');
  if (heroConsulting) {
    const logBox = heroConsulting.querySelector('.telemetry-log-box');
    const logs = [
      '📊 01. Diagnóstico de procesos',
      '🎯 02. Estrategia y priorización',
      '🗺️ 03. Roadmap tecnológico',
      '📈 04. Business Case ROI 340%'
    ];
    let logIdx = 0;
    let consultInterval = null;

    heroConsulting.addEventListener('mouseenter', () => {
      consultInterval = setInterval(() => {
        logIdx = (logIdx + 1) % logs.length;
        if (logBox) logBox.textContent = logs[logIdx];
      }, 800);
    });

    heroConsulting.addEventListener('mouseleave', () => {
      clearInterval(consultInterval);
      if (logBox) logBox.textContent = '💼 Roadmap listo para evaluación';
    });
  }

  // 8. SERVICE 7: COMPUTER VISION LOGS
  const heroVision = document.getElementById('blueprint-vision');
  if (heroVision) {
    const logBox = heroVision.querySelector('.telemetry-log-box');
    const logs = [
      '📷 Frame capturado (1080p 60fps)',
      '🎯 Bounding Box DET_01 (98% OK)',
      '🎯 Bounding Box DET_02 (99% OK)',
      '✅ Inspección aprobada (24ms)'
    ];
    let logIdx = 0;
    let visionInterval = null;

    heroVision.addEventListener('mouseenter', () => {
      visionInterval = setInterval(() => {
        logIdx = (logIdx + 1) % logs.length;
        if (logBox) logBox.textContent = logs[logIdx];
      }, 700);
    });

    heroVision.addEventListener('mouseleave', () => {
      clearInterval(visionInterval);
      if (logBox) logBox.textContent = '👁️ Cámara lista para detección';
    });
  }

  // 9. SERVICE 8: VR / AR LOGS
  const heroVR = document.getElementById('blueprint-vr');
  if (heroVR) {
    const logBox = heroVR.querySelector('.telemetry-log-box');
    const logs = [
      '🥽 AR Spatial Mesh inicializado',
      '📐 Modelo 3D sincronizado (42k tris)',
      '🏷️ Etiquetas de componentes ligadas',
      '✅ Sesión de Asistencia Activa'
    ];
    let logIdx = 0;
    let vrInterval = null;

    heroVR.addEventListener('mouseenter', () => {
      vrInterval = setInterval(() => {
        logIdx = (logIdx + 1) % logs.length;
        if (logBox) logBox.textContent = logs[logIdx];
      }, 800);
    });

    heroVR.addEventListener('mouseleave', () => {
      clearInterval(vrInterval);
      if (logBox) logBox.textContent = '🥽 Entorno 3D/AR en espera';
    });
  }

  // 10. HIGHLIGHT ACTIVE NAV ITEM ON SCROLL
  const navItems = document.querySelectorAll('.blueprint-nav-item');
  const sections = Array.from(heroes);

  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollPosition = window.scrollY + 200;

    sections.forEach(sec => {
      if (scrollPosition >= sec.offsetTop && scrollPosition < sec.offsetTop + sec.offsetHeight) {
        currentId = sec.getAttribute('id');
      }
    });

    navItems.forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('href') === `#${currentId}`) {
        item.classList.add('active');
      }
    });
  }, { passive: true });
});

/**
 * Main Application Orchestrator
 * Connects audio toggles, keyboard shortcuts, scrapbook interactions,
 * and tangible paper micro-interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Sound Toggle Control
  const soundBtn = document.getElementById('sound-toggle-btn');
  const soundIcon = document.getElementById('sound-icon');
  const soundText = document.getElementById('sound-text');

  if (soundBtn && window.soundEngine) {
    soundBtn.addEventListener('click', () => {
      const isEnabled = window.soundEngine.toggleSound();
      if (isEnabled) {
        soundIcon.textContent = '🔊';
        soundText.textContent = 'Sound ON';
        window.soundEngine.playSuccessChime();
      } else {
        soundIcon.textContent = '🔇';
        soundText.textContent = 'Sound OFF';
      }
    });
  }

  // 2. Replay Splash Intro Button
  const replaySplashBtn = document.getElementById('replay-splash-btn');
  if (replaySplashBtn && window.waterSplashInstance) {
    replaySplashBtn.addEventListener('click', () => {
      window.waterSplashInstance.replay();
    });
  }

  // 3. Scrapbook Polaroid Interactivity in Hobbies View
  const scrapItems = document.querySelectorAll('.hobby-scrap-item');
  scrapItems.forEach((item) => {
    item.addEventListener('click', () => {
      if (window.soundEngine) {
        window.soundEngine.playPaperUnfold();
      }
      // Pleasant tactile spring
      item.style.transform = 'scale(1.06) rotate(0deg)';
      setTimeout(() => {
        item.style.transform = '';
      }, 400);
    });
  });

  // 4. Keyboard Shortcuts for Speedy Browsing & Evaluation
  window.addEventListener('keydown', (e) => {
    // Only if not in an input
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    if (window.pageRouter) {
      if (e.key === '1') window.pageRouter.navigateTo('home', 'forward');
      if (e.key === '2') window.pageRouter.navigateTo('about', 'forward');
      if (e.key === '3') window.pageRouter.navigateTo('achievements', 'forward');
      if (e.key === '4') window.pageRouter.navigateTo('hobbies', 'forward');
      if (e.key === 'Escape' || e.key === 'Backspace') {
        window.pageRouter.goBackToParent();
      }
    }
  });

  // 5. Subtle 3D Tilt on the Paper Sheet as mouse moves across desk
  const sheet = document.getElementById('main-paper-sheet');
  if (sheet) {
    window.addEventListener('mousemove', (e) => {
      if (sheet.classList.contains('is-crumpling') || sheet.classList.contains('is-uncrumpling')) {
        return;
      }
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / cx;
      const dy = (e.clientY - cy) / cy;

      // Very subtle, tangible tilt
      sheet.style.transform = `perspective(1200px) rotateY(${dx * 0.75}deg) rotateX(${-dy * 0.75}deg)`;
    });

    window.addEventListener('mouseleave', () => {
      sheet.style.transform = 'perspective(1200px) rotateY(0deg) rotateX(0deg)';
    });
  }

  console.log("🌸 Tanmay Choudhary's Paper Portfolio Initialized Successfully!");
});


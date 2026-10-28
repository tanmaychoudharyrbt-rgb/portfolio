/**
 * Anime Chibi Girl Character Controller
 * Manages:
 * - 3-second looping idle animation
 * - Crumpling paper & eating animation sequence
 * - Regurgitating crumpled paper & throwing to restore parent page sequence
 * - Interactive speech bubbles, sound syncing, and cute expressions
 */

class ChibiController {
  constructor() {
    this.widget = document.getElementById('chibi-widget');
    this.character = document.getElementById('chibi-character');
    this.bubble = document.getElementById('chibi-bubble');
    this.bubbleText = document.getElementById('chibi-bubble-text');
    this.ballActor = document.getElementById('crumpled-ball-actor');

    this.isBusy = false;
    this.idleTimer = null;
    this.idleDialogues = [
      "Hehe~ Looking for something? ✨",
      "I love the smell of fresh paper! 📜",
      "Click any tab to see magic! 🎀",
      "Nomming pages is my specialty! 😋",
      "Everything here is crafted by Tanmay! 🌸",
      "Blink and you might miss my loop! 💖"
    ];

    this.init();
  }

  init() {
    if (!this.widget) return;

    // Click on chibi gives a cute interactive squeak or reaction
    this.character.addEventListener('click', () => {
      if (this.isBusy) return;
      this.sayRandomIdle();
      if (window.soundEngine) {
        window.soundEngine.playSuccessChime();
      }
      this.widget.classList.add('phase-satisfied');
      setTimeout(() => {
        if (!this.isBusy) this.widget.classList.remove('phase-satisfied');
      }, 1200);
    });

    // Cycle idle dialogues periodically (every 9s = 3 cycles of 3s)
    setInterval(() => {
      if (!this.isBusy && Math.random() > 0.45) {
        this.sayRandomIdle();
      }
    }, 9000);
  }

  say(text, duration = 3000) {
    if (!this.bubble || !this.bubbleText) return;
    this.bubbleText.textContent = text;
    this.bubble.style.opacity = '1';
    this.bubble.style.transform = 'scale(1)';

    if (this.bubbleTimeout) clearTimeout(this.bubbleTimeout);
    if (duration > 0) {
      this.bubbleTimeout = setTimeout(() => {
        if (!this.isBusy) {
          this.bubble.style.opacity = '0.9';
        }
      }, duration);
    }
  }

  sayRandomIdle() {
    const quote = this.idleDialogues[Math.floor(Math.random() * this.idleDialogues.length)];
    this.say(quote, 3500);
  }

  getMouthCoords() {
    const rect = this.character.getBoundingClientRect();
    // Mouth is located roughly at (x: 54%, y: 55%) inside the chibi graphic
    return {
      x: rect.left + rect.width * 0.54,
      y: rect.top + rect.height * 0.53
    };
  }

  resetStates() {
    this.widget.className = 'chibi-widget';
    this.isBusy = false;
  }

  /**
   * Forward Transition:
   * Current sheet crumples -> flies into chibi mouth -> chibi eats it -> target page unfolds
   */
  eatPageSequence(sheetElem, onSwapped, onComplete) {
    if (this.isBusy) return;
    this.isBusy = true;

    // 1. Start crumpling current sheet
    sheetElem.classList.remove('is-uncrumpling');
    sheetElem.classList.add('is-crumpling');

    if (window.soundEngine) {
      window.soundEngine.playPaperCrumple();
    }

    this.say("NOM NOM NOM incoming! 😋", 2500);

    // Chibi anticipates food: open mouth!
    this.widget.classList.add('is-eating', 'phase-open-mouth');

    // 2. Launch paper ball from sheet center to chibi mouth
    const sheetRect = sheetElem.getBoundingClientRect();
    const startX = sheetRect.left + sheetRect.width * 0.5;
    const startY = sheetRect.top + sheetRect.height * 0.45;
    const mouth = this.getMouthCoords();

    this.ballActor.classList.add('active');
    this.ballActor.style.transition = 'none';
    this.ballActor.style.transform = `translate(${startX}px, ${startY}px) scale(0.2) rotate(0deg)`;

    // Animate paper ball flight
    requestAnimationFrame(() => {
      setTimeout(() => {
        this.ballActor.style.transition = 'all 0.65s cubic-bezier(0.25, 1, 0.5, 1)';
        this.ballActor.style.transform = `translate(${mouth.x - 28}px, ${mouth.y - 28}px) scale(0.7) rotate(720deg)`;
      }, 50);
    });

    // 3. Ball arrives at mouth -> swallow & chew!
    setTimeout(() => {
      // Hide paper ball
      this.ballActor.style.transform = `translate(${mouth.x - 28}px, ${mouth.y - 28}px) scale(0.01) rotate(900deg)`;
      setTimeout(() => {
        this.ballActor.classList.remove('active');
      }, 150);

      // Sound & Chewing phase
      if (window.soundEngine) {
        window.soundEngine.playAnimeNom();
      }

      this.widget.classList.remove('phase-open-mouth');
      this.widget.classList.add('phase-chewing');
      this.say("*crunch crunch munch* So crunchy!", 1800);

      // Extra chew sounds
      setTimeout(() => {
        if (window.soundEngine) window.soundEngine.playAnimeNom();
      }, 350);

      // Gulp & Swallow phase
      setTimeout(() => {
        if (window.soundEngine) {
          window.soundEngine.playAnimeGulp();
          window.soundEngine.playSuccessChime();
        }

        this.widget.classList.remove('phase-chewing');
        this.widget.classList.add('phase-satisfied');
        this.say("Delicious webpage! Here's the new one! ✨", 2500);

        // Swap the active DOM page view
        if (onSwapped) onSwapped();

        // Unfold new page sheet
        sheetElem.classList.remove('is-crumpling');
        sheetElem.classList.add('is-uncrumpling');
        if (window.soundEngine) {
          window.soundEngine.playPaperUnfold();
        }

        // Return Chibi to 3s idle loop
        setTimeout(() => {
          this.resetStates();
          sheetElem.classList.remove('is-uncrumpling');
          if (onComplete) onComplete();
        }, 800);

      }, 950);

    }, 700);
  }

  /**
   * Backward Transition:
   * Chibi coughs up crumpled paper ball -> throws it into center -> parent page unfolds
   */
  throwPageBackSequence(sheetElem, onSwapped, onComplete) {
    if (this.isBusy) return;
    this.isBusy = true;

    // 1. Chibi tummy rumble / cough
    this.widget.classList.add('is-throwing', 'phase-cough');
    this.say("Wait! Returning to parent page?! BLEGH! 💫", 2200);

    if (window.soundEngine) {
      window.soundEngine.playAnimePop();
    }

    // 2. Paper ball pops out from mouth
    const mouth = this.getMouthCoords();
    this.ballActor.classList.add('active');
    this.ballActor.style.transition = 'none';
    this.ballActor.style.transform = `translate(${mouth.x - 28}px, ${mouth.y - 28}px) scale(0.1) rotate(0deg)`;

    // Ball pops up into Chibi's hand
    setTimeout(() => {
      this.ballActor.style.transition = 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
      this.ballActor.style.transform = `translate(${mouth.x - 55}px, ${mouth.y - 65}px) scale(0.85) rotate(-120deg)`;

      // Switch to windup & throw pose
      setTimeout(() => {
        this.widget.classList.remove('phase-cough');
        this.widget.classList.add('phase-throw-action');
        this.say("CATCH YOUR PAGE! 📜💨", 2000);

        if (window.soundEngine) {
          window.soundEngine.playThrowWhoosh();
        }

        // 3. Throw ball in arc towards center of desk
        const sheetRect = sheetElem.getBoundingClientRect();
        const targetX = sheetRect.left + sheetRect.width * 0.5 - 28;
        const targetY = sheetRect.top + sheetRect.height * 0.45 - 28;

        this.ballActor.style.transition = 'all 0.55s cubic-bezier(0.2, 0.8, 0.3, 1)';
        this.ballActor.style.transform = `translate(${targetX}px, ${targetY}px) scale(1) rotate(-720deg)`;

        // 4. Ball lands & impacts -> swap DOM and uncrumple parent page
        setTimeout(() => {
          this.ballActor.classList.remove('active');

          if (onSwapped) onSwapped();

          sheetElem.classList.remove('is-crumpling');
          sheetElem.classList.add('is-uncrumpling');

          if (window.soundEngine) {
            window.soundEngine.playPaperUnfold();
            window.soundEngine.playSuccessChime();
          }

          // Chibi finishes throw, poses happily
          this.widget.classList.remove('phase-throw-action');
          this.widget.classList.add('phase-satisfied');
          this.say("Tada! Back home safely! ✨", 2500);

          setTimeout(() => {
            this.resetStates();
            sheetElem.classList.remove('is-uncrumpling');
            if (onComplete) onComplete();
          }, 850);

        }, 550);

      }, 350);

    }, 250);
  }
}

// Global initialization
window.addEventListener('DOMContentLoaded', () => {
  window.chibiController = new ChibiController();
});


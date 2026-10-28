/**
 * Navigation and Page Router
 * Coordinates page switching with Chibi animations:
 * - Forward clicks trigger Chibi paper crumpling & eating sequence
 * - Back clicks trigger Chibi regurgitate & throwing back sequence
 * - Manages active tabs, history stack, and parent page links
 */

class PageRouter {
  constructor() {
    this.currentPage = 'home';
    this.historyStack = ['home'];
    this.sheetElem = document.getElementById('main-paper-sheet');
    this.backBtn = document.getElementById('parent-back-btn');
    this.navTabs = document.querySelectorAll('.paper-nav-tab');
    this.pageViews = document.querySelectorAll('.page-view');
    this.isTransitioning = false;

    this.init();
  }

  init() {
    // Attach click listeners to tabs
    this.navTabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        const targetPage = tab.getAttribute('data-page');
        if (targetPage && targetPage !== this.currentPage) {
          this.navigateTo(targetPage, 'forward');
        }
      });
    });

    // Attach click listener to "Back to Parent Webpage" button
    if (this.backBtn) {
      this.backBtn.addEventListener('click', () => {
        this.goBackToParent();
      });
    }

    // In-page navigation links (e.g., buttons inside Home page that link to About, Achievements, etc.)
    document.addEventListener('click', (e) => {
      const link = e.target.closest('[data-navigate]');
      if (link) {
        e.preventDefault();
        const targetPage = link.getAttribute('data-navigate');
        if (targetPage && targetPage !== this.currentPage) {
          this.navigateTo(targetPage, 'forward');
        }
      }
    });

    // Initial state setup
    this.updateUI();
  }

  updateUI() {
    // Update active tab styles
    this.navTabs.forEach(tab => {
      if (tab.getAttribute('data-page') === this.currentPage) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });

    // Show or hide "Back to Parent Webpage" button
    if (this.backBtn) {
      if (this.currentPage !== 'home' || this.historyStack.length > 1) {
        this.backBtn.classList.remove('hidden');
        const parentName = this.getParentPageName();
        this.backBtn.innerHTML = `<span>⟵ Back to ${parentName}</span>`;
      } else {
        this.backBtn.classList.add('hidden');
      }
    }
  }

  getParentPageName() {
    if (this.historyStack.length > 1) {
      const parentId = this.historyStack[this.historyStack.length - 2];
      switch (parentId) {
        case 'about': return 'About Me';
        case 'achievements': return 'Achievements';
        case 'hobbies': return 'Hobbies';
        default: return 'Home';
      }
    }
    return 'Home';
  }

  swapPageView(targetPage) {
    this.pageViews.forEach(view => {
      if (view.id === `page-${targetPage}`) {
        view.classList.add('active');
      } else {
        view.classList.remove('active');
      }
    });
    this.currentPage = targetPage;
    this.updateUI();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  navigateTo(targetPage, direction = 'forward') {
    if (this.isTransitioning || targetPage === this.currentPage) return;
    this.isTransitioning = true;

    if (direction === 'forward') {
      this.historyStack.push(targetPage);

      if (window.chibiController) {
        window.chibiController.eatPageSequence(
          this.sheetElem,
          () => {
            this.swapPageView(targetPage);
          },
          () => {
            this.isTransitioning = false;
          }
        );
      } else {
        this.swapPageView(targetPage);
        this.isTransitioning = false;
      }
    } else {
      // Backward transition
      if (this.historyStack.length > 1) {
        this.historyStack.pop();
      }

      if (window.chibiController) {
        window.chibiController.throwPageBackSequence(
          this.sheetElem,
          () => {
            this.swapPageView(targetPage);
          },
          () => {
            this.isTransitioning = false;
          }
        );
      } else {
        this.swapPageView(targetPage);
        this.isTransitioning = false;
      }
    }
  }

  goBackToParent() {
    if (this.isTransitioning) return;
    let targetPage = 'home';
    if (this.historyStack.length > 1) {
      targetPage = this.historyStack[this.historyStack.length - 2];
    }
    this.navigateTo(targetPage, 'backward');
  }
}

// Global initialization
window.addEventListener('DOMContentLoaded', () => {
  window.pageRouter = new PageRouter();
});


/**
 * UI Components Module
 * Componentes de interface (Back to Top, Cookie Banner, Stats Counter)
 *
 * Padrao: Observer Pattern + Module Pattern
 * Referencia: Gamma, E. et al. - "Design Patterns"
 */

const UIComponents = (function() {
  'use strict';

  // ==================== BACK TO TOP ====================
  const BackToTop = {
    element: null,
    showThreshold: 400,

    init: function() {
      this.element = document.getElementById('back-to-top');
      if (!this.element) return;

      // Event listeners
      window.addEventListener('scroll', this.handleScroll.bind(this), { passive: true });
      this.element.addEventListener('click', this.scrollToTop.bind(this));

      // Estado inicial
      this.handleScroll();
    },

    handleScroll: function() {
      if (!this.element) return;

      if (window.scrollY > this.showThreshold) {
        this.element.classList.add('show');
      } else {
        this.element.classList.remove('show');
      }
    },

    scrollToTop: function(event) {
      if (event) event.preventDefault();

      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  // ==================== COOKIE BANNER ====================
  const CookieBanner = {
    banner: null,
    acceptBtn: null,
    storageKey: 'cookieConsent',

    init: function() {
      this.banner = document.getElementById('cookie-banner');
      this.acceptBtn = document.getElementById('accept-cookies');

      if (!this.banner || !this.acceptBtn) return;

      // Verifica se ja aceitou
      if (!this.hasConsent()) {
        // Mostra apos delay
        setTimeout(this.show.bind(this), 1000);
      }

      // Event listener
      this.acceptBtn.addEventListener('click', this.accept.bind(this));
    },

    hasConsent: function() {
      return localStorage.getItem(this.storageKey) === 'true';
    },

    show: function() {
      if (this.banner) {
        this.banner.classList.add('show');
      }
    },

    hide: function() {
      if (this.banner) {
        this.banner.classList.remove('show');
      }
    },

    accept: function() {
      localStorage.setItem(this.storageKey, 'true');
      this.hide();
    }
  };

  // ==================== STATS COUNTER ====================
  const StatsCounter = {
    observer: null,

    init: function() {
      const stats = document.querySelectorAll('.stat__number');
      if (stats.length === 0) return;

      this.observer = new IntersectionObserver(
        this.handleIntersection.bind(this),
        { threshold: 0.5 }
      );

      stats.forEach(function(stat) {
        this.observer.observe(stat);
      }.bind(this));
    },

    handleIntersection: function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          this.animateStat(entry.target);
          this.observer.unobserve(entry.target);
        }
      }.bind(this));
    },

    animateStat: function(element) {
      const text = element.textContent;
      let end, suffix, hasPrefix;

      // Determina o tipo de numero
      if (text.includes('%')) {
        end = 100;
        suffix = '%';
        hasPrefix = false;
      } else if (text.includes('+')) {
        end = parseInt(text.replace(/\D/g, '')) || 500;
        suffix = '';
        hasPrefix = true;
      } else if (text.includes('h')) {
        end = 24;
        suffix = 'h';
        hasPrefix = false;
      } else {
        end = parseInt(text) || 100;
        suffix = '';
        hasPrefix = false;
      }

      this.animateNumber(element, 0, end, suffix, hasPrefix);
    },

    animateNumber: function(element, start, end, suffix, hasPrefix) {
      const duration = 2000;
      const steps = 60;
      const stepDuration = duration / steps;
      const increment = (end - start) / steps;
      let current = start;
      let step = 0;

      const timer = setInterval(function() {
        step++;
        current = Math.round(start + increment * step);

        if (step >= steps) {
          current = end;
          clearInterval(timer);
        }

        if (hasPrefix) {
          element.textContent = '+' + current;
        } else {
          element.textContent = current + suffix;
        }
      }, stepDuration);
    }
  };

  // ==================== YEAR UPDATER ====================
  const YearUpdater = {
    init: function() {
      const yearElements = document.querySelectorAll('[data-year]');
      const currentYear = new Date().getFullYear();

      yearElements.forEach(function(element) {
        element.textContent = currentYear;
      });
    }
  };

  // ==================== PRELOADER ====================
  const Preloader = {
    init: function() {
      window.addEventListener('load', function() {
        document.body.classList.add('loaded');

        const preloader = document.querySelector('.preloader');
        if (preloader) {
          preloader.style.opacity = '0';
          setTimeout(function() {
            preloader.remove();
          }, 500);
        }
      });
    }
  };

  // ==================== PUBLIC INTERFACE ====================

  /**
   * Inicializa todos os componentes UI
   */
  function init() {
    BackToTop.init();
    CookieBanner.init();
    StatsCounter.init();
    YearUpdater.init();
    Preloader.init();
  }

  // API publica
  return {
    init: init,
    BackToTop: BackToTop,
    CookieBanner: CookieBanner,
    StatsCounter: StatsCounter,
    YearUpdater: YearUpdater
  };
})();

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = UIComponents;
}

/**
 * Navigation Module
 * Gerencia a navegacao do site (menu mobile, scroll, links ativos)
 *
 * Padrao: Module Pattern (Revealing Module Pattern)
 * Referencia: Osmani, A. - "Learning JavaScript Design Patterns"
 */

const Navigation = (function() {
  'use strict';

  // ==================== PRIVATE VARIABLES ====================
  let header = null;
  let navMenu = null;
  let navToggle = null;
  let navClose = null;
  let navLinks = null;
  let sections = null;
  let isMenuOpen = false;

  // ==================== PRIVATE METHODS ====================

  /**
   * Abre o menu mobile
   */
  function openMenu() {
    if (!navMenu) return;

    navMenu.classList.add('show-menu');
    document.body.style.overflow = 'hidden';
    isMenuOpen = true;

    // Acessibilidade: foco no primeiro link
    const firstLink = navMenu.querySelector('.nav__link');
    if (firstLink) firstLink.focus();
  }

  /**
   * Fecha o menu mobile
   */
  function closeMenu() {
    if (!navMenu) return;

    navMenu.classList.remove('show-menu');
    document.body.style.overflow = '';
    isMenuOpen = false;
  }

  /**
   * Toggle do menu mobile
   */
  function toggleMenu() {
    if (isMenuOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  /**
   * Handler para clique fora do menu
   * @param {Event} event
   */
  function handleClickOutside(event) {
    if (!navMenu || !navToggle) return;

    if (!navMenu.contains(event.target) && !navToggle.contains(event.target)) {
      closeMenu();
    }
  }

  /**
   * Handler para scroll do header
   */
  function handleHeaderScroll() {
    if (!header) return;

    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  /**
   * Destaca a secao ativa no menu
   */
  function highlightActiveSection() {
    if (!sections || !navLinks) return;

    const scrollY = window.pageYOffset;

    sections.forEach(function(section) {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 100;
      const sectionId = section.getAttribute('id');
      const navLink = document.querySelector('.nav__link[href="#' + sectionId + '"]');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(function(link) {
          link.classList.remove('active');
        });
        if (navLink) {
          navLink.classList.add('active');
        }
      }
    });
  }

  /**
   * Scroll suave para links internos
   * @param {Event} event
   */
  function handleSmoothScroll(event) {
    const target = event.currentTarget;
    const targetId = target.getAttribute('href');

    if (targetId === '#' || !targetId.startsWith('#')) return;

    event.preventDefault();

    const targetElement = document.querySelector(targetId);

    if (targetElement) {
      const headerHeight = header ? header.offsetHeight : 80;
      const targetPosition = targetElement.offsetTop - headerHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });

      // Fecha menu se estiver aberto
      closeMenu();
    }
  }

  /**
   * Handler para tecla Escape
   * @param {KeyboardEvent} event
   */
  function handleEscapeKey(event) {
    if (event.key === 'Escape' && isMenuOpen) {
      closeMenu();
    }
  }

  // ==================== PUBLIC METHODS ====================

  /**
   * Inicializa o modulo de navegacao
   */
  function init() {
    // Cache DOM elements
    header = document.getElementById('header');
    navMenu = document.getElementById('nav-menu');
    navToggle = document.getElementById('nav-toggle');
    navClose = document.getElementById('nav-close');
    navLinks = document.querySelectorAll('.nav__link');
    sections = document.querySelectorAll('section[id]');

    // Event Listeners - Menu Mobile
    if (navToggle) {
      navToggle.addEventListener('click', openMenu);
    }

    if (navClose) {
      navClose.addEventListener('click', closeMenu);
    }

    // Fecha menu ao clicar nos links
    if (navLinks) {
      navLinks.forEach(function(link) {
        link.addEventListener('click', closeMenu);
      });
    }

    // Fecha menu ao clicar fora
    document.addEventListener('click', handleClickOutside);

    // Fecha menu com Escape
    document.addEventListener('keydown', handleEscapeKey);

    // Event Listeners - Scroll
    window.addEventListener('scroll', handleHeaderScroll, { passive: true });
    window.addEventListener('scroll', highlightActiveSection, { passive: true });

    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
      anchor.addEventListener('click', handleSmoothScroll);
    });

    // Inicializa estados
    handleHeaderScroll();
    highlightActiveSection();
  }

  /**
   * Destroi o modulo (cleanup)
   */
  function destroy() {
    window.removeEventListener('scroll', handleHeaderScroll);
    window.removeEventListener('scroll', highlightActiveSection);
    document.removeEventListener('click', handleClickOutside);
    document.removeEventListener('keydown', handleEscapeKey);
  }

  // Revealing Module Pattern - API publica
  return {
    init: init,
    destroy: destroy,
    openMenu: openMenu,
    closeMenu: closeMenu,
    toggleMenu: toggleMenu
  };
})();

// Export para uso como modulo ES6 (se suportado)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Navigation;
}

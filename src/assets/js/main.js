/**
 * Main JavaScript - Dr. Lucas Duarte
 * ==============================================
 *
 * ARQUITETURA DE MODULOS:
 * Este arquivo serve como ponto de entrada principal,
 * orquestrando a inicializacao de todos os modulos.
 *
 * PADROES UTILIZADOS:
 * - Module Pattern (Encapsulamento)
 * - Revealing Module Pattern (API publica)
 * - Observer Pattern (Eventos)
 * - Singleton Pattern (Instancias unicas)
 * - Strategy Pattern (Validacoes)
 *
 * REFERENCIAS CIENTIFICAS:
 * - Osmani, A. (2012). "Learning JavaScript Design Patterns"
 * - Gamma, E. et al. (1994). "Design Patterns: Elements of Reusable OO Software"
 * - Crockford, D. (2008). "JavaScript: The Good Parts"
 *
 * ==============================================
 */

(function() {
  'use strict';

  // ==================== APP NAMESPACE ====================
  const App = {
    name: 'Dr. Lucas Duarte',
    version: '2.0.0',
    debug: false,

    /**
     * Inicializa a aplicacao
     */
    init: function() {
      // Aguarda DOM estar pronto
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', this.bootstrap.bind(this));
      } else {
        this.bootstrap();
      }
    },

    /**
     * Bootstrap - inicializa todos os modulos
     */
    bootstrap: function() {
      this.log('Iniciando aplicacao...');

      // Inicializa modulos na ordem correta
      this.initNavigation();
      this.initUIComponents();
      this.initFormHandler();
      this.initNotifications();

      // Console branding
      this.showConsoleBranding();

      this.log('Aplicacao inicializada com sucesso!');
    },

    /**
     * Inicializa modulo de navegacao
     */
    initNavigation: function() {
      if (typeof Navigation !== 'undefined') {
        Navigation.init();
        this.log('Modulo Navigation inicializado');
      } else {
        this.initNavigationFallback();
      }
    },

    /**
     * Fallback para navegacao (caso modulo nao carregue)
     */
    initNavigationFallback: function() {
      const header = document.getElementById('header');
      const navMenu = document.getElementById('nav-menu');
      const navToggle = document.getElementById('nav-toggle');
      const navClose = document.getElementById('nav-close');
      const navLinks = document.querySelectorAll('.nav__link');

      // Menu mobile
      if (navToggle) {
        navToggle.addEventListener('click', function() {
          navMenu.classList.add('show-menu');
          document.body.style.overflow = 'hidden';
        });
      }

      if (navClose) {
        navClose.addEventListener('click', function() {
          navMenu.classList.remove('show-menu');
          document.body.style.overflow = '';
        });
      }

      navLinks.forEach(function(link) {
        link.addEventListener('click', function() {
          navMenu.classList.remove('show-menu');
          document.body.style.overflow = '';
        });
      });

      // Header scroll
      window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      }, { passive: true });

      // Smooth scroll
      document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
          e.preventDefault();
          const targetId = this.getAttribute('href');
          if (targetId === '#') return;

          const target = document.querySelector(targetId);
          if (target) {
            const headerHeight = header ? header.offsetHeight : 80;
            window.scrollTo({
              top: target.offsetTop - headerHeight,
              behavior: 'smooth'
            });
          }
        });
      });
    },

    /**
     * Inicializa componentes UI
     */
    initUIComponents: function() {
      if (typeof UIComponents !== 'undefined') {
        UIComponents.init();
        this.log('Modulo UIComponents inicializado');
      } else {
        this.initUIComponentsFallback();
      }
    },

    /**
     * Fallback para componentes UI
     */
    initUIComponentsFallback: function() {
      // Back to top
      const backToTop = document.getElementById('back-to-top');
      if (backToTop) {
        window.addEventListener('scroll', function() {
          if (window.scrollY > 400) {
            backToTop.classList.add('show');
          } else {
            backToTop.classList.remove('show');
          }
        }, { passive: true });

        backToTop.addEventListener('click', function() {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        });
      }

      // Cookie banner
      const cookieBanner = document.getElementById('cookie-banner');
      const acceptCookies = document.getElementById('accept-cookies');
      if (cookieBanner && acceptCookies) {
        if (!localStorage.getItem('cookieConsent')) {
          setTimeout(function() {
            cookieBanner.classList.add('show');
          }, 1000);
        }

        acceptCookies.addEventListener('click', function() {
          localStorage.setItem('cookieConsent', 'true');
          cookieBanner.classList.remove('show');
        });
      }

      // Year updater
      const yearElements = document.querySelectorAll('[data-year]');
      yearElements.forEach(function(el) {
        el.textContent = new Date().getFullYear();
      });
    },

    /**
     * Inicializa handler de formularios
     */
    initFormHandler: function() {
      if (typeof FormHandler !== 'undefined') {
        FormHandler.init();
        this.log('Modulo FormHandler inicializado');
      } else {
        this.initFormHandlerFallback();
      }
    },

    /**
     * Fallback para formularios
     */
    initFormHandlerFallback: function() {
      const contactForm = document.getElementById('contact-form');
      const phoneInput = document.getElementById('phone');

      // Mascara de telefone
      if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
          let value = e.target.value.replace(/\D/g, '');
          if (value.length > 11) value = value.slice(0, 11);

          if (value.length > 0) {
            if (value.length <= 2) {
              value = '(' + value;
            } else if (value.length <= 7) {
              value = '(' + value.slice(0, 2) + ') ' + value.slice(2);
            } else {
              value = '(' + value.slice(0, 2) + ') ' + value.slice(2, 7) + '-' + value.slice(7);
            }
          }
          e.target.value = value;
        });
      }

      // Submit do formulario
      if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
          e.preventDefault();

          const formData = new FormData(contactForm);
          const data = Object.fromEntries(formData);
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

          // Validacao basica
          if (!data.name || data.name.trim().length < 3) {
            alert('Por favor, insira seu nome completo.');
            return;
          }
          if (!emailRegex.test(data.email)) {
            alert('Por favor, insira um e-mail valido.');
            return;
          }
          if (!data.subject) {
            alert('Por favor, selecione um assunto.');
            return;
          }
          if (!data.message || data.message.trim().length < 10) {
            alert('Por favor, escreva uma mensagem mais detalhada.');
            return;
          }

          // Simula envio
          const btn = contactForm.querySelector('button[type="submit"]');
          const originalText = btn.innerHTML;
          btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
          btn.disabled = true;

          setTimeout(function() {
            btn.innerHTML = originalText;
            btn.disabled = false;
            alert('Mensagem enviada com sucesso!');
            contactForm.reset();
          }, 2000);
        });
      }
    },

    /**
     * Inicializa sistema de notificacoes
     */
    initNotifications: function() {
      if (typeof Notification !== 'undefined') {
        this.log('Modulo Notification disponivel');
      }
    },

    /**
     * Exibe branding no console
     */
    showConsoleBranding: function() {
      console.log(
        '%c Dr. Lucas Duarte ',
        'background: #0c4a6e; color: white; font-size: 20px; padding: 10px 20px; border-radius: 5px;'
      );
      console.log(
        '%c Website desenvolvido com dedicacao ',
        'color: #6b7280; font-size: 12px;'
      );
      console.log(
        '%c Arquitetura: Modular | Padroes: Module, Observer, Strategy ',
        'color: #6b7280; font-size: 10px;'
      );
    },

    /**
     * Log condicional (apenas em modo debug)
     * @param {string} message
     */
    log: function(message) {
      if (this.debug) {
        console.log('[App]', message);
      }
    }
  };

  // ==================== INICIALIZA A APLICACAO ====================
  App.init();

  // Expoe globalmente para debug (opcional)
  window.App = App;

})();

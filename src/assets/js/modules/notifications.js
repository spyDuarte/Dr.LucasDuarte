/**
 * Notifications Module
 * Sistema de notificacoes toast
 *
 * Padrao: Singleton Pattern
 * Referencia: Osmani, A. - "Learning JavaScript Design Patterns"
 */

const Notification = (function() {
  'use strict';

  // ==================== PRIVATE VARIABLES ====================
  let container = null;
  let styleElement = null;
  const NOTIFICATION_DURATION = 5000;

  // ==================== PRIVATE METHODS ====================

  /**
   * Cria o container de notificacoes
   */
  function createContainer() {
    if (container) return container;

    container = document.createElement('div');
    container.id = 'notification-container';
    container.setAttribute('aria-live', 'polite');
    container.setAttribute('aria-atomic', 'true');
    document.body.appendChild(container);

    return container;
  }

  /**
   * Injeta os estilos necessarios
   */
  function injectStyles() {
    if (styleElement) return;

    styleElement = document.createElement('style');
    styleElement.id = 'notification-styles';
    styleElement.textContent = `
      #notification-container {
        position: fixed;
        top: 100px;
        right: 20px;
        z-index: 10000;
        display: flex;
        flex-direction: column;
        gap: 10px;
        max-width: 400px;
      }

      .notification {
        padding: 16px 20px;
        border-radius: 10px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 15px;
        animation: slideInRight 0.3s ease;
        color: white;
      }

      .notification--success {
        background-color: #10b981;
      }

      .notification--error {
        background-color: #ef4444;
      }

      .notification--warning {
        background-color: #f59e0b;
      }

      .notification--info {
        background-color: #3b82f6;
      }

      .notification__content {
        display: flex;
        align-items: center;
        gap: 10px;
        flex: 1;
      }

      .notification__message {
        font-size: 14px;
        line-height: 1.4;
      }

      .notification__close {
        background: none;
        border: none;
        color: currentColor;
        cursor: pointer;
        padding: 5px;
        opacity: 0.8;
        transition: opacity 0.2s;
        flex-shrink: 0;
      }

      .notification__close:hover {
        opacity: 1;
      }

      .notification--hiding {
        animation: slideOutRight 0.3s ease forwards;
      }

      @keyframes slideInRight {
        from {
          opacity: 0;
          transform: translateX(100px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }

      @keyframes slideOutRight {
        from {
          opacity: 1;
          transform: translateX(0);
        }
        to {
          opacity: 0;
          transform: translateX(100px);
        }
      }

      @media (max-width: 480px) {
        #notification-container {
          right: 10px;
          left: 10px;
          max-width: none;
        }
      }
    `;
    document.head.appendChild(styleElement);
  }

  /**
   * Obtem o icone baseado no tipo
   * @param {string} type
   * @returns {string}
   */
  function getIcon(type) {
    const icons = {
      success: 'fa-check-circle',
      error: 'fa-exclamation-circle',
      warning: 'fa-exclamation-triangle',
      info: 'fa-info-circle'
    };
    return icons[type] || icons.info;
  }

  /**
   * Remove uma notificacao com animacao
   * @param {HTMLElement} notification
   */
  function removeNotification(notification) {
    notification.classList.add('notification--hiding');
    setTimeout(function() {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 300);
  }

  // ==================== PUBLIC METHODS ====================

  /**
   * Exibe uma notificacao
   * @param {string} message - Mensagem a ser exibida
   * @param {string} type - Tipo: success, error, warning, info
   * @param {number} duration - Duracao em ms (opcional)
   * @returns {HTMLElement} - Elemento da notificacao
   */
  function show(message, type, duration) {
    type = type || 'info';
    duration = duration || NOTIFICATION_DURATION;

    // Garante que container e estilos existem
    createContainer();
    injectStyles();

    // Cria elemento da notificacao
    const notification = document.createElement('div');
    notification.className = 'notification notification--' + type;
    notification.setAttribute('role', 'alert');

    notification.innerHTML = `
      <div class="notification__content">
        <i class="fas ${getIcon(type)}"></i>
        <span class="notification__message">${message}</span>
      </div>
      <button class="notification__close" aria-label="Fechar notificacao">
        <i class="fas fa-times"></i>
      </button>
    `;

    // Adiciona ao container
    container.appendChild(notification);

    // Event listener para fechar
    const closeBtn = notification.querySelector('.notification__close');
    closeBtn.addEventListener('click', function() {
      removeNotification(notification);
    });

    // Auto-remove apos duracao
    if (duration > 0) {
      setTimeout(function() {
        removeNotification(notification);
      }, duration);
    }

    return notification;
  }

  /**
   * Exibe notificacao de sucesso
   * @param {string} message
   * @param {number} duration
   */
  function success(message, duration) {
    return show(message, 'success', duration);
  }

  /**
   * Exibe notificacao de erro
   * @param {string} message
   * @param {number} duration
   */
  function error(message, duration) {
    return show(message, 'error', duration);
  }

  /**
   * Exibe notificacao de aviso
   * @param {string} message
   * @param {number} duration
   */
  function warning(message, duration) {
    return show(message, 'warning', duration);
  }

  /**
   * Exibe notificacao informativa
   * @param {string} message
   * @param {number} duration
   */
  function info(message, duration) {
    return show(message, 'info', duration);
  }

  /**
   * Remove todas as notificacoes
   */
  function clear() {
    if (container) {
      container.innerHTML = '';
    }
  }

  // API publica
  return {
    show: show,
    success: success,
    error: error,
    warning: warning,
    info: info,
    clear: clear
  };
})();

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Notification;
}

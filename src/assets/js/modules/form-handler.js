/**
 * Form Handler Module
 * Gerencia validacao e envio de formularios
 *
 * Padrao: Module Pattern + Strategy Pattern (validacao)
 * Referencia: Gamma, E. et al. - "Design Patterns: Elements of Reusable OO Software"
 */

const FormHandler = (function() {
  'use strict';

  // ==================== PRIVATE VARIABLES ====================
  let contactForm = null;

  // ==================== VALIDATION STRATEGIES ====================
  const ValidationStrategies = {
    /**
     * Valida nome (minimo 3 caracteres)
     */
    name: function(value) {
      if (!value || value.trim().length < 3) {
        return {
          valid: false,
          message: 'Por favor, insira seu nome completo (minimo 3 caracteres).'
        };
      }
      return { valid: true };
    },

    /**
     * Valida email com regex
     */
    email: function(value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value || !emailRegex.test(value)) {
        return {
          valid: false,
          message: 'Por favor, insira um e-mail valido.'
        };
      }
      return { valid: true };
    },

    /**
     * Valida telefone brasileiro
     */
    phone: function(value) {
      // Telefone e opcional, mas se preenchido deve ter formato valido
      if (value && value.replace(/\D/g, '').length < 10) {
        return {
          valid: false,
          message: 'Por favor, insira um telefone valido.'
        };
      }
      return { valid: true };
    },

    /**
     * Valida selecao de assunto
     */
    subject: function(value) {
      if (!value) {
        return {
          valid: false,
          message: 'Por favor, selecione um assunto.'
        };
      }
      return { valid: true };
    },

    /**
     * Valida mensagem (minimo 10 caracteres)
     */
    message: function(value) {
      if (!value || value.trim().length < 10) {
        return {
          valid: false,
          message: 'Por favor, escreva uma mensagem mais detalhada (minimo 10 caracteres).'
        };
      }
      return { valid: true };
    }
  };

  // ==================== PRIVATE METHODS ====================

  /**
   * Valida todos os campos do formulario
   * @param {Object} data - Dados do formulario
   * @returns {Object} - Resultado da validacao
   */
  function validateForm(data) {
    const errors = [];

    // Valida cada campo usando a estrategia correspondente
    for (const field in data) {
      if (ValidationStrategies[field]) {
        const result = ValidationStrategies[field](data[field]);
        if (!result.valid) {
          errors.push({
            field: field,
            message: result.message
          });
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors: errors
    };
  }

  /**
   * Formata telefone brasileiro
   * @param {string} value - Valor do input
   * @returns {string} - Valor formatado
   */
  function formatPhone(value) {
    // Remove tudo que nao e numero
    let numbers = value.replace(/\D/g, '');

    // Limita a 11 digitos
    if (numbers.length > 11) {
      numbers = numbers.slice(0, 11);
    }

    // Aplica mascara
    if (numbers.length === 0) {
      return '';
    } else if (numbers.length <= 2) {
      return '(' + numbers;
    } else if (numbers.length <= 7) {
      return '(' + numbers.slice(0, 2) + ') ' + numbers.slice(2);
    } else {
      return '(' + numbers.slice(0, 2) + ') ' + numbers.slice(2, 7) + '-' + numbers.slice(7);
    }
  }

  /**
   * Handler para input de telefone
   * @param {Event} event
   */
  function handlePhoneInput(event) {
    event.target.value = formatPhone(event.target.value);
  }

  /**
   * Define estado de loading no botao
   * @param {HTMLElement} button
   * @param {boolean} isLoading
   */
  function setButtonLoading(button, isLoading) {
    if (!button) return;

    if (isLoading) {
      button.dataset.originalText = button.innerHTML;
      button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
      button.disabled = true;
    } else {
      button.innerHTML = button.dataset.originalText || 'Enviar Mensagem';
      button.disabled = false;
    }
  }

  /**
   * Simula envio do formulario
   * @param {Object} data
   * @returns {Promise}
   */
  function submitForm(data) {
    // Simula requisicao ao servidor
    return new Promise(function(resolve) {
      setTimeout(function() {
        // Em producao, aqui seria feita a requisicao real
        console.log('Form data:', data);
        resolve({ success: true });
      }, 2000);
    });
  }

  /**
   * Handler de submit do formulario
   * @param {Event} event
   */
  async function handleFormSubmit(event) {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);

    // Valida formulario
    const validation = validateForm(data);

    if (!validation.valid) {
      // Mostra primeiro erro
      if (typeof Notification !== 'undefined' && Notification.show) {
        Notification.show(validation.errors[0].message, 'error');
      } else {
        alert(validation.errors[0].message);
      }
      return;
    }

    // Mostra loading
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    setButtonLoading(submitBtn, true);

    try {
      // Envia formulario
      const result = await submitForm(data);

      if (result.success) {
        // Sucesso
        if (typeof Notification !== 'undefined' && Notification.show) {
          Notification.show('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
        } else {
          alert('Mensagem enviada com sucesso!');
        }
        contactForm.reset();
      }
    } catch (error) {
      // Erro
      if (typeof Notification !== 'undefined' && Notification.show) {
        Notification.show('Erro ao enviar mensagem. Tente novamente.', 'error');
      } else {
        alert('Erro ao enviar mensagem.');
      }
    } finally {
      setButtonLoading(submitBtn, false);
    }
  }

  // ==================== PUBLIC METHODS ====================

  /**
   * Inicializa o modulo
   */
  function init() {
    contactForm = document.getElementById('contact-form');

    if (contactForm) {
      // Event listener para submit
      contactForm.addEventListener('submit', handleFormSubmit);

      // Mascara de telefone
      const phoneInput = document.getElementById('phone');
      if (phoneInput) {
        phoneInput.addEventListener('input', handlePhoneInput);
      }
    }
  }

  /**
   * Destroi o modulo (cleanup)
   */
  function destroy() {
    if (contactForm) {
      contactForm.removeEventListener('submit', handleFormSubmit);
    }
  }

  // API publica
  return {
    init: init,
    destroy: destroy,
    validate: validateForm,
    formatPhone: formatPhone
  };
})();

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = FormHandler;
}

/* ============================================
   Dr. Lucas Duarte - Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // ==================== VARIABLES ====================
    const header = document.getElementById('header');
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle');
    const navClose = document.getElementById('nav-close');
    const navLinks = document.querySelectorAll('.nav__link');
    const backToTop = document.getElementById('back-to-top');
    const contactForm = document.getElementById('contact-form');
    const sections = document.querySelectorAll('section[id]');

    // ==================== MOBILE MENU ====================
    // Open menu
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.add('show-menu');
            document.body.style.overflow = 'hidden';
        });
    }

    // Close menu
    if (navClose) {
        navClose.addEventListener('click', function() {
            navMenu.classList.remove('show-menu');
            document.body.style.overflow = '';
        });
    }

    // Close menu when clicking on nav links
    navLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            navMenu.classList.remove('show-menu');
            document.body.style.overflow = '';
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!navMenu.contains(event.target) && !navToggle.contains(event.target)) {
            navMenu.classList.remove('show-menu');
            document.body.style.overflow = '';
        }
    });

    // ==================== HEADER SCROLL EFFECT ====================
    function handleHeaderScroll() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleHeaderScroll);

    // ==================== BACK TO TOP BUTTON ====================
    function handleBackToTop() {
        if (window.scrollY > 400) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    }

    window.addEventListener('scroll', handleBackToTop);

    // ==================== ACTIVE LINK ON SCROLL ====================
    function highlightActiveSection() {
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

    window.addEventListener('scroll', highlightActiveSection);

    // ==================== SMOOTH SCROLL ====================
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');

            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ==================== CONTACT FORM ====================
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);

            // Basic validation
            if (!validateForm(data)) {
                return;
            }

            // Show loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            submitBtn.disabled = true;

            // Simulate form submission (replace with actual submission logic)
            setTimeout(function() {
                // Reset button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;

                // Show success message
                showNotification('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');

                // Reset form
                contactForm.reset();
            }, 2000);
        });
    }

    function validateForm(data) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!data.name || data.name.trim().length < 3) {
            showNotification('Por favor, insira seu nome completo.', 'error');
            return false;
        }

        if (!data.email || !emailRegex.test(data.email)) {
            showNotification('Por favor, insira um e-mail válido.', 'error');
            return false;
        }

        if (!data.subject) {
            showNotification('Por favor, selecione um assunto.', 'error');
            return false;
        }

        if (!data.message || data.message.trim().length < 10) {
            showNotification('Por favor, escreva uma mensagem mais detalhada.', 'error');
            return false;
        }

        return true;
    }

    // ==================== NOTIFICATION SYSTEM ====================
    function showNotification(message, type) {
        // Remove existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'notification notification--' + type;
        notification.innerHTML = '\
            <div class="notification__content">\
                <i class="fas ' + (type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle') + '"></i>\
                <span>' + message + '</span>\
            </div>\
            <button class="notification__close">\
                <i class="fas fa-times"></i>\
            </button>\
        ';

        // Add styles
        notification.style.cssText = '\
            position: fixed;\
            top: 100px;\
            right: 20px;\
            max-width: 400px;\
            padding: 16px 20px;\
            background: ' + (type === 'success' ? '#10b981' : '#ef4444') + ';\
            color: white;\
            border-radius: 10px;\
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);\
            z-index: 10000;\
            display: flex;\
            align-items: center;\
            justify-content: space-between;\
            gap: 15px;\
            animation: slideInRight 0.3s ease;\
        ';

        // Add animation keyframes
        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = '\
                @keyframes slideInRight {\
                    from {\
                        opacity: 0;\
                        transform: translateX(100px);\
                    }\
                    to {\
                        opacity: 1;\
                        transform: translateX(0);\
                    }\
                }\
                .notification__content {\
                    display: flex;\
                    align-items: center;\
                    gap: 10px;\
                }\
                .notification__close {\
                    background: none;\
                    border: none;\
                    color: white;\
                    cursor: pointer;\
                    padding: 5px;\
                    opacity: 0.8;\
                    transition: opacity 0.2s;\
                }\
                .notification__close:hover {\
                    opacity: 1;\
                }\
            ';
            document.head.appendChild(style);
        }

        // Add to DOM
        document.body.appendChild(notification);

        // Close button functionality
        notification.querySelector('.notification__close').addEventListener('click', function() {
            notification.remove();
        });

        // Auto remove after 5 seconds
        setTimeout(function() {
            if (notification.parentNode) {
                notification.style.animation = 'slideInRight 0.3s ease reverse';
                setTimeout(function() {
                    notification.remove();
                }, 300);
            }
        }, 5000);
    }

    // ==================== PHONE MASK ====================
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');

            if (value.length > 11) {
                value = value.slice(0, 11);
            }

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

    // ==================== SCROLL ANIMATIONS ====================
    function animateOnScroll() {
        const animatedElements = document.querySelectorAll('.specialty__card, .timeline__item, .content__card, .contact__card, .value');

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        animatedElements.forEach(function(element, index) {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'opacity 0.6s ease ' + (index * 0.1) + 's, transform 0.6s ease ' + (index * 0.1) + 's';
            observer.observe(element);
        });
    }

    // Initialize scroll animations
    animateOnScroll();

    // ==================== STATS COUNTER ====================
    function animateStats() {
        const stats = document.querySelectorAll('.stat__number');

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const stat = entry.target;
                    const text = stat.textContent;

                    // Check if it's a number or text
                    if (text.includes('%')) {
                        animateNumber(stat, 0, 100, '%');
                    } else if (text.includes('+')) {
                        animateNumber(stat, 0, 500, '+', true);
                    } else if (text.includes('h')) {
                        animateNumber(stat, 0, 24, 'h');
                    }

                    observer.unobserve(stat);
                }
            });
        }, { threshold: 0.5 });

        stats.forEach(function(stat) {
            observer.observe(stat);
        });
    }

    function animateNumber(element, start, end, suffix, prefix) {
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

            if (prefix) {
                element.textContent = '+' + current;
            } else {
                element.textContent = current + suffix;
            }
        }, stepDuration);
    }

    // Initialize stats animation
    animateStats();

    // ==================== PRELOADER (OPTIONAL) ====================
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');

        // Remove preloader if exists
        const preloader = document.querySelector('.preloader');
        if (preloader) {
            preloader.style.opacity = '0';
            setTimeout(function() {
                preloader.remove();
            }, 500);
        }
    });

    // ==================== YEAR UPDATE ====================
    const yearElements = document.querySelectorAll('[data-year]');
    const currentYear = new Date().getFullYear();
    yearElements.forEach(function(element) {
        element.textContent = currentYear;
    });

    // ==================== CONSOLE MESSAGE ====================
    console.log('%c Dr. Lucas Duarte ', 'background: #2563eb; color: white; font-size: 20px; padding: 10px 20px; border-radius: 5px;');
    console.log('%c Website desenvolvido com dedicação ', 'color: #6b7280; font-size: 12px;');
});

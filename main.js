/* ============================================
   AQUA PLUMBING SOLUTIONS — MAIN JAVASCRIPT
   Version: 3.3.0 — Production Ready
   Features: focus trap, aria-current auto-detect,
   popup-safe form, WhatsApp click tracking
   ============================================ */

'use strict';

document.addEventListener('DOMContentLoaded', function () {
    initNavigation();
    initDropdowns();
    initScrollEffects();
    initFAQAccordion();
    initFormValidation();
    initAriaCurrent();
    initWhatsAppTracking();
});

/* ============================================================
   MOBILE NAVIGATION
   ============================================================ */
function initNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navList = document.getElementById('nav-list');
    if (!navToggle || !navList) return;
    if (navToggle.dataset.bound === 'true') return;
    navToggle.dataset.bound = 'true';

    function getFocusable() {
        return navList.querySelectorAll(
            'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
    }

    function trapFocus(e) {
        if (e.key !== 'Tab') return;
        const focusable = getFocusable();
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
        }
    }

    function openMenu() {
        navList.classList.add('open');
        navToggle.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
        document.addEventListener('keydown', trapFocus);
        const firstLink = navList.querySelector('a');
        if (firstLink) {
            window.setTimeout(function () { firstLink.focus(); }, 80);
        }
    }

    function closeMenu() {
        navList.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        document.removeEventListener('keydown', trapFocus);
        if (document.activeElement && navList.contains(document.activeElement)) {
            navToggle.focus();
        }
    }

    navToggle.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (navList.classList.contains('open')) closeMenu();
        else openMenu();
    });

    document.addEventListener('click', function (e) {
        if (!navList.classList.contains('open')) return;
        if (!navList.contains(e.target) && !navToggle.contains(e.target)) {
            closeMenu();
        }
    });

    navList.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
            if (window.innerWidth <= 1024) closeMenu();
        });
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && navList.classList.contains('open')) closeMenu();
    });

    let resizeTimer;
    window.addEventListener('resize', function () {
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(function () {
            if (window.innerWidth > 1024 && navList.classList.contains('open')) closeMenu();
        }, 120);
    });
}

/* ============================================================
   DROPDOWN MENUS
   ============================================================ */
function initDropdowns() {
    const dropdowns = document.querySelectorAll('.dropdown');
    if (!dropdowns.length) return;

    dropdowns.forEach(function (dropdown) {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        if (!toggle) return;

        toggle.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            dropdowns.forEach(function (other) {
                if (other !== dropdown) {
                    other.classList.remove('open');
                    const t = other.querySelector('.dropdown-toggle');
                    if (t) t.setAttribute('aria-expanded', 'false');
                }
            });
            const isOpen = dropdown.classList.toggle('open');
            toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });
    });

    document.addEventListener('click', function (e) {
        dropdowns.forEach(function (dropdown) {
            if (!dropdown.contains(e.target)) {
                dropdown.classList.remove('open');
                const toggle = dropdown.querySelector('.dropdown-toggle');
                if (toggle) toggle.setAttribute('aria-expanded', 'false');
            }
        });
    });
}

/* ============================================================
   SCROLL EFFECTS
   ============================================================ */
function initScrollEffects() {
    const header = document.getElementById('site-header');
    const floatingWhatsApp = document.querySelector('.floating-whatsapp');

    let ticking = false;
    function onScroll() {
        const y = window.pageYOffset || document.documentElement.scrollTop;
        if (header) {
            if (y > 50) header.classList.add('scrolled');
            else header.classList.remove('scrolled');
        }
        if (floatingWhatsApp) {
            if (y > 300) floatingWhatsApp.classList.add('visible');
            else floatingWhatsApp.classList.remove('visible');
        }
        ticking = false;
    }

    window.addEventListener('scroll', function () {
        if (!ticking) {
            window.requestAnimationFrame(onScroll);
            ticking = true;
        }
    }, { passive: true });

    onScroll();
}

/* ============================================================
   FAQ ACCORDION
   ============================================================ */
function initFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    if (!faqItems.length) return;

    faqItems.forEach(function (item) {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        if (!question || !answer) return;

        question.addEventListener('click', function () {
            const isOpen = item.classList.toggle('open');
            faqItems.forEach(function (other) {
                if (other !== item) {
                    other.classList.remove('open');
                    const a = other.querySelector('.faq-answer');
                    if (a) a.style.maxHeight = '0';
                }
            });
            if (isOpen) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
            } else {
                answer.style.maxHeight = '0';
            }
        });
    });

    if (faqItems[0]) {
        const firstAnswer = faqItems[0].querySelector('.faq-answer');
        if (firstAnswer) {
            faqItems[0].classList.add('open');
            firstAnswer.style.maxHeight = firstAnswer.scrollHeight + 'px';
        }
    }
}

/* ============================================================
   CONTACT FORM — popup-safe WhatsApp handoff
   ============================================================ */
function initFormValidation() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();
        let isValid = true;
        const formData = new FormData(contactForm);
        const requiredFields = contactForm.querySelectorAll('[required]');

        requiredFields.forEach(function (field) {
            const value = (field.value || '').trim();
            const errorElement = field.parentElement.querySelector('.form-error');

            field.classList.remove('error');
            if (errorElement) errorElement.textContent = '';

            if (!value) {
                isValid = false;
                field.classList.add('error');
                if (errorElement) errorElement.textContent = 'This field is required';
                return;
            }

            if (field.type === 'tel' && value) {
                const clean = value.replace(/[\s\-()]/g, '');
                const re = /^(?:\+?254|0)(?:7|1)\d{8}$/;
                if (!re.test(clean)) {
                    isValid = false;
                    field.classList.add('error');
                    if (errorElement) {
                        errorElement.textContent = 'Enter a valid Kenyan phone (e.g., 0712 345 678)';
                    }
                }
            }
        });

        if (!isValid) {
            const firstError = contactForm.querySelector('.error');
            if (firstError) firstError.focus();
            return;
        }

        const name = formData.get('name') || '';
        const phone = formData.get('phone') || '';
        const location = formData.get('location') || '';
        const service = formData.get('service') || '';
        const description = formData.get('description') || '';

        const message =
            'Hello Aqua, I need help with a plumbing issue.\n\n' +
            'Name: ' + name + '\n' +
            'Phone: ' + phone + '\n' +
            'Location: ' + location + '\n' +
            'Service: ' + service + '\n' +
            'Description: ' + description;

        const whatsappUrl = 'https://wa.me/254702555093?text=' + encodeURIComponent(message);

        let panel = contactForm.querySelector('.form-success');
        if (!panel) {
            panel = document.createElement('div');
            panel.className = 'form-success';
            panel.setAttribute('role', 'status');
            panel.setAttribute('aria-live', 'polite');
            contactForm.appendChild(panel);
        }
        panel.innerHTML =
            '<p><strong>✅ Your message is ready, ' + escapeHtml(name) + '!</strong></p>' +
            '<p style="font-size:0.95rem;">Tap below to open WhatsApp and send it. If it doesn\'t open automatically, your popup blocker may be active.</p>' +
            '<a href="' + whatsappUrl + '" target="_blank" rel="noopener" class="btn btn-gold">💬 Open WhatsApp</a>';

        panel.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });

    contactForm.querySelectorAll('input, textarea, select').forEach(function (field) {
        field.addEventListener('input', function () {
            field.classList.remove('error');
            const errorElement = field.parentElement.querySelector('.form-error');
            if (errorElement) errorElement.textContent = '';
        });
    });
}

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

/* ============================================================
   ARIA-CURRENT — Auto-mark active page
   ============================================================ */
function initAriaCurrent() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    const pageFile = path.indexOf('.') > -1 ? path : path + '.html';

    document.querySelectorAll('.nav-list a').forEach(function (link) {
        const href = link.getAttribute('href') || '';
        const hrefFile = href.split('/').pop().split('?')[0] || 'index.html';
        const isHome =
            (pageFile === 'index.html' || pageFile === '') &&
            (hrefFile === 'index.html' || hrefFile === '' || href === '/');
        if (hrefFile === pageFile || isHome) {
            link.setAttribute('aria-current', 'page');
        }
    });
}

/* ============================================================
   WHATSAPP CLICK TRACKING
   ============================================================ */
function initWhatsAppTracking() {
    document.querySelectorAll('a[href*="wa.me"]').forEach(function (link) {
        link.addEventListener('click', function () {
            const payload = {
                event: 'whatsapp_click',
                page: window.location.pathname,
                link_text: (link.textContent || '').trim().slice(0, 60),
            };
            if (Array.isArray(window.dataLayer)) window.dataLayer.push(payload);
            if (typeof window.gtag === 'function') {
                window.gtag('event', 'whatsapp_click', {
                    page_path: window.location.pathname,
                });
            }
        });
    });
}
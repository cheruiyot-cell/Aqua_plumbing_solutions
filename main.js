/* ============================================
   AQUA PLUMBING SOLUTIONS - MAIN JAVASCRIPT
   Version: 3.0.0 - Production Ready
   ============================================ */

'use strict';

document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initDropdowns();
    initScrollEffects();
    initFAQAccordion();
    initFormValidation();
    initSmoothScroll();
    initPhoneCopy();
    initErrorHandling();
});

/**
 * MOBILE NAVIGATION TOGGLE (HAMBURGER MENU)
 * Fixes: Menu not opening, not closing on outside click, not closing on link click.
 */
function initNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navList = document.getElementById('nav-list');
    const header = document.getElementById('site-header');

    if (!navToggle || !navList) return;

    // 1. Toggle menu when hamburger is clicked
    navToggle.addEventListener('click', function(e) {
        e.stopPropagation(); // Prevent immediate close
        const isOpen = navList.classList.toggle('open');
        navToggle.setAttribute('aria-expanded', isOpen);
        
        // Animate hamburger to X
        const hamburgers = navToggle.querySelectorAll('.hamburger');
        if (isOpen) {
            hamburgers[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            hamburgers[1].style.opacity = '0';
            hamburgers[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
        } else {
            hamburgers[0].style.transform = 'none';
            hamburgers[1].style.opacity = '1';
            hamburgers[2].style.transform = 'none';
        }
    });

    // 2. Close menu when clicking OUTSIDE the nav
    document.addEventListener('click', function(e) {
        if (!navList.contains(e.target) && !navToggle.contains(e.target)) {
            closeMenu();
        }
    });

    // 3. Close menu when clicking a navigation LINK
    navList.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function() {
            closeMenu();
        });
    });

    // 4. Close menu on Escape key (Accessibility)
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeMenu();
        }
    });

    // 5. Close menu when resizing to desktop
    window.addEventListener('resize', function() {
        if (window.innerWidth > 1024) {
            closeMenu();
        }
    });

    // Helper function to close menu
    function closeMenu() {
        navList.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        
        // Reset hamburger animation
        const hamburgers = navToggle.querySelectorAll('.hamburger');
        hamburgers[0].style.transform = 'none';
        hamburgers[1].style.opacity = '1';
        hamburgers[2].style.transform = 'none';
    }
}

/**
 * DROPDOWN MENUS (Services)
 * Handles opening/closing on both mobile and desktop.
 */
function initDropdowns() {
    const dropdowns = document.querySelectorAll('.dropdown');

    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        
        if (!toggle) return;

        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            // Close other dropdowns
            dropdowns.forEach(otherDropdown => {
                if (otherDropdown !== dropdown) {
                    otherDropdown.classList.remove('open');
                    const otherToggle = otherDropdown.querySelector('.dropdown-toggle');
                    if (otherToggle) otherToggle.setAttribute('aria-expanded', 'false');
                }
            });

            // Toggle current dropdown
            const isOpen = dropdown.classList.toggle('open');
            toggle.setAttribute('aria-expanded', isOpen);
        });
    });

    // Close all dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        dropdowns.forEach(dropdown => {
            if (!dropdown.contains(e.target)) {
                dropdown.classList.remove('open');
                const toggle = dropdown.querySelector('.dropdown-toggle');
                if (toggle) toggle.setAttribute('aria-expanded', 'false');
            }
        });
    });
}

/**
 * SCROLL EFFECTS
 * Adds shadow to header and shows floating WhatsApp button after scrolling.
 */
function initScrollEffects() {
    const header = document.getElementById('site-header');
    const floatingWhatsApp = document.querySelector('.floating-whatsapp');

    if (header) {
        window.addEventListener('scroll', function() {
            const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
            if (currentScroll > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }, { passive: true });
    }

    if (floatingWhatsApp) {
        floatingWhatsApp.style.transition = 'opacity 0.3s ease';
        floatingWhatsApp.style.opacity = '0';
        floatingWhatsApp.style.pointerEvents = 'none';

        window.addEventListener('scroll', function() {
            const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
            if (currentScroll > 300) {
                floatingWhatsApp.style.opacity = '1';
                floatingWhatsApp.style.pointerEvents = 'auto';
            } else {
                floatingWhatsApp.style.opacity = '0';
                floatingWhatsApp.style.pointerEvents = 'none';
            }
        }, { passive: true });
    }
}

/**
 * FAQ ACCORDION
 * Handles the FAQ section (if present on the page).
 */
function initFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    if (faqItems.length === 0) return;

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        if (!question || !answer) return;

        question.addEventListener('click', function() {
            const isOpen = item.classList.toggle('open');

            // Close other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('open');
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    if (otherAnswer) otherAnswer.style.maxHeight = '0';
                }
            });

            // Toggle current answer
            if (isOpen) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
            } else {
                answer.style.maxHeight = '0';
            }
        });
    });

    // Open first item by default
    if (faqItems[0]) {
        const firstAnswer = faqItems[0].querySelector('.faq-answer');
        const firstQuestion = faqItems[0].querySelector('.faq-question');
        if (firstAnswer && firstQuestion) {
            faqItems[0].classList.add('open');
            firstAnswer.style.maxHeight = firstAnswer.scrollHeight + 'px';
            firstQuestion.setAttribute('aria-expanded', 'true');
        }
    }
}

/**
 * CONTACT FORM VALIDATION
 * Validates the contact form and redirects to WhatsApp.
 */
function initFormValidation() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let isValid = true;
        const formData = new FormData(contactForm);

        // Validate required fields
        const requiredFields = contactForm.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            const value = field.value.trim();
            const errorElement = field.parentElement.querySelector('.form-error');

            if (!value) {
                isValid = false;
                field.classList.add('error');
                if (errorElement) {
                    errorElement.textContent = 'This field is required';
                    errorElement.style.display = 'block';
                }
            } else {
                field.classList.remove('error');
                if (errorElement) {
                    errorElement.style.display = 'none';
                }
            }

            // Phone validation
            if (field.type === 'tel' && value) {
                const cleanPhone = value.replace(/[\s\-()]/g, '');
                const phoneRegex = /^(?:\+?254|0)(?:7|1)\d{8}$/;
                if (!phoneRegex.test(cleanPhone)) {
                    isValid = false;
                    field.classList.add('error');
                    if (errorElement) {
                        errorElement.textContent = 'Enter a valid Kenyan phone (e.g., 0712 345 678)';
                        errorElement.style.display = 'block';
                    }
                }
            }

            // Email validation
            if (field.type === 'email' && value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    isValid = false;
                    field.classList.add('error');
                    if (errorElement) {
                        errorElement.textContent = 'Enter a valid email address';
                        errorElement.style.display = 'block';
                    }
                }
            }
        });

        if (isValid) {
            const name = formData.get('name') || '';
            const phone = formData.get('phone') || '';
            const location = formData.get('location') || '';
            const service = formData.get('service') || '';
            const description = formData.get('description') || '';

            const message = `Hello Aqua, I need help with a plumbing issue.\n\n` +
                           `Name: ${name}\n` +
                           `Phone: ${phone}\n` +
                           `Location: ${location}\n` +
                           `Service: ${service}\n` +
                           `Description: ${description}`;

            const whatsappUrl = `https://wa.me/254702555093?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

            const successMessage = document.createElement('div');
            successMessage.className = 'form-success';
            successMessage.textContent = 'Thank you! We will contact you on WhatsApp shortly.';
            contactForm.reset();
            contactForm.appendChild(successMessage);

            setTimeout(() => {
                successMessage.remove();
            }, 5000);
        }
    });

    // Remove error on input
    contactForm.querySelectorAll('input, textarea, select').forEach(field => {
        field.addEventListener('input', function() {
            field.classList.remove('error');
            const errorElement = field.parentElement.querySelector('.form-error');
            if (errorElement) errorElement.style.display = 'none';
        });
    });
}

/**
 * SMOOTH SCROLL
 * Handles smooth scrolling for in-page anchor links.
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

/**
 * PHONE COPY
 * Copies phone number to clipboard when clicking elements with [data-copy-phone].
 */
function initPhoneCopy() {
    const phoneElements = document.querySelectorAll('[data-copy-phone]');
    
    phoneElements.forEach(element => {
        element.addEventListener('click', function(e) {
            e.preventDefault();
            const phoneNumber = this.getAttribute('data-copy-phone');
            
            if (navigator.clipboard) {
                navigator.clipboard.writeText(phoneNumber).then(() => {
                    const originalText = this.textContent;
                    this.textContent = 'Copied!';
                    setTimeout(() => { this.textContent = originalText; }, 2000);
                });
            }
        });
    });
}

/**
 * ERROR HANDLING
 * Replaces broken images with a fallback icon.
 */
function initErrorHandling() {
    window.addEventListener('error', function(e) {
        if (e.target.tagName === 'IMG') {
            e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">📷</text></svg>';
        }
    }, true);
}
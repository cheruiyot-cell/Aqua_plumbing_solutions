/* ============================================
   AQUA PLUMBING SOLUTIONS - MAIN JAVASCRIPT
   Version: 2.0.0 - Production Ready
   Handles Absolute Paths, Form Validation,
   Navigation, and UI Interactions.
   ============================================ */

'use strict';

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize Base URL Fix (Critical for Absolute Paths)
    initBaseUrlFix();

    // Initialize all components
    initNavigation();
    initDropdowns();
    initScrollEffects();
    initScrollAnimations();
    initFAQAccordion();
    initFormValidation();
    initSmoothScroll();
    initPhoneCopy();
});

/**
 * CRITICAL: Fix Base URL for Absolute Paths
 * This function checks if the site is hosted in a subfolder (like localhost/mysite/)
 * and dynamically updates the <base> tag so all absolute paths (/style.css) work.
 */
function initBaseUrlFix() {
    // Get the current script path to determine the root
    // This works even if the script is loaded from a subfolder
    const scripts = document.getElementsByTagName('script');
    const currentScript = scripts[scripts.length - 1];
    const scriptPath = currentScript.src;
    
    // If the script is loaded from /main.js, we are at the root.
    // If it's loaded from /subfolder/main.js, we need to adjust.
    const basePath = scriptPath.substring(0, scriptPath.lastIndexOf('/') + 1);
    
    // Check if we need to add a <base> tag
    // Only add it if the script is NOT at the root (e.g., /main.js)
    if (basePath !== window.location.origin + '/') {
        const baseTag = document.createElement('base');
        baseTag.href = basePath;
        document.head.insertBefore(baseTag, document.head.firstChild);
    }
}

/**
 * Mobile Navigation Toggle
 */
function initNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navList = document.getElementById('nav-list');
    
    if (!navToggle || !navList) return;
    
    navToggle.addEventListener('click', function() {
        const isOpen = navList.classList.toggle('open');
        navToggle.setAttribute('aria-expanded', isOpen);
        navToggle.classList.toggle('active', isOpen);
        
        // Toggle hamburger animation
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
    
    // Close mobile nav when clicking outside
    document.addEventListener('click', function(e) {
        if (!navToggle.contains(e.target) && !navList.contains(e.target)) {
            navList.classList.remove('open');
            navToggle.setAttribute('aria-expanded', 'false');
            navToggle.classList.remove('active');
        }
    });
    
    // Close mobile nav on link click
    navList.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function() {
            navList.classList.remove('open');
            navToggle.setAttribute('aria-expanded', 'false');
            navToggle.classList.remove('active');
        });
    });
}

/**
 * Dropdown Menus (Mobile & Desktop)
 */
function initDropdowns() {
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        const menu = dropdown.querySelector('.dropdown-menu');
        
        if (!toggle || !menu) return;
        
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Close other dropdowns
            dropdowns.forEach(otherDropdown => {
                if (otherDropdown !== dropdown) {
                    otherDropdown.classList.remove('open');
                    const otherToggle = otherDropdown.querySelector('.dropdown-toggle');
                    if (otherToggle) {
                        otherToggle.setAttribute('aria-expanded', 'false');
                    }
                }
            });
            
            const isOpen = dropdown.classList.toggle('open');
            toggle.setAttribute('aria-expanded', isOpen);
        });
    });
    
    // Close dropdowns when clicking outside
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
 * Scroll Effects
 */
function initScrollEffects() {
    const header = document.getElementById('site-header');
    const floatingWhatsApp = document.querySelector('.floating-whatsapp');
    
    if (!header) return;
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add shadow on scroll
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Show/hide floating WhatsApp button
        if (floatingWhatsApp) {
            if (currentScroll > 300) {
                floatingWhatsApp.style.opacity = '1';
                floatingWhatsApp.style.pointerEvents = 'auto';
            } else {
                floatingWhatsApp.style.opacity = '0';
                floatingWhatsApp.style.pointerEvents = 'none';
            }
        }
    }, { passive: true });
    
    // Initial state
    if (floatingWhatsApp) {
        floatingWhatsApp.style.transition = 'opacity 0.3s ease';
        floatingWhatsApp.style.opacity = '0';
        floatingWhatsApp.style.pointerEvents = 'none';
    }
}

/**
 * Scroll Animations (Intersection Observer)
 */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.trust-item, .service-card, .process-step, .testimonial-card, .coverage-card, .pricing-tile');
    
    if (animatedElements.length === 0) return;
    
    // Check if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) {
        animatedElements.forEach(el => el.classList.add('animate-in'));
        return;
    }
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
    });
}

/**
 * FAQ Accordion
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
                    if (otherAnswer) {
                        otherAnswer.style.maxHeight = '0';
                    }
                    const otherQuestion = otherItem.querySelector('.faq-question');
                    if (otherQuestion) {
                        otherQuestion.setAttribute('aria-expanded', 'false');
                    }
                }
            });
            
            // Toggle current answer
            if (isOpen) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
                question.setAttribute('aria-expanded', 'true');
            } else {
                answer.style.maxHeight = '0';
                question.setAttribute('aria-expanded', 'false');
            }
        });
    });
    
    // Open first item by default
    const firstItem = faqItems[0];
    if (firstItem) {
        const firstQuestion = firstItem.querySelector('.faq-question');
        const firstAnswer = firstItem.querySelector('.faq-answer');
        if (firstQuestion && firstAnswer) {
            firstItem.classList.add('open');
            firstAnswer.style.maxHeight = firstAnswer.scrollHeight + 'px';
            firstQuestion.setAttribute('aria-expanded', 'true');
        }
    }
}

/**
 * Form Validation
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
            
            // Validate phone number
            if (field.type === 'tel' && value) {
                // Remove spaces, dashes, and parentheses
                const cleanPhone = value.replace(/[\s\-()]/g, '');
                
                // Kenyan mobile: 0XXXXXXXXX or +254XXXXXXXXX or 254XXXXXXXXX
                const phoneRegex = /^(?:\+?254|0)(?:7|1)\d{8}$/;
                
                if (!phoneRegex.test(cleanPhone)) {
                    isValid = false;
                    field.classList.add('error');
                    if (errorElement) {
                        errorElement.textContent = 'Please enter a valid Kenyan phone number (e.g., 0712 345 678)';
                        errorElement.style.display = 'block';
                    }
                }
            }
            
            // Validate email
            if (field.type === 'email' && value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    isValid = false;
                    field.classList.add('error');
                    if (errorElement) {
                        errorElement.textContent = 'Please enter a valid email address';
                        errorElement.style.display = 'block';
                    }
                }
            }
        });
        
        if (isValid) {
            // Build WhatsApp message (proper URL encoding)
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
            
            // Redirect to WhatsApp
            window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
            
            // Show success message
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
    
    // Remove error state on input
    contactForm.querySelectorAll('input, textarea, select').forEach(field => {
        field.addEventListener('input', function() {
            field.classList.remove('error');
            const errorElement = field.parentElement.querySelector('.form-error');
            if (errorElement) {
                errorElement.style.display = 'none';
            }
        });
    });
}

/**
 * Smooth Scroll for anchor links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * Clipboard Copy for Phone Numbers
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
                    setTimeout(() => {
                        this.textContent = originalText;
                    }, 2000);
                });
            }
        });
    });
}

// Initialize phone copy on load
document.addEventListener('DOMContentLoaded', initPhoneCopy);

/**
 * Handle 404 Errors Gracefully
 * This is an additional safety measure.
 * If a link points to a non-existent page (e.g., due to a typo),
 * redirect the user to the homepage.
 */
function init404Redirect() {
    // If the document title contains "404" or the page has a 404 status
    // (in some environments), redirect to home.
    if (document.title.includes('404')) {
        window.location.href = '/index.html';
    }
}

// Initialize 404 redirect
document.addEventListener('DOMContentLoaded', init404Redirect);
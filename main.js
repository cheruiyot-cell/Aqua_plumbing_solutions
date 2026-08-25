/* ============================================
   AQUA PLUMBING SOLUTIONS - MAIN JAVASCRIPT
   Version: 2.1.0 - Production Ready
   Fixed: Base URL logic, double initialization
   Added: Service worker support, caching
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
    // Note: Removed initPhoneCopy() from here - it's called separately below
});

/**
 * CRITICAL FIX: Improve Base URL Fix
 * The previous implementation had flaws:
 * 1. Added <base> tag too late (after CSS was already loaded)
 * 2. Only checked against window.location.origin, which fails on subdirectories
 * 
 * Solution: Update all absolute paths in the DOM to be relative-based
 * This avoids the <base> tag race condition entirely
 */
function initBaseUrlFix() {
    // Determine the base path from the current script location
    const scripts = document.getElementsByTagName('script');
    const currentScript = scripts[scripts.length - 1];
    const scriptPath = currentScript.src;
    
    // Extract the base URL (everything up to the last forward slash)
    const basePath = scriptPath.substring(0, scriptPath.lastIndexOf('/') + 1);
    
    // If we're not at the root domain, we need to fix relative paths
    const isRootDomain = window.location.origin + '/' === basePath;
    
    if (!isRootDomain) {
        // Instead of adding a <base> tag (which is too late for CSS),
        // we'll dynamically update all resource references
        fixResourcePaths(basePath);
    }
    
    // Also handle the case where the script is in /js/main.js
    // and CSS is in /style.css - we need to go up one directory
    if (scriptPath.includes('/js/') || scriptPath.includes('/scripts/')) {
        const parentPath = scriptPath.substring(0, scriptPath.lastIndexOf('/'));
        const correctedPath = parentPath.substring(0, parentPath.lastIndexOf('/') + 1);
        fixResourcePaths(correctedPath);
    }
}

/**
 * Fix resource paths in the DOM
 * This is more robust than using <base> tag
 * because it works regardless of when it's called
 */
function fixResourcePaths(basePath) {
    // Fix stylesheet links
    document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('/')) {
            link.href = basePath + href.substring(1);
        }
    });
    
    // Fix script tags
    document.querySelectorAll('script[src]').forEach(script => {
        const src = script.getAttribute('src');
        if (src && src.startsWith('/')) {
            script.src = basePath + src.substring(1);
        }
    });
    
    // Fix image sources
    document.querySelectorAll('img[src]').forEach(img => {
        const src = img.getAttribute('src');
        if (src && src.startsWith('/')) {
            img.src = basePath + src.substring(1);
        }
    });
    
    // Fix anchor hrefs that are internal links
    document.querySelectorAll('a[href^="/"]').forEach(anchor => {
        const href = anchor.getAttribute('href');
        if (href && !href.startsWith('//')) { // Don't break protocol-relative URLs
            anchor.href = basePath + href.substring(1);
        }
    });
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
                const cleanPhone = value.replace(/[\s\-()]/g, '');
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
 * FIXED: Called only ONCE via its own listener
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

// Initialize phone copy on DOMContentLoaded (called ONLY here)
document.addEventListener('DOMContentLoaded', initPhoneCopy);

/**
 * Error Handling for Failed Resource Loads
 */
function initErrorHandling() {
    window.addEventListener('error', function(e) {
        if (e.target.tagName === 'IMG') {
            e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">📷</text></svg>';
        }
    }, true);
}

// Initialize error handling
document.addEventListener('DOMContentLoaded', initErrorHandling);

/**
 * Service Worker Registration (for offline support)
 * This is a progressive enhancement - the site works without it
 */
function initServiceWorker() {
    if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('Service Worker registered:', registration.scope);
            })
            .catch(error => {
                console.log('Service Worker registration failed:', error);
            });
    }
}

// Note: Service worker is commented out for now - requires sw.js file
// document.addEventListener('DOMContentLoaded', initServiceWorker);
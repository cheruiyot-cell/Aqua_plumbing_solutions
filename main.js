/* ============================================
   AQUA PLUMBING SOLUTIONS - MAIN JAVASCRIPT
   Version: 3.2.0 - Production Ready
   Fix: Menu button not showing content
   ============================================ */

'use strict';

// Initialize all features immediately
document.addEventListener('DOMContentLoaded', function() {
    // Initialize navigation first (critical)
    initNavigation();
    
    // Initialize other features
    initDropdowns();
    initScrollEffects();
    initFAQAccordion();
    initFormValidation();
});

/**
 * MOBILE NAVIGATION TOGGLE (HAMBURGER MENU)
 * This function is the critical fix for menu not displaying.
 */
function initNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navList = document.getElementById('nav-list');

    if (!navToggle || !navList) {
        console.error('Navigation elements not found! Check IDs: nav-toggle, nav-list');
        return;
    }

    console.log('Navigation initialized successfully');

    // 1. Toggle menu when hamburger is clicked
    navToggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        console.log('Menu button clicked');
        
        // Toggle the open class
        const isOpen = navList.classList.toggle('open');
        navToggle.setAttribute('aria-expanded', isOpen);
        
        console.log('Menu is now:', isOpen ? 'OPEN' : 'CLOSED');
        
        // Animate hamburger to X
        const hamburgers = navToggle.querySelectorAll('.hamburger');
        if (hamburgers.length === 3) {
            if (isOpen) {
                hamburgers[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                hamburgers[1].style.opacity = '0';
                hamburgers[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
            } else {
                hamburgers[0].style.transform = 'none';
                hamburgers[1].style.opacity = '1';
                hamburgers[2].style.transform = 'none';
            }
        }
        
        // Toggle body scroll lock
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });

    // 2. Close menu when clicking OUTSIDE the nav
    document.addEventListener('click', function(e) {
        if (navList.classList.contains('open')) {
            if (!navList.contains(e.target) && !navToggle.contains(e.target)) {
                closeMenu();
            }
        }
    });

    // 3. Close menu when clicking a navigation LINK
    navList.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function() {
            closeMenu();
        });
    });

    // 4. Close menu on Escape key
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
        document.body.style.overflow = '';
        
        // Reset hamburger animation
        const hamburgers = navToggle.querySelectorAll('.hamburger');
        if (hamburgers.length === 3) {
            hamburgers[0].style.transform = 'none';
            hamburgers[1].style.opacity = '1';
            hamburgers[2].style.transform = 'none';
        }
    }
}

/**
 * DROPDOWN MENUS (Services)
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
        }
    }
}

/**
 * CONTACT FORM VALIDATION
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

// Debug function to check if elements exist
function debugNavigation() {
    console.log('=== NAVIGATION DEBUG ===');
    console.log('nav-toggle exists:', !!document.getElementById('nav-toggle'));
    console.log('nav-list exists:', !!document.getElementById('nav-list'));
    console.log('nav-list classes:', document.getElementById('nav-list') ? document.getElementById('nav-list').className : 'NOT FOUND');
    console.log('nav-toggle classes:', document.getElementById('nav-toggle') ? document.getElementById('nav-toggle').className : 'NOT FOUND');
    
    // Check CSS
    const navList = document.getElementById('nav-list');
    if (navList) {
        const styles = window.getComputedStyle(navList);
        console.log('nav-list display:', styles.display);
        console.log('nav-list position:', styles.position);
        console.log('nav-list z-index:', styles.zIndex);
        console.log('nav-list visibility:', styles.visibility);
        console.log('nav-list opacity:', styles.opacity);
        console.log('nav-list width:', styles.width);
        console.log('nav-list height:', styles.height);
        console.log('nav-list overflow:', styles.overflow);
    }
    
    // Check viewport
    console.log('Window width:', window.innerWidth);
    console.log('Window height:', window.innerHeight);
    
    // Check if media query is active
    const mediaQuery = window.matchMedia('(max-width: 1024px)');
    console.log('Mobile viewport (max-width: 1024px):', mediaQuery.matches);
    
    // Check body scroll
    console.log('Body overflow:', document.body.style.overflow);
    console.log('=== END DEBUG ===');
}

// Call debug on page load (remove in production)
// window.addEventListener('load', debugNavigation);
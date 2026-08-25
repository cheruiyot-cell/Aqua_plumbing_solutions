/* ============================================
   AQUA PLUMBING SOLUTIONS - MAIN JAVASCRIPT
   Version: 3.1.0 - Production Ready
   Fix: Mobile navigation full-screen display
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
    initBodyScrollLock();
});

/**
 * MOBILE NAVIGATION TOGGLE (HAMBURGER MENU)
 * Fixes: Menu not opening, not closing on outside click, not closing on link click,
 * thin vertical strip display, body scroll when menu open.
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
        
        // Enable body scroll
        document.body.style.overflow = '';
    }
}

/**
 * BODY SCROLL LOCK
 * Prevents page scrolling when mobile menu is open
 */
function initBodyScrollLock() {
    const navToggle = document.getElementById('nav-toggle');
    const navList = document.getElementById('nav-list');
    
    if (!navToggle || !navList) return;
    
    // Observe class changes on navList
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.attributeName === 'class') {
                if (navList.classList.contains('open')) {
                    document.body.style.overflow = 'hidden';
                } else {
                    document.body.style.overflow = '';
                }
            }
        });
    });
    
    observer.observe(navList, { attributes: true });
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
        let scrollTimeout;
        window.addEventListener('scroll', function() {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(function() {
                const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
                if (currentScroll > 50) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            }, 50);
        }, { passive: true });
    }

    if (floatingWhatsApp) {
        floatingWhatsApp.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        floatingWhatsApp.style.opacity = '0';
        floatingWhatsApp.style.pointerEvents = 'none';

        window.addEventListener('scroll', function() {
            const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
            if (currentScroll > 300) {
                floatingWhatsApp.style.opacity = '1';
                floatingWhatsApp.style.pointerEvents = 'auto';
                floatingWhatsApp.style.transform = 'scale(1)';
            } else {
                floatingWhatsApp.style.opacity = '0';
                floatingWhatsApp.style.pointerEvents = 'none';
                floatingWhatsApp.style.transform = 'scale(0.8)';
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
                    const otherQuestion = otherItem.querySelector('.faq-question');
                    if (otherQuestion) otherQuestion.setAttribute('aria-expanded', 'false');
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

/**
 * STICKY HEADER SHADOW
 * Adds shadow to header on scroll (alternative to initScrollEffects)
 */
function initStickyHeader() {
    const header = document.getElementById('site-header');
    if (!header) return;

    const observer = new IntersectionObserver(
        function(entries) {
            entries.forEach(function(entry) {
                if (!entry.isIntersecting) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            });
        },
        { threshold: 0.1 }
    );

    // Observe a sentinel element before the header
    const sentinel = document.createElement('div');
    sentinel.style.height = '1px';
    sentinel.style.position = 'absolute';
    sentinel.style.top = '0';
    document.body.insertBefore(sentinel, header);
    observer.observe(sentinel);
}

/**
 * BACK TO TOP BUTTON
 * Adds smooth scroll to top functionality
 */
function initBackToTop() {
    // Create button if it doesn't exist
    let backToTop = document.querySelector('.back-to-top');
    
    if (!backToTop) {
        backToTop = document.createElement('button');
        backToTop.className = 'back-to-top';
        backToTop.innerHTML = '↑';
        backToTop.setAttribute('aria-label', 'Back to top');
        document.body.appendChild(backToTop);
    }

    // Show/hide button
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        if (currentScroll > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }, { passive: true });

    // Scroll to top on click
    backToTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * FORM INPUT MASK
 * Formats phone input as Kenyan phone numbers
 */
function initInputMasks() {
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    
    phoneInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            let value = this.value.replace(/\D/g, '');
            
            // Limit to 10 digits (07XXXXXXXX or 2547XXXXXXXX)
            if (value.length > 10) {
                value = value.slice(0, 10);
            }
            
            // Format: 07XX XXX XXX
            if (value.length > 0) {
                let formatted = value;
                if (value.startsWith('07') || value.startsWith('01')) {
                    if (value.length > 4) {
                        formatted = value.slice(0, 4) + ' ' + value.slice(4);
                    }
                    if (value.length > 7) {
                        formatted = value.slice(0, 4) + ' ' + value.slice(4, 7) + ' ' + value.slice(7);
                    }
                }
                this.value = formatted;
            }
        });
    });
}

/**
 * LAZY LOAD IMAGES
 * Adds lazy loading to images for better performance
 */
function initLazyLoad() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.getAttribute('data-src');
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(function(img) {
            imageObserver.observe(img);
        });
    } else {
        // Fallback for older browsers
        images.forEach(function(img) {
            img.src = img.getAttribute('data-src');
        });
    }
}

/**
 * ACTIVE NAVIGATION LINK
 * Highlights current page in navigation
 */
function initActiveNav() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-list a');
    
    navLinks.forEach(function(link) {
        const linkPath = link.getAttribute('href');
        if (linkPath === currentPath) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

/**
 * WHATSAPP PRE-FILLED MESSAGES
 * Adds pre-filled message templates to WhatsApp links
 */
function initWhatsAppLinks() {
    const whatsappLinks = document.querySelectorAll('a[href*="wa.me"]');
    
    whatsappLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            // Allow normal navigation to WhatsApp
            // This is just for tracking if needed
            console.log('WhatsApp link clicked:', this.href);
        });
    });
}

/**
 * PAGE LOAD ANIMATIONS
 * Adds fade-in animations to sections on scroll
 */
function initScrollAnimations() {
    const sections = document.querySelectorAll('.service-card, .trust-item, .testimonial-card, .process-step, .pricing-tile');
    
    if (sections.length === 0) return;
    
    if ('IntersectionObserver' in window) {
        const sectionObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        sections.forEach(function(section) {
            sectionObserver.observe(section);
        });
    }
}

/**
 * EXPANDABLE TESTIMONIALS
 * Makes testimonial cards expandable for long quotes
 */
function initTestimonials() {
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    
    testimonialCards.forEach(function(card) {
        const quote = card.querySelector('.testimonial-quote');
        if (!quote) return;
        
        // Check if quote is too long
        if (quote.scrollHeight > 150) {
            const expandButton = document.createElement('button');
            expandButton.className = 'testimonial-expand';
            expandButton.textContent = 'Read More';
            
            card.appendChild(expandButton);
            
            expandButton.addEventListener('click', function() {
                card.classList.toggle('expanded');
                if (card.classList.contains('expanded')) {
                    expandButton.textContent = 'Read Less';
                    quote.style.maxHeight = 'none';
                } else {
                    expandButton.textContent = 'Read More';
                    quote.style.maxHeight = '150px';
                }
            });
            
            // Set initial max-height
            quote.style.maxHeight = '150px';
            quote.style.overflow = 'hidden';
            quote.style.transition = 'max-height 0.3s ease';
        }
    });
}

/**
 * ACCORDION FOR SERVICE DETAILS
 * Creates accordion for service details on mobile
 */
function initServiceAccordions() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(function(card) {
        const details = card.querySelector('.service-details');
        if (!details) return;
        
        const toggleButton = document.createElement('button');
        toggleButton.className = 'service-toggle';
        toggleButton.textContent = 'Learn More';
        
        card.appendChild(toggleButton);
        
        toggleButton.addEventListener('click', function() {
            details.classList.toggle('open');
            if (details.classList.contains('open')) {
                toggleButton.textContent = 'Show Less';
            } else {
                toggleButton.textContent = 'Learn More';
            }
        });
    });
}

/**
 * COUNTER ANIMATION
 * Animates numbers when they come into view
 */
function initCounterAnimation() {
    const counters = document.querySelectorAll('[data-counter]');
    
    if (counters.length === 0) return;
    
    if ('IntersectionObserver' in window) {
        const counterObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.getAttribute('data-counter'));
                    const duration = 2000;
                    const start = performance.now();
                    
                    function update(currentTime) {
                        const elapsed = currentTime - start;
                        const progress = Math.min(elapsed / duration, 1);
                        const easedProgress = 1 - Math.pow(1 - progress, 3); // easeOutCubic
                        counter.textContent = Math.floor(easedProgress * target).toLocaleString();
                        
                        if (progress < 1) {
                            requestAnimationFrame(update);
                        } else {
                            counter.textContent = target.toLocaleString();
                        }
                    }
                    
                    requestAnimationFrame(update);
                    observer.unobserve(counter);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(function(counter) {
            counterObserver.observe(counter);
        });
    }
}

/**
 * FORM AUTO-SAVE
 * Saves form data to localStorage
 */
function initFormAutoSave() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;
    
    const formFields = contactForm.querySelectorAll('input, textarea, select');
    
    formFields.forEach(function(field) {
        // Restore saved value
        const savedValue = localStorage.getItem('aqua_form_' + field.id);
        if (savedValue) {
            field.value = savedValue;
        }
        
        // Save on input
        field.addEventListener('input', function() {
            localStorage.setItem('aqua_form_' + field.id, field.value);
        });
    });
    
    // Clear on successful submit
    contactForm.addEventListener('submit', function() {
        formFields.forEach(function(field) {
            localStorage.removeItem('aqua_form_' + field.id);
        });
    });
}

/**
 * INITIALIZE ALL FEATURES
 * Called on DOMContentLoaded
 */
function initAll() {
    initNavigation();
    initDropdowns();
    initScrollEffects();
    initFAQAccordion();
    initFormValidation();
    initSmoothScroll();
    initPhoneCopy();
    initErrorHandling();
    initBodyScrollLock();
    initStickyHeader();
    initBackToTop();
    initInputMasks();
    initLazyLoad();
    initActiveNav();
    initWhatsAppLinks();
    initScrollAnimations();
    initTestimonials();
    initServiceAccordions();
    initCounterAnimation();
    initFormAutoSave();
}

// Handle page visibility change
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Page is hidden
        console.log('Page hidden');
    } else {
        // Page is visible
        console.log('Page visible');
    }
});

// Handle online/offline status
window.addEventListener('online', function() {
    console.log('Back online');
});

window.addEventListener('offline', function() {
    console.log('Offline');
});

// Handle before unload
window.addEventListener('beforeunload', function() {
    // Clean up if needed
});

// Initialize on DOMContentLoaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
} else {
    // DOM is already loaded
    initAll();
}
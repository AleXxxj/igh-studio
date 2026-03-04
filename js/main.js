// ========================================
// Igh Studio - Main JavaScript
// ========================================

// DOM Elements
const header = document.querySelector('.header');
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const customCursor = document.querySelector('.custom-cursor');
const cursorFollower = document.querySelector('.custom-cursor-follower');

// ========================================
// Header Scroll Effect
// ========================================
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// ========================================
// Mobile Menu Toggle
// ========================================
if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });
}

// Close mobile menu when clicking a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenuBtn?.classList.remove('active');
        navMenu?.classList.remove('active');
        document.body.classList.remove('menu-open');
    });
});

// ========================================
// Smooth Scroll for Anchor Links
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ========================================
// Custom Cursor
// ========================================
if (window.innerWidth > 1024 && customCursor && cursorFollower) {
    document.addEventListener('mousemove', (e) => {
        customCursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
        cursorFollower.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    });

    // Cursor hover effect on links and buttons
    const hoverElements = document.querySelectorAll('a, button, .btn, .service-card, .metric-item');
    
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            customCursor.style.transform += ' scale(1.5)';
            cursorFollower.style.transform += ' scale(1.5)';
            cursorFollower.style.borderColor = 'var(--purple-accent)';
        });
        
        el.addEventListener('mouseleave', () => {
            customCursor.style.transform = customCursor.style.transform.replace(' scale(1.5)', '');
            cursorFollower.style.transform = cursorFollower.style.transform.replace(' scale(1.5)', '');
            cursorFollower.style.borderColor = 'var(--primary-500)';
        });
    });
}

// ========================================
// Counter Animation for Metrics
// ========================================
class Counter {
    constructor(element, targetValue, duration = 2000, suffix = '') {
        this.element = element;
        this.targetValue = targetValue;
        this.duration = duration;
        this.suffix = suffix;
        this.currentValue = 0;
        this.interval = null;
        this.isAnimating = false;
    }

    start() {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        const increment = this.targetValue / (this.duration / 16);
        let current = 0;
        
        this.interval = setInterval(() => {
            current += increment;
            
            if (current >= this.targetValue) {
                current = this.targetValue;
                this.updateDisplay(current);
                this.stop();
            } else {
                this.updateDisplay(current);
            }
        }, 16);
    }

    updateDisplay(value) {
        this.element.textContent = Math.floor(value) + this.suffix;
    }

    stop() {
        clearInterval(this.interval);
        this.isAnimating = false;
    }
}

// Initialize counters when they come into view
const counters = document.querySelectorAll('.counter');
const counterInstances = [];

counters.forEach(counter => {
    const target = parseInt(counter.dataset.target);
    const suffix = counter.nextElementSibling?.classList.contains('suffix') 
        ? counter.nextElementSibling.textContent 
        : '';
    
    const instance = new Counter(counter, target, 2000, suffix);
    counterInstances.push({
        element: counter,
        instance,
        animated: false
    });
});

// Intersection Observer for counters
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counterData = counterInstances.find(c => c.element === entry.target);
            if (counterData && !counterData.animated) {
                counterData.instance.start();
                counterData.animated = true;
            }
        }
    });
}, { threshold: 0.5 });

counters.forEach(counter => counterObserver.observe(counter));

// ========================================
// Scroll Animation Observer
// ========================================
const animateElements = document.querySelectorAll('.animate-on-scroll');

const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            
            // Add delay if specified
            const delay = entry.target.dataset.delay;
            if (delay) {
                entry.target.style.transitionDelay = `${delay}s`;
            }
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

animateElements.forEach(el => scrollObserver.observe(el));

// ========================================
// Parallax Effect on Hero
// ========================================
const hero = document.querySelector('.hero');
if (hero) {
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        const heroContent = document.querySelector('.hero-content');
        const particles = document.querySelector('.hero-particles');
        
        if (heroContent) {
            heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
        }
        
        if (particles) {
            particles.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });
}

// ========================================
// Lazy Loading Images
// ========================================
const lazyImages = document.querySelectorAll('img[data-src]');

const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.add('loaded');
            imageObserver.unobserve(img);
        }
    });
});

lazyImages.forEach(img => imageObserver.observe(img));

// ========================================
// Form Validation (for contact page)
// ========================================
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Basic validation
        let isValid = true;
        const inputs = contactForm.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.classList.add('error');
                
                // Add error message
                const errorMsg = document.createElement('span');
                errorMsg.className = 'error-message';
                errorMsg.textContent = 'This field is required';
                input.parentNode.appendChild(errorMsg);
            } else {
                input.classList.remove('error');
                const errorMsg = input.parentNode.querySelector('.error-message');
                if (errorMsg) errorMsg.remove();
            }
        });
        
        if (isValid) {
            // Simulate form submission
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                submitBtn.textContent = 'Message Sent!';
                submitBtn.classList.add('success');
                
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    submitBtn.classList.remove('success');
                    contactForm.reset();
                }, 3000);
            }, 2000);
        }
    });
}

// ========================================
// Preloader
// ========================================
window.addEventListener('load', () => {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        preloader.classList.add('fade-out');
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }
});

// ========================================
// Back to Top Button
// ========================================
const backToTop = document.querySelector('.back-to-top');
if (backToTop) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
    
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

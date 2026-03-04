// ========================================
// Igh Studio - Animations JavaScript
// ========================================

// Initialize all animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations();
    initParallaxEffects();
    initHoverAnimations();
    initTextReveal();
    initCounterAnimations();
    initStaggerAnimations();
});

// ========================================
// Scroll Animation Observer
// ========================================
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    const observer = new IntersectionObserver((entries) => {
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
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(el => observer.observe(el));
}

// ========================================
// Parallax Effects
// ========================================
function initParallaxEffects() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        
        parallaxElements.forEach(el => {
            const speed = el.dataset.parallax || 0.5;
            const yPos = -(scrolled * speed);
            el.style.transform = `translateY(${yPos}px)`;
        });
    });
}

// ========================================
// Hover Animations
// ========================================
function initHoverAnimations() {
    // Card hover effects
    const cards = document.querySelectorAll('.service-card, .metric-item, .insight-card, .case-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', (e) => {
            card.classList.add('hover');
            
            // Add magnetic effect
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
        
        card.addEventListener('mouseleave', () => {
            card.classList.remove('hover');
        });
        
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });
    
    // Button hover effects
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(btn => {
        btn.addEventListener('mouseenter', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            btn.style.setProperty('--ripple-x', `${x}px`);
            btn.style.setProperty('--ripple-y', `${y}px`);
            btn.classList.add('ripple-effect');
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.classList.remove('ripple-effect');
        });
    });
}

// ========================================
// Text Reveal Animation
// ========================================
function initTextReveal() {
    const revealTexts = document.querySelectorAll('.reveal-text');
    
    revealTexts.forEach(text => {
        const words = text.textContent.split(' ');
        let html = '';
        
        words.forEach(word => {
            html += `<span class="reveal-word">${word} </span>`;
        });
        
        text.innerHTML = html;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.querySelectorAll('.reveal-word').forEach((word, index) => {
                        setTimeout(() => {
                            word.classList.add('revealed');
                        }, index * 50);
                    });
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(text);
    });
}

// ========================================
// Counter Animations
// ========================================
function initCounterAnimations() {
    const counters = document.querySelectorAll('.counter');
    
    counters.forEach(counter => {
        const target = parseInt(counter.dataset.target);
        const duration = parseInt(counter.dataset.duration) || 2000;
        const step = target / (duration / 16); // 60fps
        
        let current = 0;
        let interval;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    interval = setInterval(() => {
                        current += step;
                        if (current >= target) {
                            current = target;
                            clearInterval(interval);
                        }
                        counter.textContent = Math.floor(current);
                    }, 16);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(counter);
    });
}

// ========================================
// Stagger Children Animations
// ========================================
function initStaggerAnimations() {
    const staggerContainers = document.querySelectorAll('.stagger-children');
    
    staggerContainers.forEach(container => {
        const children = Array.from(container.children);
        
        children.forEach((child, index) => {
            child.style.animationDelay = `${index * 0.1}s`;
            child.classList.add('animate-stagger');
        });
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    children.forEach(child => {
                        child.classList.add('visible');
                    });
                }
            });
        }, { threshold: 0.1 });
        
        observer.observe(container);
    });
}

// ========================================
// Mouse Parallax (3D Effect)
// ========================================
document.addEventListener('mousemove', (e) => {
    const moveX = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
    const moveY = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
    
    const parallax3D = document.querySelectorAll('[data-parallax-3d]');
    
    parallax3D.forEach(el => {
        const depth = el.dataset.parallax3d || 10;
        const x = moveX * depth;
        const y = moveY * depth;
        
        el.style.transform = `translateX(${x}px) translateY(${y}px)`;
    });
});

// ========================================
// Smooth Scroll with Progress
// ========================================
window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    
    const progressBar = document.querySelector('.scroll-progress-bar');
    if (progressBar) {
        progressBar.style.width = scrolled + '%';
    }
});

// ========================================
// Loading Animation
// ========================================
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Fade in elements sequentially
    const loadElements = document.querySelectorAll('.animate-on-load');
    loadElements.forEach((el, index) => {
        setTimeout(() => {
            el.classList.add('visible');
        }, index * 200);
    });
});

// ========================================
// Magnetic Buttons Effect
// ========================================
const magneticButtons = document.querySelectorAll('[data-magnetic]');

magneticButtons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });
    
    btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0px, 0px)';
    });
});

// ========================================
// Floating Animation
// ========================================
function initFloatAnimations() {
    const floatElements = document.querySelectorAll('.float-animation');
    
    floatElements.forEach(el => {
        el.style.animation = `float ${3 + Math.random() * 2}s ease-in-out infinite`;
    });
}

// ========================================
// Typing Animation (for hero section)
// ========================================
function initTypingAnimation() {
    const typingElement = document.querySelector('[data-typing]');
    
    if (typingElement) {
        const text = typingElement.dataset.typing;
        const words = text.split('');
        let i = 0;
        
        typingElement.textContent = '';
        
        const interval = setInterval(() => {
            if (i < words.length) {
                typingElement.textContent += words[i];
                i++;
            } else {
                clearInterval(interval);
            }
        }, 100);
    }
}

// Call typing animation
initTypingAnimation();
initFloatAnimations();

// ========================================
// Add CSS for animations
// ========================================
const style = document.createElement('style');
style.textContent = `
    @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
    }
    
    .reveal-word {
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.5s ease;
    }
    
    .reveal-word.revealed {
        opacity: 1;
        transform: translateY(0);
    }
    
    .ripple-effect {
        position: relative;
        overflow: hidden;
    }
    
    .ripple-effect::after {
        content: '';
        position: absolute;
        top: var(--ripple-y);
        left: var(--ripple-x);
        width: 0;
        height: 0;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: translate(-50%, -50%);
        animation: ripple 0.5s ease-out;
    }
    
    @keyframes ripple {
        to {
            width: 300px;
            height: 300px;
            opacity: 0;
        }
    }
    
    .scroll-progress-bar {
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: linear-gradient(90deg, var(--primary-500), var(--purple-accent));
        z-index: 9999;
        transition: width 0.1s ease;
    }
`;

document.head.appendChild(style);

// ========================================
// Igh Studio - Particle Background
// ========================================

class ParticleBackground {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouseX = 0;
        this.mouseY = 0;
        this.mouseRadius = 100;
        
        this.init();
    }
    
    init() {
        this.resize();
        this.createParticles();
        this.animate();
        this.addEventListeners();
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createParticles() {
        const particleCount = Math.floor((this.canvas.width * this.canvas.height) / 10000);
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 1,
                baseX: Math.random() * this.canvas.width,
                baseY: Math.random() * this.canvas.height,
                density: Math.random() * 30 + 1
            });
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            // Mouse interaction
            const dx = this.mouseX - particle.x;
            const dy = this.mouseY - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < this.mouseRadius) {
                const force = (this.mouseRadius - distance) / this.mouseRadius;
                const angle = Math.atan2(dy, dx);
                const moveX = Math.cos(angle) * force * 5;
                const moveY = Math.sin(angle) * force * 5;
                
                particle.x -= moveX;
                particle.y -= moveY;
            } else {
                // Return to base position
                const dxBase = particle.baseX - particle.x;
                const dyBase = particle.baseY - particle.y;
                
                particle.x += dxBase * 0.01;
                particle.y += dyBase * 0.01;
            }
            
            // Update position with velocity
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Wrap around edges
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;
            
            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            
            // Gradient based on position
            const gradient = this.ctx.createRadialGradient(
                particle.x, particle.y, 0,
                particle.x, particle.y, particle.size * 2
            );
            gradient.addColorStop(0, 'rgba(14, 165, 233, 0.8)');
            gradient.addColorStop(1, 'rgba(139, 92, 246, 0.2)');
            
            this.ctx.fillStyle = gradient;
            this.ctx.fill();
            
            // Draw connections
            this.drawConnections(particle);
        });
        
        requestAnimationFrame(() => this.animate());
    }
    
    drawConnections(particle) {
        this.particles.forEach(other => {
            const dx = particle.x - other.x;
            const dy = particle.y - other.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                this.ctx.beginPath();
                this.ctx.strokeStyle = `rgba(14, 165, 233, ${1 - distance / 100})`;
                this.ctx.lineWidth = 0.5;
                this.ctx.moveTo(particle.x, particle.y);
                this.ctx.lineTo(other.x, other.y);
                this.ctx.stroke();
            }
        });
    }
    
    addEventListeners() {
        window.addEventListener('resize', () => this.resize());
        
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });
        
        document.addEventListener('mouseleave', () => {
            this.mouseX = -1000;
            this.mouseY = -1000;
        });
        
        // Touch support for mobile
        document.addEventListener('touchmove', (e) => {
            e.preventDefault();
            this.mouseX = e.touches[0].clientX;
            this.mouseY = e.touches[0].clientY;
        });
        
        document.addEventListener('touchend', () => {
            this.mouseX = -1000;
            this.mouseY = -1000;
        });
    }
}

// Initialize particles when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ParticleBackground('particles');
});

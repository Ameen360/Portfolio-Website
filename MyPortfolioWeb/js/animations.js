/**
 * Portfolio Website - Background Animation
 * Author: Aliu-Ameen Abdulrahman
 * Year: 2026
 *
 * This script creates an animated dark green background with particles
 */

(function () {
    // Canvas setup
    const canvas = document.getElementById('bgAnimation');
    if (!canvas || !canvas.getContext) return;
    const ctx = canvas.getContext('2d');

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    // Colors - dark green palette
    const colors = [
        'rgba(26, 93, 26, 0.8)',    // Primary dark green
        'rgba(46, 139, 46, 0.8)',   // Medium green
        'rgba(13, 61, 13, 0.8)',    // Darker green
        'rgba(30, 58, 46, 0.8)',    // Forest green
        'rgba(76, 175, 80, 0.8)'    // Accent green
    ];

    const connectionRadius = 150;
    const mouse = { x: null, y: null, radius: 150 };
    let particles = [];
    let animationId = null;

    // Fewer particles on small screens keeps phones smooth
    function getParticleCount() {
        const area = window.innerWidth * window.innerHeight;
        return Math.max(30, Math.min(100, Math.round(area / 12000)));
    }

    // Set canvas size to window size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    // Particle class
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 5 + 1;
            this.speedX = Math.random() * 3 - 1.5;
            this.speedY = Math.random() * 3 - 1.5;
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }

        // Update particle position
        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Bounce off edges
            if (this.x > canvas.width || this.x < 0) {
                this.speedX = -this.speedX;
                this.x = Math.max(0, Math.min(canvas.width, this.x));
            }
            if (this.y > canvas.height || this.y < 0) {
                this.speedY = -this.speedY;
                this.y = Math.max(0, Math.min(canvas.height, this.y));
            }

            // Gently push particles away from the mouse
            if (mouse.x !== null) {
                const dx = this.x - mouse.x;
                const dy = this.y - mouse.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance > 0 && distance < mouse.radius) {
                    const force = (mouse.radius - distance) / mouse.radius;
                    this.x += (dx / distance) * force * 2;
                    this.y += (dy / distance) * force * 2;
                }
            }
        }

        // Draw particle
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        const count = getParticleCount();
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }

    // Draw connections between particles
    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < connectionRadius) {
                    const opacity = 1 - (distance / connectionRadius);
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(76, 175, 80, ${opacity * 0.2})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }
    }

    function drawFrame(move) {
        // Semi-transparent fill leaves the soft trail effect
        ctx.fillStyle = 'rgba(18, 18, 18, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < particles.length; i++) {
            if (move) particles[i].update();
            particles[i].draw();
        }
        drawConnections();
    }

    // Animation loop
    function animate() {
        drawFrame(true);
        animationId = requestAnimationFrame(animate);
    }

    function start() {
        stop();
        if (reducedMotion.matches) {
            // Draw a single still frame for users who prefer less motion
            ctx.fillStyle = 'rgb(18, 18, 18)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            drawFrame(false);
        } else {
            animate();
        }
    }

    function stop() {
        if (animationId !== null) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
    }

    // Handle window resize (debounced)
    let resizeTimer;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
            resizeCanvas();
            initParticles();
            start();
        }, 150);
    });

    // Pause when the tab is hidden to save battery
    document.addEventListener('visibilitychange', function () {
        if (document.hidden) {
            stop();
        } else {
            start();
        }
    });

    if (reducedMotion.addEventListener) {
        reducedMotion.addEventListener('change', start);
    }

    // Mouse interaction
    window.addEventListener('mousemove', function (event) {
        mouse.x = event.clientX;
        mouse.y = event.clientY;
    });

    document.addEventListener('mouseleave', function () {
        mouse.x = null;
        mouse.y = null;
    });

    resizeCanvas();
    initParticles();
    start();
})();

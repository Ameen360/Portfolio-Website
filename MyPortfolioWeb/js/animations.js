/**
 * Portfolio Website - Background Animation
 * Author: Aliu-Ameen Abdulrahman
 * Year: 2025
 * 
 * This script creates an animated dark green background with particles
 */

// Canvas setup
const canvas = document.getElementById('bgAnimation');
const ctx = canvas.getContext('2d');

// Set canvas size to window size
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

// Initialize canvas size
resizeCanvas();

// Handle window resize
window.addEventListener('resize', resizeCanvas);

// Particle class
class Particle {
    constructor() {
        // Position
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        
        // Size
        this.size = Math.random() * 5 + 1;
        
        // Velocity
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = Math.random() * 3 - 1.5;
        
        // Colors - dark green palette
        this.color = this.getRandomColor();
        
        // Opacity
        this.alpha = Math.random() * 0.5 + 0.1;
        
        // Connection distance
        this.connectionRadius = 150;
    }
    
    // Get random color from dark green palette
    getRandomColor() {
        const colors = [
            'rgba(26, 93, 26, 0.8)',    // Primary dark green
            'rgba(46, 139, 46, 0.8)',   // Medium green
            'rgba(13, 61, 13, 0.8)',    // Darker green
            'rgba(30, 58, 46, 0.8)',    // Forest green
            'rgba(76, 175, 80, 0.8)'    // Accent green
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    // Update particle position
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Bounce off edges
        if (this.x > canvas.width || this.x < 0) {
            this.speedX = -this.speedX;
        }
        
        if (this.y > canvas.height || this.y < 0) {
            this.speedY = -this.speedY;
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

// Create particles array
const particles = [];
const particleCount = 100; // Adjust for performance

// Initialize particles
for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
}

// Draw connections between particles
function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < particles[i].connectionRadius) {
                // Calculate opacity based on distance
                const opacity = 1 - (distance / particles[i].connectionRadius);
                
                // Draw line
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

// Animation loop
function animate() {
    // Clear canvas with semi-transparent background for trail effect
    ctx.fillStyle = 'rgba(18, 18, 18, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Update and draw particles
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
    }
    
    // Draw connections
    drawConnections();
    
    // Continue animation
    requestAnimationFrame(animate);
}

// Start animation
animate();

// Add mouse interaction
let mouse = {
    x: null,
    y: null,
    radius: 150
};

// Update mouse position
window.addEventListener('mousemove', function(event) {
    mouse.x = event.x;
    mouse.y = event.y;
});

// Reset mouse position when mouse leaves canvas
window.addEventListener('mouseout', function() {
    mouse.x = undefined;
    mouse.y = undefined;
});
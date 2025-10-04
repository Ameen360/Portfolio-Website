/**
 * Portfolio Website - Main JavaScript
 * Author: Aliu-Ameen Abdulrahman
 * Year: 2025
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const navbar = document.querySelector('.navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');
    const backToTopBtn = document.getElementById('backToTop');
    const contactForm = document.getElementById('contactForm');
    
    // Mobile Navigation Toggle
    navToggle.addEventListener('click', function() {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Close mobile menu when clicking a nav link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Section scroll animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };
    
    const sectionObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        sectionObserver.observe(section);
    });
    
    // Back to top button
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });
    
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Contact form validation and submission
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form fields
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const subjectInput = document.getElementById('subject');
            const messageInput = document.getElementById('message');
            
            // Simple validation
            let isValid = true;
            
            // Name validation
            if (nameInput.value.trim() === '') {
                showError(nameInput, 'Name is required');
                isValid = false;
            } else {
                removeError(nameInput);
            }
            
            // Email validation
            if (emailInput.value.trim() === '') {
                showError(emailInput, 'Email is required');
                isValid = false;
            } else if (!isValidEmail(emailInput.value)) {
                showError(emailInput, 'Please enter a valid email');
                isValid = false;
            } else {
                removeError(emailInput);
            }
            
            // Subject validation
            if (subjectInput.value.trim() === '') {
                showError(subjectInput, 'Subject is required');
                isValid = false;
            } else {
                removeError(subjectInput);
            }
            
            // Message validation
            if (messageInput.value.trim() === '') {
                showError(messageInput, 'Message is required');
                isValid = false;
            } else {
                removeError(messageInput);
            }
            
            // If form is valid, submit it (or show success message)
            if (isValid) {
                // In a real application, you would send the form data to a server
                // For this example, we'll just show a success message
                
                // Clear form fields
                contactForm.reset();
                
                // Show success message
                showFormMessage('Message sent successfully! I will get back to you soon.', 'success');
                
                // Hide success message after 5 seconds
                setTimeout(() => {
                    const formMessage = document.querySelector('.form-message');
                    if (formMessage) {
                        formMessage.remove();
                    }
                }, 5000);
            }
        });
    }
    
    // Helper function to show form field error
    function showError(input, message) {
        // Remove any existing error
        removeError(input);
        
        // Create error element
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerText = message;
        
        // Add error styling to input
        input.classList.add('error');
        
        // Insert error message after input
        input.parentNode.insertBefore(errorDiv, input.nextSibling);
    }
    
    // Helper function to remove error
    function removeError(input) {
        input.classList.remove('error');
        
        // Remove any existing error message
        const errorDiv = input.parentNode.querySelector('.error-message');
        if (errorDiv) {
            errorDiv.remove();
        }
    }
    
    // Helper function to validate email format
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Helper function to show form message (success/error)
    function showFormMessage(message, type) {
        // Remove any existing message
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create message element
        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message ${type}`;
        messageDiv.innerText = message;
        
        // Add message to form
        contactForm.appendChild(messageDiv);
    }
    
    // Add CSS for form validation
    const style = document.createElement('style');
    style.textContent = `
        .error {
            border-color: #ff3860 !important;
        }
        
        .error-message {
            color: #ff3860;
            font-size: 0.8rem;
            margin-top: 5px;
        }
        
        .form-message {
            margin-top: 20px;
            padding: 10px;
            border-radius: 4px;
            text-align: center;
        }
        
        .form-message.success {
            background-color: rgba(76, 175, 80, 0.2);
            color: #4caf50;
        }
        
        .form-message.error {
            background-color: rgba(255, 56, 96, 0.2);
            color: #ff3860;
        }
    `;
    document.head.appendChild(style);
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Adjust for navbar height
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Active navigation link based on scroll position
    function setActiveNavLink() {
        const scrollPosition = window.scrollY;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    // Update active nav link on scroll
    window.addEventListener('scroll', setActiveNavLink);
    
    // Set active nav link on page load
    setActiveNavLink();
    
    // Add CSS for active nav link
    const navStyle = document.createElement('style');
    navStyle.textContent = `
        .nav-link.active::after {
            width: 100%;
        }
        
        .nav-link.active {
            color: var(--accent-color);
        }
    `;
    document.head.appendChild(navStyle);
});
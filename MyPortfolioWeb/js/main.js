/**
 * Portfolio Website - Main JavaScript
 * Author: Aliu-Ameen Abdulrahman
 * Year: 2026
 */

 document.addEventListener('DOMContentLoaded', function () {
    // DOM Elements
    const navbar = document.querySelector('.navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('main section[id]');
    const backToTopBtn = document.getElementById('backToTop');
    const contactForm = document.getElementById('contactForm');
    const yearEl = document.getElementById('year');

    const CONTACT_EMAIL = 'aliuame@gmail.com';
    const WHATSAPP_NUMBER = '2349157818147'; // international format: no +, no spaces, no leading 0

    // Footer year
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    // ===== Mobile Navigation =====
    function setMenu(open) {
        navToggle.classList.toggle('active', open);
        navMenu.classList.toggle('active', open);
        document.body.classList.toggle('menu-open', open);
        navToggle.setAttribute('aria-expanded', String(open));
        navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }

    navToggle.addEventListener('click', function () {
        setMenu(!navMenu.classList.contains('active'));
    });

    // Close mobile menu when clicking a nav link
    navLinks.forEach(function (link) {
        link.addEventListener('click', function () {
            setMenu(false);
        });
    });

    // Close on Escape
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            setMenu(false);
            navToggle.focus();
        }
    });

    // Close if the screen grows past the mobile breakpoint
    window.matchMedia('(min-width: 861px)').addEventListener('change', function (e) {
        if (e.matches) setMenu(false);
    });

    // ===== Scroll effects (navbar + back-to-top), batched per frame =====
    let ticking = false;
    function onScroll() {
        const y = window.scrollY;
        navbar.classList.toggle('scrolled', y > 50);
        backToTopBtn.classList.toggle('show', y > 300);
        ticking = false;
    }

    window.addEventListener('scroll', function () {
        if (!ticking) {
            window.requestAnimationFrame(onScroll);
            ticking = true;
        }
    }, { passive: true });
    onScroll();

    backToTopBtn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ===== Section reveal + active nav link =====
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver(function (entries, observer) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08 });

        sections.forEach(function (section) {
            revealObserver.observe(section);
        });

        // A section counts as "current" while it crosses the middle of the screen
        const activeObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navLinks.forEach(function (link) {
                        link.classList.toggle('active', link.getAttribute('href') === '#' + id);
                    });
                }
            });
        }, { rootMargin: '-45% 0px -50% 0px' });

        sections.forEach(function (section) {
            activeObserver.observe(section);
        });
    } else {
        sections.forEach(function (section) {
            section.classList.add('visible');
        });
    }

    // ===== Project filters =====
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            const filter = button.dataset.filter;

            filterButtons.forEach(function (btn) {
                const isActive = btn === button;
                btn.classList.toggle('active', isActive);
                btn.setAttribute('aria-pressed', String(isActive));
            });

            projectCards.forEach(function (card) {
                const categories = (card.dataset.category || '').split(' ');
                const show = filter === 'all' || categories.indexOf(filter) !== -1;
                card.hidden = !show;
                card.classList.remove('fade-in');
                if (show) {
                    // Restart the fade animation
                    void card.offsetWidth;
                    card.classList.add('fade-in');
                }
            });
        });
    });

    // ===== Contact form =====
    if (contactForm) {
        const fields = {
            name: { el: document.getElementById('name'), label: 'Name' },
            email: { el: document.getElementById('email'), label: 'Email' },
            subject: { el: document.getElementById('subject'), label: 'Subject' },
            message: { el: document.getElementById('message'), label: 'Message' }
        };
        const formMessage = contactForm.querySelector('.form-message');

        function validateField(key) {
            const field = fields[key];
            const value = field.el.value.trim();

            if (value === '') {
                showError(field.el, field.label + ' is required');
                return false;
            }
            if (key === 'email' && !isValidEmail(value)) {
                showError(field.el, 'Please enter a valid email');
                return false;
            }
            removeError(field.el);
            return true;
        }

        // Re-check a field as soon as the user fixes it
        Object.keys(fields).forEach(function (key) {
            fields[key].el.addEventListener('input', function () {
                if (fields[key].el.classList.contains('error')) {
                    validateField(key);
                }
            });
        });

        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            let firstInvalid = null;
            Object.keys(fields).forEach(function (key) {
                if (!validateField(key) && !firstInvalid) {
                    firstInvalid = fields[key].el;
                }
            });

            if (firstInvalid) {
                firstInvalid.focus();
                showFormMessage('Please fix the highlighted fields.', 'error');
                return;
            }

            const name = fields.name.el.value.trim();
            const email = fields.email.el.value.trim();
            const subject = fields.subject.el.value.trim();
            const message = fields.message.el.value.trim();

            // Which button was clicked: "whatsapp" or "email"
            const channel = (e.submitter && e.submitter.dataset.channel) || 'whatsapp';

            // No backend: hand the message to WhatsApp or the visitor's email app
            if (channel === 'whatsapp') {
                const text = '*New message from your portfolio*\n\n' +
                    '*Name:* ' + name + '\n' +
                    '*Email:* ' + email + '\n' +
                    '*Subject:* ' + subject + '\n\n' +
                    message;

                // Phones: wa.me opens the WhatsApp app straight away.
                // Computers: go straight to WhatsApp Web and skip the "Open app" page.
                const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
                const waUrl = isMobile
                    ? 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(text)
                    : 'https://web.whatsapp.com/send?phone=' + WHATSAPP_NUMBER + '&text=' + encodeURIComponent(text);

                window.open(waUrl, '_blank', 'noopener');

                showFormMessage('WhatsApp should open with your message ready. Just tap Send. ' +
                    'If it doesn\'t, message me on WhatsApp at +234 915 781 8147.', 'success');
            } else {
                const body = message + '\n\n— ' + name + ' (' + email + ')';
                const mailto = 'mailto:' + CONTACT_EMAIL +
                    '?subject=' + encodeURIComponent(subject) +
                    '&body=' + encodeURIComponent(body);

                window.location.href = mailto;

                showFormMessage('Your email app should open with the message ready to send. ' +
                    'If it doesn\'t, email me directly at ' + CONTACT_EMAIL + '.', 'success');
            }

            contactForm.reset();
        });

        function showFormMessage(message, type) {
            formMessage.className = 'form-message ' + type;
            formMessage.textContent = message;
        }
    }

    // Show form field error
    function showError(input, message) {
        removeError(input);

        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.id = input.id + '-error';
        errorDiv.textContent = message;

        input.classList.add('error');
        input.setAttribute('aria-invalid', 'true');
        input.setAttribute('aria-describedby', errorDiv.id);
        input.parentNode.insertBefore(errorDiv, input.nextSibling);
    }

    // Remove form field error
    function removeError(input) {
        input.classList.remove('error');
        input.removeAttribute('aria-invalid');
        input.removeAttribute('aria-describedby');

        const errorDiv = input.parentNode.querySelector('.error-message');
        if (errorDiv) {
            errorDiv.remove();
        }
    }

    // Validate email format
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
});

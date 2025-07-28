// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Navbar background on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Smooth scrolling for anchor links
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

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.feature-card, .class-card, .testimonial-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Counter animation for stats
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    function updateCounter() {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start) + '+';
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target + '+';
        }
    }
    updateCounter();
}

// Animate stats when they come into view
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat h3');
            statNumbers.forEach(stat => {
                const target = parseInt(stat.textContent);
                animateCounter(stat, target);
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

// Observe hero stats
document.addEventListener('DOMContentLoaded', () => {
    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        statsObserver.observe(heroStats);
    }
});

// Form validation for contact form
const contactForm = document.querySelector('#contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Basic validation
        const name = document.querySelector('#name').value;
        const email = document.querySelector('#email').value;
        const message = document.querySelector('#message').value;
        const sendSMS = document.querySelector('input[name="send_sms"]').checked;
        const publicFeedback = document.querySelector('input[name="public_feedback"]').checked;
        
        if (!name || !email || !message) {
            alert('Please fill in all fields');
            return;
        }
        
        if (!email.includes('@')) {
            alert('Please enter a valid email address');
            return;
        }
        
        // Simulate form submission
        let successMessage = 'Thank you for your message! We will get back to you soon.';
        
        if (sendSMS) {
            // Create WhatsApp message
            const whatsappMessage = `Feedback from ${name}:\n\n${message}\n\nContact: ${email}`;
            const whatsappUrl = `https://wa.me/919640518985?text=${encodeURIComponent(whatsappMessage)}`;
            
            // Open WhatsApp in new tab
            window.open(whatsappUrl, '_blank');
            successMessage += '\n\nWhatsApp message has been opened for you to send feedback.';
        }
        
        if (publicFeedback) {
            // Add feedback to local storage
            const feedback = {
                name: name,
                message: message,
                date: new Date().toLocaleDateString(),
                id: Date.now()
            };
            
            // Get existing feedback
            let existingFeedback = JSON.parse(localStorage.getItem('gymFeedback') || '[]');
            existingFeedback.unshift(feedback); // Add to beginning
            
            // Keep only last 10 feedback items
            if (existingFeedback.length > 10) {
                existingFeedback = existingFeedback.slice(0, 10);
            }
            
            localStorage.setItem('gymFeedback', JSON.stringify(existingFeedback));
            successMessage += '\n\nYour feedback has been added to our website!';
        }
        
        alert(successMessage);
        contactForm.reset();
    });
}

// Quick feedback form
const quickFeedbackForm = document.querySelector('#quick-feedback-form');
if (quickFeedbackForm) {
    quickFeedbackForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Basic validation
        const name = document.querySelector('#quick-name').value;
        const message = document.querySelector('#quick-message').value;
        const publicFeedback = document.querySelector('#quick-feedback-form input[name="public_feedback"]').checked;
        
        if (!name || !message) {
            alert('Please fill in all fields');
            return;
        }
        
        // Add feedback to local storage
        const feedback = {
            name: name,
            message: message,
            date: new Date().toLocaleDateString(),
            id: Date.now()
        };
        
        // Get existing feedback
        let existingFeedback = JSON.parse(localStorage.getItem('gymFeedback') || '[]');
        existingFeedback.unshift(feedback); // Add to beginning
        
        // Keep only last 10 feedback items
        if (existingFeedback.length > 10) {
            existingFeedback = existingFeedback.slice(0, 10);
        }
        
        localStorage.setItem('gymFeedback', JSON.stringify(existingFeedback));
        
        // Reload feedback display
        loadFeedback();
        
        alert('Thank you for your feedback! It has been added to our website.');
        quickFeedbackForm.reset();
    });
}

// Load and display feedback
function loadFeedback() {
    const feedbackContainers = [
        document.getElementById('feedback-container'),
        document.getElementById('feedback-container-about')
    ];
    
    const feedback = JSON.parse(localStorage.getItem('gymFeedback') || '[]');
    
    feedbackContainers.forEach(container => {
        if (!container) return;
        
        if (feedback.length === 0) {
            container.innerHTML = '<p class="no-feedback">No feedback yet. Be the first to share your experience!</p>';
            return;
        }
        
        container.innerHTML = feedback.map(item => `
            <div class="feedback-card">
                <div class="feedback-content">
                    <p>"${item.message}"</p>
                </div>
                <div class="feedback-author">
                    <h4>${item.name}</h4>
                    <p>${item.date}</p>
                </div>
            </div>
        `).join('');
    });
}

// Load feedback when page loads
document.addEventListener('DOMContentLoaded', () => {
    loadFeedback();
    
    // WhatsApp Join buttons
    const joinButtons = document.querySelectorAll('#join-whatsapp, #cta-join-whatsapp, #pricing-join-whatsapp');
    joinButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const message = `Hi! I'm interested in joining DP Fitness Gym Seethanagaram. Can you please provide information about membership plans and pricing?`;
            const whatsappUrl = `https://wa.me/919640518985?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
        });
    });
});

// Pricing toggle functionality
const pricingToggle = document.querySelector('.pricing-toggle');
if (pricingToggle) {
    pricingToggle.addEventListener('change', () => {
        const monthlyPrices = document.querySelectorAll('.monthly-price');
        const yearlyPrices = document.querySelectorAll('.yearly-price');
        
        if (pricingToggle.checked) {
            monthlyPrices.forEach(price => price.style.display = 'none');
            yearlyPrices.forEach(price => price.style.display = 'block');
        } else {
            monthlyPrices.forEach(price => price.style.display = 'block');
            yearlyPrices.forEach(price => price.style.display = 'none');
        }
    });
}

// Class schedule functionality
const classSchedule = document.querySelectorAll('.schedule-item');
classSchedule.forEach(item => {
    item.addEventListener('click', () => {
        // Remove active class from all items
        classSchedule.forEach(scheduleItem => {
            scheduleItem.classList.remove('active');
        });
        
        // Add active class to clicked item
        item.classList.add('active');
    });
});

// Testimonial carousel (if needed)
let currentTestimonial = 0;
const testimonials = document.querySelectorAll('.testimonial-card');

function showTestimonial(index) {
    testimonials.forEach((testimonial, i) => {
        testimonial.style.display = i === index ? 'block' : 'none';
    });
}

// Auto-rotate testimonials
setInterval(() => {
    currentTestimonial = (currentTestimonial + 1) % testimonials.length;
    showTestimonial(currentTestimonial);
}, 5000);

// Lazy loading for images
const images = document.querySelectorAll('img[data-src]');
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
        }
    });
});

images.forEach(img => imageObserver.observe(img));

// Back to top button
const backToTopBtn = document.createElement('button');
backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
backToTopBtn.className = 'back-to-top';
backToTopBtn.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 50px;
    height: 50px;
    background: #e74c3c;
    color: white;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    display: none;
    z-index: 1000;
    transition: all 0.3s ease;
`;

document.body.appendChild(backToTopBtn);

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTopBtn.style.display = 'block';
    } else {
        backToTopBtn.style.display = 'none';
    }
});

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Add hover effect to back to top button
backToTopBtn.addEventListener('mouseenter', () => {
    backToTopBtn.style.transform = 'translateY(-3px)';
    backToTopBtn.style.boxShadow = '0 5px 15px rgba(231, 76, 60, 0.3)';
});

backToTopBtn.addEventListener('mouseleave', () => {
    backToTopBtn.style.transform = 'translateY(0)';
    backToTopBtn.style.boxShadow = 'none';
}); 
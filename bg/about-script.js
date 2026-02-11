document.addEventListener("DOMContentLoaded", function () {
    if (window.AnalyticsEvents) {
        window.AnalyticsEvents.setUserLanguage(document.documentElement.lang || 'bg');
    }
    initializeHeader();
    initializeAboutPage();
});

// Header functionality (shared with main page)
function initializeHeader() {
    const header = document.getElementById('header');
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    // Header scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Mobile menu toggle
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            if (window.AnalyticsEvents) {
                window.AnalyticsEvents.trackMenuToggle();
            }
        });
        
        // Close mobile menu when clicking on links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
}

// About page specific functionality
function initializeAboutPage() {
    // Profile image interactions
    const profileImage = document.querySelector(".profile-image");
    if (profileImage) {
        profileImage.addEventListener("mouseenter", function() {
            this.style.transform = "scale(1.05) rotate(5deg)";
        });
        
        profileImage.addEventListener("mouseleave", function() {
            this.style.transform = "scale(1) rotate(0deg)";
        });
    }
    
    // Contact link tracking and interactions
    const contactLinks = document.querySelectorAll(".contact-link");
    contactLinks.forEach(link => {
        link.addEventListener("click", function(e) {
            const linkText = this.textContent.trim();
            const linkUrl = this.href;
            
            if (window.AnalyticsEvents) {
                window.AnalyticsEvents.trackExternalLink(linkUrl, linkText);
            }
            
            // Add click animation
            this.style.transform = "scale(0.95)";
            setTimeout(() => {
                this.style.transform = "";
            }, 150);
        });
        
        // Add hover sound effect (optional)
        link.addEventListener("mouseenter", function() {
            // You could add a subtle sound effect here
        });
    });
    
    // Animate content sections on scroll
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
    
    // Observe content sections
    document.querySelectorAll('.content-section, .skill-item').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
    
    // Add typing effect to the title
    const title = document.querySelector('.about-title');
    if (title) {
        const originalText = title.textContent;
        title.textContent = '';
        
        let i = 0;
        const typeWriter = () => {
            if (i < originalText.length) {
                title.textContent += originalText.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };
        
        // Start typing effect after a short delay
        setTimeout(typeWriter, 500);
    }
    
    // Add parallax effect to profile image
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const profileSection = document.querySelector('.profile-section');
        
        if (profileSection) {
            const rate = scrolled * -0.5;
            profileSection.style.transform = `translateY(${rate}px)`;
        }
    });
    
    // Skills animation on hover
    document.querySelectorAll('.skill-item').forEach(skill => {
        skill.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.skill-icon');
            if (icon) {
                icon.style.transform = 'scale(1.2) rotate(10deg)';
            }
        });
        
        skill.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.skill-icon');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }
        });
    });
    
    // Add copy email functionality
    const emailLink = document.querySelector('a[href^="mailto:"]');
    if (emailLink) {
        emailLink.addEventListener('click', function(e) {
            e.preventDefault();
            const email = this.href.replace('mailto:', '');
            
            if (navigator.clipboard) {
                navigator.clipboard.writeText(email).then(() => {
                    showNotification('Email адресът е копиран в клипборда!');
                });
            }
            
            // Still open email client
            setTimeout(() => {
                window.location.href = this.href;
            }, 1000);
        });
    }
}

// Show notification function
function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--accent-gradient);
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        font-weight: 500;
        z-index: 10000;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style); 
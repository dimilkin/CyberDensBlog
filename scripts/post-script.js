document.addEventListener("DOMContentLoaded", function() {
    initializeHeader();
    loadSinglePost();
    initializeShareButtons();
});

// Header functionality (shared)
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

// Load and display single post
function loadSinglePost() {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get("id");
    
    if (!postId) {
        showError("No post ID provided");
        return;
    }

    fetch("assets/posts.json")
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load posts');
            }
            return response.json();
        })
        .then(posts => {
            const post = posts.find(p => p.id == postId);
            if (post) {
                displayPost(post);
                updatePageMeta(post);
            } else {
                showError("Post not found");
            }
        })
        .catch(error => {
            console.error("Error loading post:", error);
            showError("Failed to load post");
        });
}

// Display post content
function displayPost(post) {
    // Update title and meta
    document.getElementById("post-title").textContent = post.title;
    document.getElementById("post-date").innerHTML = `<time datetime="${post.date}">${post.date}</time>`;
    
    const postContentContainer = document.getElementById("post-content");
    postContentContainer.innerHTML = "";

    // Add main post image if available
    if (post.imageUrl) {
        const mainImage = document.createElement("img");
        mainImage.src = post.imageUrl;
        mainImage.alt = post.title;
        mainImage.classList.add("main-post-image");
        mainImage.loading = "lazy";
        postContentContainer.appendChild(mainImage);
    }

    // Process content array
    if (post.content && Array.isArray(post.content)) {
        post.content.forEach((item, index) => {
            const element = createContentElement(item, index);
            if (element) {
                postContentContainer.appendChild(element);
            }
        });
    }
    
    // Add reading progress indicator
    addReadingProgress();
    
    // Add smooth animations
    animateContent();

    // Send page_view to GA4 with article details
    if (typeof gtag !== 'undefined') {
        try {
            gtag('event', 'page_view', {
                page_title: post.title + ' - Cyberdens',
                page_location: window.location.href,
                page_path: window.location.pathname + window.location.search
            });
            
            // Also send custom post_view event for additional tracking
            gtag('event', 'post_view', {
                post_id: String(post.id),
                post_title: post.title,
                post_date: post.date,
                language: document.documentElement.lang || 'en'
            });
        } catch (e) {
            console.error('GA tracking error:', e);
        }
    }
}

// Create content elements based on type
function createContentElement(item, index) {
    switch (item.type) {
        case "paragraph":
            const paragraph = document.createElement("p");
            paragraph.textContent = item.text;
            paragraph.style.animationDelay = `${index * 0.1}s`;
            return paragraph;
            
        case "image":
            const imageContainer = document.createElement("div");
            imageContainer.className = "image-container";
            
            const img = document.createElement("img");
            img.src = item.url;
            img.alt = item.caption || "Article image";
            img.classList.add("post-image");
            img.loading = "lazy";
            img.style.animationDelay = `${index * 0.1}s`;
            
            imageContainer.appendChild(img);
            
            if (item.caption) {
                const caption = document.createElement("p");
                caption.textContent = item.caption;
                caption.classList.add("image-caption");
                imageContainer.appendChild(caption);
            }
            
            return imageContainer;
            
        case "quote":
            const blockquote = document.createElement("blockquote");
            blockquote.textContent = item.text;
            blockquote.style.animationDelay = `${index * 0.1}s`;
            return blockquote;
            
        case "code":
            const pre = document.createElement("pre");
            const code = document.createElement("code");
            code.textContent = item.code;
            code.className = item.language || '';
            pre.appendChild(code);
            pre.style.animationDelay = `${index * 0.1}s`;
            return pre;
            
        default:
            return null;
    }
}

// Update page metadata
function updatePageMeta(post) {
    document.title = `${post.title} - Cyberdens`;
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
        metaDescription.content = post.preview;
    }
    
    // Add structured data
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": post.title,
        "description": post.preview,
        "datePublished": post.date,
        "author": {
            "@type": "Person",
            "name": "Dimitar"
        },
        "publisher": {
            "@type": "Organization",
            "name": "Cyberdens"
        }
    };
    
    if (post.imageUrl) {
        structuredData.image = post.imageUrl;
    }
    
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);
}

// Initialize share buttons
function initializeShareButtons() {
    const shareButtons = {
        'share-twitter': () => shareOnTwitter(),
        'share-linkedin': () => shareOnLinkedIn(),
        'share-facebook': () => shareOnFacebook(),
        'copy-link': () => copyLink()
    };
    
    Object.entries(shareButtons).forEach(([id, handler]) => {
        const button = document.getElementById(id);
        if (button) {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                handler();
            });
        }
    });
}

// Share functions
function shareOnTwitter() {
    const postTitle = document.getElementById('post-title').textContent;
    
    if (window.AnalyticsEvents) {
        window.AnalyticsEvents.trackShare('Twitter', postTitle);
    }
    
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(document.title);
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
}

function shareOnLinkedIn() {
    const postTitle = document.getElementById('post-title').textContent;
    
    if (window.AnalyticsEvents) {
        window.AnalyticsEvents.trackShare('LinkedIn', postTitle);
    }
    
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
}

function shareOnFacebook() {
    const postTitle = document.getElementById('post-title').textContent;
    
    if (window.AnalyticsEvents) {
        window.AnalyticsEvents.trackShare('Facebook', postTitle);
    }
    
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
}

function copyLink() {
    const postTitle = document.getElementById('post-title').textContent;
    
    if (window.AnalyticsEvents) {
        window.AnalyticsEvents.trackCopyLink(postTitle);
    }
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(window.location.href).then(() => {
            showNotification('Link copied to clipboard!');
        }).catch(() => {
            fallbackCopyLink();
        });
    } else {
        fallbackCopyLink();
    }
}

function fallbackCopyLink() {
    const textArea = document.createElement('textarea');
    textArea.value = window.location.href;
    document.body.appendChild(textArea);
    textArea.select();
    try {
        document.execCommand('copy');
        showNotification('Link copied to clipboard!');
    } catch (err) {
        showNotification('Failed to copy link');
    }
    document.body.removeChild(textArea);
}

// Add reading progress indicator
function addReadingProgress() {
    const progressBar = document.createElement('div');
    progressBar.id = 'reading-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: var(--accent-gradient);
        z-index: 9999;
        transition: width 0.3s ease;
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + '%';
    });
}

// Animate content elements
function animateContent() {
    const elements = document.querySelectorAll('.post-content > *');
    elements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Show error message
function showError(message) {
    document.getElementById("post-title").textContent = "Error";
    document.getElementById("post-date").textContent = "";
    document.getElementById("post-content").innerHTML = `
        <div class="error-message" style="text-align: center; padding: 2rem;">
            <h3>⚠️ ${message}</h3>
            <p>Please check the URL or try again later.</p>
            <a href="index.html" class="nav-button" style="display: inline-flex; margin-top: 1rem;">
                <i class="fas fa-arrow-left"></i>
                Back to Home
            </a>
        </div>
    `;
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
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Add smooth scroll for anchor links
document.addEventListener('click', function(e) {
    if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const target = document.querySelector(e.target.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
});
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
        showError("Не е предоставено ID на статията");
        return;
    }

    fetch("../assets/posts-bg.json")
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
                showError("Статията не е намерена");
            }
        })
        .catch(error => {
            console.error("Error loading post:", error);
            showError("Неуспешно зареждане на статията");
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
    
    addReadingProgress(post);
    animateContent();

    const lang = document.documentElement.lang || 'bg';
    if (window.AnalyticsEvents) {
        window.AnalyticsEvents.setUserLanguage(lang);
    }

    if (typeof gtag !== 'undefined') {
        try {
            gtag('event', 'page_view', {
                page_title: post.title + ' - Cyberdens',
                page_location: window.location.href,
                page_path: window.location.pathname + window.location.search
            });

            gtag('event', 'post_view', {
                post_id: String(post.id),
                post_title: post.title,
                post_date: post.date,
                content_type: 'blog_post',
                item_id: String(post.id),
                content_group: 'articles',
                language: lang
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
            if (item.link && typeof item.link === 'string' && item.link.trim() !== '') {
                paragraph.appendChild(document.createTextNode(' '));
                const a = document.createElement('a');
                a.href = item.link;
                a.target = '_blank';
                a.rel = 'noopener noreferrer';
                a.textContent = 'тук';
                paragraph.appendChild(a);
            }
            paragraph.style.animationDelay = `${index * 0.1}s`;
            return paragraph;
            
        case "image":
            const imageContainer = document.createElement("div");
            imageContainer.className = "image-container";
            
            const img = document.createElement("img");
            img.src = item.url;
            img.alt = item.caption || "Изображение на статията";
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
            "name": "Димитър"
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

    Object.keys(shareButtons).forEach(buttonId => {
        const button = document.getElementById(buttonId);
        if (button) {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                shareButtons[buttonId]();
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
    const title = encodeURIComponent(document.title);
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
    
    const url = window.location.href;
    
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(url).then(() => {
            showNotification('Връзката е копирана в клипборда!');
        }).catch(() => {
            fallbackCopyLink(url);
        });
    } else {
        fallbackCopyLink(url);
    }
}

function fallbackCopyLink(url) {
    const textArea = document.createElement('textarea');
    textArea.value = url;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showNotification('Връзката е копирана в клипборда!');
    } catch (err) {
        showNotification('Неуспешно копиране на връзката');
    }
    
    document.body.removeChild(textArea);
}

function addReadingProgress(post) {
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    progressBar.innerHTML = '<div class="progress-fill"></div>';
    document.body.appendChild(progressBar);

    const scrollMilestones = [25, 50, 75, 100];
    const reached = new Set();

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

        const progressFill = progressBar.querySelector('.progress-fill');
        progressFill.style.width = scrollPercent + '%';

        if (post && window.AnalyticsEvents) {
            scrollMilestones.forEach(pct => {
                if (scrollPercent >= pct && !reached.has(pct)) {
                    reached.add(pct);
                    window.AnalyticsEvents.trackScrollDepth(pct, post.id, post.title);
                }
            });
        }
    });
}

// Animate content
function animateContent() {
    const contentElements = document.querySelectorAll('.post-content > *');
    contentElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Error handling
function showError(message) {
    const container = document.querySelector('.post-container');
    if (container) {
        container.innerHTML = `
            <div class="error-message">
                <h2>Грешка</h2>
                <p>${message}</p>
                <a href="index.html" class="nav-button">Обратно към Началото</a>
            </div>
        `;
    }
}

// Notification system
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Remove notification
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
} 
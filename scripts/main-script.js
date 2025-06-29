document.addEventListener("DOMContentLoaded", function () {
    initializeHeader();
    loadPosts();
});

// Header functionality
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
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// Load and display blog posts
function loadPosts() {
    const container = document.getElementById("posts-container");
    
    fetch("assets/posts.json")
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load posts');
            }
            return response.json();
        })
        .then(posts => {
            container.innerHTML = "";
            
            if (!posts || posts.length === 0) {
                container.innerHTML = `
                    <div class="no-posts">
                        <h3>No posts available</h3>
                        <p>Check back soon for new content!</p>
                    </div>
                `;
                return;
            }

            posts.forEach((post, index) => {
                const postElement = createPostElement(post, index);
                container.appendChild(postElement);
            });
            
            // Add stagger animation
            animatePostsIn();
        })
        .catch(error => {
            console.error("Error loading posts:", error);
            container.innerHTML = `
                <div class="error-message">
                    <h3>Unable to load posts</h3>
                    <p>Please try refreshing the page.</p>
                </div>
            `;
        });
}

// Create individual post element
function createPostElement(post, index) {
    const postDiv = document.createElement("article");
    postDiv.classList.add("blog-post");
    postDiv.style.animationDelay = `${index * 0.1}s`;
    
    postDiv.innerHTML = `
        ${post.imageUrl ? `<img src="${post.imageUrl}" alt="${post.title}" class="blog-thumbnail" loading="lazy">` : ""}
        <div class="post-content">
            <h3 class="post-title">${post.title}</h3>
            <p class="post-preview">${post.preview}</p>
            <div class="post-meta">
                <time class="post-date">${post.date}</time>
                <span class="read-more">Read More</span>
            </div>
        </div>
    `;
    
    // Add click handler
    postDiv.addEventListener("click", function () {
        // Add loading state
        postDiv.style.opacity = '0.7';
        postDiv.style.pointerEvents = 'none';
        
        // Navigate to post
        window.location.href = `post.html?id=${post.id}`;
    });
    
    // Add hover effects
    postDiv.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-8px)';
    });
    
    postDiv.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
    
    return postDiv;
}

// Animate posts in with stagger effect
function animatePostsIn() {
    const posts = document.querySelectorAll('.blog-post');
    posts.forEach((post, index) => {
        setTimeout(() => {
            post.style.opacity = '1';
            post.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Smooth scroll for anchor links
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

// Add loading states for images
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
        
        img.addEventListener('error', function() {
            this.style.display = 'none';
        });
    });
});
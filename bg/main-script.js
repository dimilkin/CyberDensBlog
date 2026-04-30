document.addEventListener("DOMContentLoaded", function () {
    if (window.AnalyticsEvents) {
        window.AnalyticsEvents.setUserLanguage(document.documentElement.lang || 'bg');
    }
    initializeHeader();
    loadPosts();
});

const STATIC_POSTS_BG = [
    {
        id: 1,
        title: "ДНК и НЗИС",
        preview: "Какви са приликите между билогичните и компютърните системи",
        imageUrl: "https://imagizer.imageshack.com/img923/5682/2V80T8.png",
        date: "17.09.2025"
    },
    {
        id: 2,
        title: "Дигиталното здраве в ЕС и НЗИС",
        preview: "Интегрирана здравна информация в 27те страни-членки",
        imageUrl: "https://imagizer.imageshack.com/img922/9263/UW9w69.png",
        date: "20.03.2025"
    },
    {
        id: 3,
        title: "Не автоматизирайте грижата - Автоматизирайте документите.",
        preview: "Автоматизацията на процесите в денталната клиника носи голяма добавена стойност",
        imageUrl: "https://images.cyber-health-tech.com/ai_dark_brain.png",
        date: "05.01.2026"
    },
    {
        id: 4,
        title: "12 долара на година за модерен сайт на клиниката с AI и Cloudflare",
        preview: "Как изградихме модерен сайт с нови технологии за нула време",
        imageUrl: "https://images.cyber-health-tech.com/website-ui.png",
        date: "05.03.2026"
    },
    {
        id: 6,
        title: "Дигитализиране на регистрационната форма и информираните съгласия",
        preview: "В днешната дентална практика работим с все повече документи и бланки.",
        imageUrl: "https://images.cyber-health-tech.com/hall5.png",
        date: "06.03.2026"
    },
    {
        id: 7,
        title: "Blender и AI: Бъдещето на 3D дизайна в денталната медицина",
        preview: "Блендър вече може да се управлява от AI агент автономно. Какво означава това за денталния свят?",
        imageUrl: "https://images.cyber-health-tech.com/blender_ai3.png",
        date: "28.04.2026"
    }
];

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
        
        if (window.AnalyticsEvents) {
            window.AnalyticsEvents.trackMenuToggle();
        }
    });
    
    document.querySelectorAll('.nav-link, .nav-cta').forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('nav') && navMenu.classList.contains('active')) {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
}

// Load and display blog posts
function loadPosts() {
    const container = document.getElementById("posts-container");
    container.innerHTML = "";

    if (!STATIC_POSTS_BG.length) {
        container.innerHTML = `
            <div class="no-posts">
                <h3>Няма налични статии</h3>
                <p>Връщете се скоро за ново съдържание!</p>
            </div>
        `;
        return;
    }

    const displayedPosts = [...STATIC_POSTS_BG].reverse();
    displayedPosts.forEach((post, index) => {
        const postElement = createPostElement(post, index);
        container.appendChild(postElement);
    });

    // Add stagger animation
    animatePostsIn();
}

// Create individual post element
function createPostElement(post, index) {
    const postDiv = document.createElement("article");
    postDiv.classList.add("blog-post");
    postDiv.style.animationDelay = `${index * 0.1}s`;
    
    const category = post.category || 'Статия';
    postDiv.innerHTML = `
        ${post.imageUrl ? `<img src="${post.imageUrl}" alt="${post.title}" class="blog-thumbnail" loading="lazy">` : ""}
        <div class="post-content">
            <span class="post-eyebrow">${category}</span>
            <h3 class="post-title">${post.title}</h3>
            <p class="post-preview">${post.preview}</p>
            <div class="post-meta">
                <time class="post-date">${post.date}</time>
                <span class="read-more">Прочети Повече</span>
            </div>
        </div>
    `;
    
    // Add click handler
    postDiv.addEventListener("click", function () {
        // Track post click
        if (window.AnalyticsEvents) {
            window.AnalyticsEvents.trackPostClick(post.title, post.id);
        }
        
        // Add loading state
        postDiv.style.opacity = '0.7';
        postDiv.style.pointerEvents = 'none';
        
        // Navigate to static post page
        window.location.href = `posts/post-${post.id}.html`;
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
document.addEventListener("DOMContentLoaded", function () {
    initializeHeader();
    initializeShareButtons();
    initializeMobileTitleBar();
    addReadingProgress();
    trackPostView();
});

function initializeMobileTitleBar() {
    const postHeader = document.querySelector(".post-header");
    const siteHeader = document.getElementById("header");
    const postPage = document.querySelector(".post-page");
    if (!postHeader || !siteHeader || !postPage) return;

    const mql = window.matchMedia("(max-width: 768px)");

    function positionTitleBar() {
        if (!mql.matches) {
            postHeader.style.top = "";
            postPage.style.paddingTop = "";
            return;
        }
        const rect = siteHeader.getBoundingClientRect();
        const navBottom = Math.max(Math.ceil(rect.bottom) + 2, siteHeader.offsetHeight, 48);
        postHeader.style.top = navBottom + "px";
        const titleRect = postHeader.getBoundingClientRect();
        const titleBarHeight = Math.ceil(titleRect.height) || postHeader.offsetHeight;
        postPage.style.paddingTop = navBottom + titleBarHeight + 12 + "px";
    }

    function syncTitleBar() {
        positionTitleBar();
        if (!mql.matches) return;
        if (window.scrollY <= 60) {
            postHeader.classList.remove("title-hidden");
        }
    }

    syncTitleBar();
    window.addEventListener("resize", syncTitleBar, { passive: true });
    window.addEventListener("load", syncTitleBar, { passive: true });
    window.addEventListener("pageshow", syncTitleBar, { passive: true });

    if (typeof ResizeObserver !== "undefined") {
        const ro = new ResizeObserver(() => syncTitleBar());
        ro.observe(siteHeader);
        ro.observe(postHeader);
    }

    if (window.visualViewport) {
        window.visualViewport.addEventListener("resize", syncTitleBar, { passive: true });
        window.visualViewport.addEventListener("scroll", syncTitleBar, { passive: true });
    }

    window.addEventListener(
        "scroll",
        () => {
            if (!mql.matches) return;
            if (window.scrollY > 60) {
                postHeader.classList.add("title-hidden");
            } else {
                postHeader.classList.remove("title-hidden");
            }
        },
        { passive: true }
    );
}

function initializeHeader() {
    const header = document.getElementById("header");
    const menuToggle = document.getElementById("menu-toggle");
    const navMenu = document.getElementById("nav-menu");

    window.addEventListener("scroll", () => {
        if (window.scrollY > 100) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    });

    if (menuToggle && navMenu) {
        menuToggle.addEventListener("click", () => {
            menuToggle.classList.toggle("active");
            navMenu.classList.toggle("active");

            if (window.AnalyticsEvents) {
                window.AnalyticsEvents.trackMenuToggle();
            }
        });

        document.querySelectorAll(".nav-link").forEach((link) => {
            link.addEventListener("click", () => {
                menuToggle.classList.remove("active");
                navMenu.classList.remove("active");
            });
        });

        document.addEventListener("click", (e) => {
            if (!e.target.closest("nav") && navMenu.classList.contains("active")) {
                menuToggle.classList.remove("active");
                navMenu.classList.remove("active");
            }
        });
    }
}

function initializeShareButtons() {
    const shareButtons = {
        "share-twitter": shareOnTwitter,
        "share-linkedin": shareOnLinkedIn,
        "share-facebook": shareOnFacebook,
        "copy-link": copyLink
    };

    Object.entries(shareButtons).forEach(([id, handler]) => {
        const button = document.getElementById(id);
        if (!button) return;
        button.addEventListener("click", (e) => {
            e.preventDefault();
            handler();
        });
    });
}

function shareOnTwitter() {
    const title = getPostTitle();
    trackShare("Twitter", title);
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(document.title);
    window.open("https://twitter.com/intent/tweet?url=" + url + "&text=" + text, "_blank");
}

function shareOnLinkedIn() {
    const title = getPostTitle();
    trackShare("LinkedIn", title);
    const url = encodeURIComponent(window.location.href);
    window.open("https://www.linkedin.com/sharing/share-offsite/?url=" + url, "_blank");
}

function shareOnFacebook() {
    const title = getPostTitle();
    trackShare("Facebook", title);
    const url = encodeURIComponent(window.location.href);
    window.open("https://www.facebook.com/sharer/sharer.php?u=" + url, "_blank");
}

function copyLink() {
    const title = getPostTitle();
    trackCopyLink(title);
    if (navigator.clipboard) {
        navigator.clipboard
            .writeText(window.location.href)
            .then(() => showNotification(getLocale() === "bg" ? "Връзката е копирана!" : "Link copied to clipboard!"))
            .catch(() => fallbackCopyLink());
    } else {
        fallbackCopyLink();
    }
}

function fallbackCopyLink() {
    const textArea = document.createElement("textarea");
    textArea.value = window.location.href;
    document.body.appendChild(textArea);
    textArea.select();
    try {
        document.execCommand("copy");
        showNotification(getLocale() === "bg" ? "Връзката е копирана!" : "Link copied to clipboard!");
    } catch (err) {
        showNotification(getLocale() === "bg" ? "Копирането е неуспешно." : "Failed to copy link");
    }
    document.body.removeChild(textArea);
}

function showNotification(message) {
    const notification = document.createElement("div");
    notification.textContent = message;
    notification.style.cssText = [
        "position: fixed",
        "top: 20px",
        "right: 20px",
        "background: var(--color-blue)",
        "color: white",
        "padding: 12px 24px",
        "border-radius: 8px",
        "font-weight: 500",
        "z-index: 10000"
    ].join(";");
    document.body.appendChild(notification);
    setTimeout(() => {
        if (document.body.contains(notification)) {
            document.body.removeChild(notification);
        }
    }, 3000);
}

function addReadingProgress() {
    const progressBar = document.createElement("div");
    progressBar.id = "reading-progress";
    progressBar.style.cssText = [
        "position: fixed",
        "top: 0",
        "left: 0",
        "width: 0%",
        "height: 3px",
        "background: var(--color-blue)",
        "z-index: 9999",
        "transition: width 0.3s ease"
    ].join(";");
    document.body.appendChild(progressBar);

    const scrollMilestones = [25, 50, 75, 100];
    const reached = new Set();
    const postId = document.body.dataset.postId || "";
    const postTitle = getPostTitle();

    window.addEventListener("scroll", () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
        progressBar.style.width = scrolled + "%";

        if (window.AnalyticsEvents && postId) {
            scrollMilestones.forEach((pct) => {
                if (scrolled >= pct && !reached.has(pct)) {
                    reached.add(pct);
                    window.AnalyticsEvents.trackScrollDepth(pct, postId, postTitle);
                }
            });
        }
    });
}

function trackPostView() {
    const postId = document.body.dataset.postId || "";
    const postTitle = getPostTitle();
    const postDate = document.body.dataset.postDate || "";
    const lang = getLocale();

    if (window.AnalyticsEvents) {
        window.AnalyticsEvents.setUserLanguage(lang);
    }

    if (typeof gtag !== "undefined") {
        try {
            gtag("event", "page_view", {
                page_title: postTitle + " - Health Tech",
                page_location: window.location.href,
                page_path: window.location.pathname
            });

            gtag("event", "post_view", {
                post_id: String(postId),
                post_title: postTitle,
                post_date: postDate,
                content_type: "blog_post",
                item_id: String(postId),
                content_group: "articles",
                language: lang
            });
        } catch (e) {
            console.error("GA tracking error:", e);
        }
    }
}

function getPostTitle() {
    return document.body.dataset.postTitle || document.title;
}

function getLocale() {
    return document.documentElement.lang || "en";
}

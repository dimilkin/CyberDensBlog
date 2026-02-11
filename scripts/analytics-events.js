class AnalyticsEvents {
    static trackEvent(eventName, eventParams = {}) {
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, eventParams);
        }
    }

    static setUserLanguage(lang) {
        if (typeof gtag !== 'undefined') {
            gtag('set', 'user_properties', { preferred_language: lang });
        }
    }

    static trackPostClick(postTitle, postId) {
        this.trackEvent('select_content', {
            content_type: 'blog_post',
            item_id: String(postId),
            content_group: 'articles',
            event_label: postTitle,
            post_id: postId
        });
    }

    static trackShare(platform, postTitle) {
        this.trackEvent('share', {
            method: platform,
            content_type: 'blog_post',
            item_id: postTitle
        });
    }

    static trackExternalLink(url, linkText) {
        this.trackEvent('external_link_click', {
            event_category: 'outbound',
            event_label: linkText,
            link_url: url
        });
    }

    static trackCopyLink(postTitle) {
        this.trackEvent('copy_link', {
            event_category: 'engagement',
            event_label: postTitle
        });
    }

    static trackMenuToggle() {
        this.trackEvent('menu_toggle', {
            event_category: 'navigation'
        });
    }

    static trackScrollDepth(percent, postId, postTitle) {
        this.trackEvent('scroll', {
            percent_scrolled: percent,
            post_id: String(postId),
            post_title: postTitle,
            content_type: 'blog_post'
        });
    }
}

window.AnalyticsEvents = AnalyticsEvents;

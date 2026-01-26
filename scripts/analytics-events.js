class AnalyticsEvents {
    static trackEvent(eventName, eventParams = {}) {
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, eventParams);
        }
    }

    static trackPostClick(postTitle, postId) {
        this.trackEvent('post_click', {
            'event_category': 'engagement',
            'event_label': postTitle,
            'post_id': postId
        });
    }

    static trackShare(platform, postTitle) {
        this.trackEvent('share', {
            'method': platform,
            'content_type': 'blog_post',
            'item_id': postTitle
        });
    }

    static trackExternalLink(url, linkText) {
        this.trackEvent('external_link_click', {
            'event_category': 'outbound',
            'event_label': linkText,
            'link_url': url
        });
    }

    static trackCopyLink(postTitle) {
        this.trackEvent('copy_link', {
            'event_category': 'engagement',
            'event_label': postTitle
        });
    }

    static trackLanguageSwitch(fromLang, toLang) {
        this.trackEvent('language_switch', {
            'event_category': 'navigation',
            'from_language': fromLang,
            'to_language': toLang
        });
    }

    static trackMenuToggle() {
        this.trackEvent('menu_toggle', {
            'event_category': 'navigation'
        });
    }

    static trackSearch(searchTerm) {
        this.trackEvent('search', {
            'search_term': searchTerm
        });
    }
}

window.AnalyticsEvents = AnalyticsEvents;


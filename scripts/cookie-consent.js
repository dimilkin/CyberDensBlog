class CookieConsent {
    constructor() {
        this.consentKey = 'ga_cookie_consent';
        this.measurementId = 'G-ENG5943LB4';
        this.init();
    }

    init() {
        if (!this.hasConsent()) {
            this.showBanner();
        } else if (this.getConsent() === 'accepted') {
            this.enableAnalytics();
        }
    }

    hasConsent() {
        return localStorage.getItem(this.consentKey) !== null;
    }

    getConsent() {
        return localStorage.getItem(this.consentKey);
    }

    showBanner() {
        const isEnglish = !window.location.pathname.includes('/bg/');
        
        const banner = document.createElement('div');
        banner.id = 'cookie-consent-banner';
        banner.innerHTML = isEnglish ? `
            <div class="cookie-consent-content">
                <p>This website uses cookies to analyze traffic and improve your experience.</p>
                <div class="cookie-consent-buttons">
                    <button id="accept-cookies" class="cookie-btn accept">Accept</button>
                    <button id="decline-cookies" class="cookie-btn decline">Decline</button>
                </div>
            </div>
        ` : `
            <div class="cookie-consent-content">
                <p>Този уебсайт използва бисквитки за анализ на трафика и подобряване на вашето изживяване.</p>
                <div class="cookie-consent-buttons">
                    <button id="accept-cookies" class="cookie-btn accept">Приемам</button>
                    <button id="decline-cookies" class="cookie-btn decline">Отказвам</button>
                </div>
            </div>
        `;
        document.body.appendChild(banner);

        document.getElementById('accept-cookies').addEventListener('click', () => this.acceptCookies());
        document.getElementById('decline-cookies').addEventListener('click', () => this.declineCookies());
    }

    acceptCookies() {
        localStorage.setItem(this.consentKey, 'accepted');
        this.enableAnalytics();
        this.removeBanner();
    }

    declineCookies() {
        localStorage.setItem(this.consentKey, 'declined');
        this.disableAnalytics();
        this.removeBanner();
    }

    removeBanner() {
        const banner = document.getElementById('cookie-consent-banner');
        if (banner) {
            banner.style.animation = 'slideDown 0.3s ease-out';
            setTimeout(() => banner.remove(), 300);
        }
    }

    enableAnalytics() {
        window['ga-disable-' + this.measurementId] = false;
        if (typeof gtag !== 'undefined') {
            gtag('consent', 'update', {
                'analytics_storage': 'granted'
            });
        }
    }

    disableAnalytics() {
        window['ga-disable-' + this.measurementId] = true;
        if (typeof gtag !== 'undefined') {
            gtag('consent', 'update', {
                'analytics_storage': 'denied'
            });
        }
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new CookieConsent();
    });
} else {
    new CookieConsent();
}


class CookieConsent {
    constructor() {
        this.consentKey = 'cookie_consent';
        this.init();
    }

    init() {
        if (!this.hasConsent()) {
            this.showBanner();
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
                <p>This website uses essential cookies, including analytics, to ensure proper functionality and improve your experience.</p>
                <div class="cookie-consent-buttons">
                    <button id="accept-all-cookies" class="cookie-btn accept">Allow All Cookies</button>
                    <button id="accept-essential-cookies" class="cookie-btn decline">Essential Only</button>
                </div>
            </div>
        ` : `
            <div class="cookie-consent-content">
                <p>Този уебсайт използва основни бисквитки, включително за анализ, за правилно функциониране и подобряване на вашето изживяване.</p>
                <div class="cookie-consent-buttons">
                    <button id="accept-all-cookies" class="cookie-btn accept">Всички бисквитки</button>
                    <button id="accept-essential-cookies" class="cookie-btn decline">Само основни</button>
                </div>
            </div>
        `;
        document.body.appendChild(banner);

        document.getElementById('accept-all-cookies').addEventListener('click', () => this.acceptAll());
        document.getElementById('accept-essential-cookies').addEventListener('click', () => this.acceptEssential());
    }

    acceptAll() {
        localStorage.setItem(this.consentKey, 'all');
        this.removeBanner();
    }

    acceptEssential() {
        localStorage.setItem(this.consentKey, 'essential');
        this.removeBanner();
    }

    removeBanner() {
        const banner = document.getElementById('cookie-consent-banner');
        if (banner) {
            banner.style.animation = 'slideDown 0.3s ease-out';
            setTimeout(() => banner.remove(), 300);
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

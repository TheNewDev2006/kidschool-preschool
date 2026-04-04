(function () {
    'use strict';

    if (window.CynixUrlParamsLoaded) {
        return;
    }

    window.CynixUrlParamsLoaded = true;

    var params = new URLSearchParams(window.location.search);
    var normalized = {
        businessName: params.get('businessName') || params.get('bn') || '',
        email: params.get('email') || params.get('e') || '',
        phone: params.get('phone') || params.get('p') || '',
        address: params.get('address') || params.get('a') || '',
        website: params.get('website') || params.get('w') || '',
        tagline: params.get('tagline') || params.get('t') || '',
        heroTitle: params.get('heroTitle') || params.get('ht') || '',
        color: params.get('color') || params.get('c') || ''
    };

    window.CynixUrlParams = normalized;

    // Keep personalization active when moving across site pages.
    document.addEventListener('DOMContentLoaded', function () {
        if (!params.toString()) {
            return;
        }

        var links = document.querySelectorAll('a[href]');
        links.forEach(function (link) {
            var href = link.getAttribute('href');
            if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) {
                return;
            }

            try {
                var url = new URL(href, window.location.href);
                if (url.origin !== window.location.origin) {
                    return;
                }

                if (!url.search) {
                    url.search = params.toString();
                    link.setAttribute('href', url.pathname + url.search + url.hash);
                }
            } catch (e) {
                // Ignore malformed links.
            }
        });
    });
})();

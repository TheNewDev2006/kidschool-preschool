/**
 * Cynix Inc. - Website Personalization Script
 * Personalizes content directly from URL parameters with CYNIX INC fallback.
 */

(function () {
  'use strict';

  function normalizeHexColor(value) {
    if (!value) {
      return '';
    }
    var trimmed = value.trim().replace(/^#/, '');
    if (!/^[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/.test(trimmed)) {
      return '';
    }
    return '#' + trimmed;
  }

  function getPersonalizationData() {
    var params = new URLSearchParams(window.location.search);
    var externalParams = window.CynixUrlParams || {};
    var businessName = params.get('businessName') || params.get('bn') || externalParams.businessName || 'CYNIX INC';

    return {
      schoolName: businessName,
      phone: params.get('phone') || params.get('p') || externalParams.phone || '+1 (555) 010-0000',
      email: params.get('email') || params.get('e') || externalParams.email || 'hello@cynixinc.com',
      address: params.get('address') || params.get('a') || externalParams.address || '123 Main Street, New York, NY 10001',
      website: params.get('website') || params.get('w') || externalParams.website || 'https://cynixinc.com',
      tagline: params.get('tagline') || params.get('t') || externalParams.tagline || 'Preschool & Kindergarten',
      heroTitle: params.get('heroTitle') || params.get('ht') || externalParams.heroTitle || '',
      color: normalizeHexColor(params.get('color') || params.get('c') || externalParams.color || '')
    };
  }

  function updatePageTitle(data) {
    var title = document.querySelector('title');
    if (title) {
      title.textContent = title.textContent.replace(/Kidschool|KidSchool|Kidscholl|KidScholl/gi, data.schoolName);
    }
  }

  function updateMetaDescription(data) {
    var metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      var content = metaDesc.getAttribute('content') || '';
      metaDesc.setAttribute('content', content.replace(/Kidschool|KidSchool|Kidscholl|KidScholl/gi, data.schoolName));
    }
  }

  function updatePersonalizeElements(data) {
    var elements = document.querySelectorAll('[data-personalize]');
    elements.forEach(function (el) {
      var field = el.getAttribute('data-personalize');
      if (field && data[field]) {
        el.textContent = data[field];
      }
    });
  }

  function updateContactLinks(data) {
    var phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    phoneLinks.forEach(function (link) {
      var cleanPhone = data.phone.replace(/\s+/g, '');
      link.setAttribute('href', 'tel:' + cleanPhone);
    });

    var emailLinks = document.querySelectorAll('a[href^="mailto:"]');
    emailLinks.forEach(function (link) {
      link.setAttribute('href', 'mailto:' + data.email);
    });
  }

  function replaceTextPatterns(data) {
    var replacements = [
      { pattern: /Kidschool|KidSchool|Kidscholl|KidScholl/gi, value: data.schoolName },
      { pattern: /\+208-555-0112/g, value: data.phone },
      { pattern: /kidscholl@gmail\.com|kidschool@gmail\.com/gi, value: data.email },
      { pattern: /Elgin St\. Celina, NY 10299/g, value: data.address }
    ];

    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
    var textNodes = [];
    while (walker.nextNode()) {
      textNodes.push(walker.currentNode);
    }

    textNodes.forEach(function (node) {
      var text = node.textContent;
      var changed = false;

      replacements.forEach(function (rep) {
        if (rep.pattern.test(text)) {
          text = text.replace(rep.pattern, rep.value);
          changed = true;
          rep.pattern.lastIndex = 0;
        }
      });

      if (changed) {
        node.textContent = text;
      }
    });
  }

  function updateThemeColor(data) {
    if (!data.color) {
      return;
    }
    document.documentElement.style.setProperty('--theme-color', data.color);
    document.documentElement.style.setProperty('--theme-color2', data.color);
    document.documentElement.style.setProperty('--title-color', data.color);
  }

  function personalize(data) {
    updatePageTitle(data);
    updateMetaDescription(data);
    updatePersonalizeElements(data);
    updateContactLinks(data);
    replaceTextPatterns(data);
    updateThemeColor(data);
    document.body.classList.add('personalized');
  }

  function init() {
    var data = getPersonalizationData();
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function () {
        personalize(data);
      });
      return;
    }
    personalize(data);
  }

  init();
})();

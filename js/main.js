(function () {
    "use strict";

    const config = window.SITE_CONFIG || {};

    const selectors = {
        headerMount: "[data-site-header]",
        footerMount: "[data-site-footer]",
        cookieMount: "[data-cookie-banner]",
        mobileMenu: "[data-mobile-menu]",
        mobileMenuPanel: "[data-mobile-menu-panel]",
        mobileMenuOpen: "[data-mobile-menu-open]",
        mobileMenuClose: "[data-mobile-menu-close]",
        navLink: "[data-nav-link]",
        servicesButton: "[data-services-button]",
        servicesDropdown: "[data-services-dropdown]",
        phoneWrap: "[data-phone-wrap]",
        phoneLink: "[data-phone-link]",
        emailLink: "[data-email-link]",
        addressLink: "[data-address-link]"
    };

    const state = {
        lastFocusedElement: null,
        dropdownCloseTimer: null
    };

    const getCurrentPage = () => {
        const path = window.location.pathname;
        const file = path.substring(path.lastIndexOf("/") + 1);
        return file || "index.html";
    };

    const isHomePage = () => {
        const page = getCurrentPage();
        return page === "index.html" || page === "";
    };

    const isServicePage = () => {
        return Array.isArray(config.services)
            ? config.services.some((service) => service.href === getCurrentPage())
            : false;
    };

    const isLegalPage = () => {
        return Array.isArray(config.legalLinks)
            ? config.legalLinks.some((link) => link.href === getCurrentPage())
            : false;
    };

    const safeText = (value) => {
        return String(value || "").trim();
    };

    const hasPhone = () => {
        return Boolean(safeText(config.phone));
    };

    const getPhoneHref = () => {
        return `tel:${safeText(config.phone).replace(/[^\d+]/g, "")}`;
    };

    const getEmailHref = () => {
        return `mailto:${safeText(config.email)}`;
    };

    const getAddressHref = () => {
        return safeText(config.googleMapsUrl) || "#";
    };

    const serviceById = (id) => {
        return (config.services || []).find((service) => service.id === id);
    };

    const initLucide = () => {
        if (window.lucide && typeof window.lucide.createIcons === "function") {
            window.lucide.createIcons();
        }
    };

    const applyPageMeta = () => {
        const currentPage = getCurrentPage();
        const meta = config.pageMeta?.[currentPage];

        if (!meta) return;

        if (meta.title) {
            document.title = meta.title;
        }

        if (meta.description) {
            let descriptionTag = document.querySelector('meta[name="description"]');

            if (!descriptionTag) {
                descriptionTag = document.createElement("meta");
                descriptionTag.setAttribute("name", "description");
                document.head.appendChild(descriptionTag);
            }

            descriptionTag.setAttribute("content", meta.description);
        }
    };

    const createBrandMarkup = () => {
        return `
      <a class="brand" href="index.html" aria-label="${safeText(config.brandName) || "Union"} home">
        <span class="brand__mark" aria-hidden="true">
          <img src="./assets/icons/logo-mark.svg" alt="" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
          <span class="brand__fallback" style="display:none;">UN</span>
        </span>
        <span class="brand__text">
          <span class="brand__name">${safeText(config.brandName) || "UNION"}</span>
          <span class="brand__sub">s.r.o.</span>
        </span>
      </a>
    `;
    };

    const createServicesDropdownMarkup = () => {
        const services = config.services || [];

        return `
      <div class="services-dropdown" data-services-dropdown>
        <div class="services-dropdown__grid">
          ${services
                .map(
                    (service) => `
                <a class="services-dropdown__link" href="${service.href}">
                  <span class="services-dropdown__icon" aria-hidden="true">
                    <i data-lucide="${service.icon || "sparkles"}"></i>
                  </span>
                  <span>
                    <span class="services-dropdown__title">${service.shortTitle || service.title}</span>
                    <span class="services-dropdown__text">${service.summary || ""}</span>
                  </span>
                </a>
              `
                )
                .join("")}
        </div>
      </div>
    `;
    };

    const createDesktopNavMarkup = () => {
        const currentPage = getCurrentPage();
        const servicesPages = (config.services || []).map((service) => service.href);

        return `
      <nav class="site-nav" aria-label="Main navigation">
        ${(config.navigation || [])
                .map((item) => {
                    const isServices = Boolean(item.hasDropdown);
                    const isActive =
                        item.href === currentPage ||
                        item.href === `${currentPage}${window.location.hash}` ||
                        (isServices && servicesPages.includes(currentPage));

                    if (isServices) {
                        return `
                <div class="site-nav__item">
                  <button
                    class="site-nav__button ${isActive ? "is-active" : ""}"
                    type="button"
                    aria-expanded="false"
                    aria-haspopup="true"
                    data-services-button
                  >
                    <span>${item.label}</span>
                    <i data-lucide="chevron-down" aria-hidden="true"></i>
                  </button>
                  ${createServicesDropdownMarkup()}
                </div>
              `;
                    }

                    return `
              <div class="site-nav__item">
                <a
                  class="site-nav__link ${isActive ? "is-active" : ""}"
                  href="${item.href}"
                  data-nav-link
                >
                  ${item.label}
                </a>
              </div>
            `;
                })
                .join("")}
      </nav>
    `;
    };

    const createHeaderMarkup = () => {
        const headerClass = isHomePage()
            ? "site-header site-header--hero"
            : "site-header site-header--solid";

        return `
      <header class="${headerClass}" data-header>
        <div class="site-header__inner">
          ${createBrandMarkup()}

          ${createDesktopNavMarkup()}

          <div class="site-header__actions">
            <a
              class="site-header__phone btn btn--dark btn--small ${hasPhone() ? "is-visible" : "is-hidden"}"
              href="${hasPhone() ? getPhoneHref() : "#"}"
              data-phone-link
              data-phone-wrap
            >
              <i data-lucide="phone" aria-hidden="true"></i>
              <span>${safeText(config.phone)}</span>
            </a>

            <a class="site-header__cta btn btn--primary btn--small" href="index.html#contact">
              <span>Start a Project</span>
              <i data-lucide="arrow-up-right" aria-hidden="true"></i>
            </a>

            <button
              class="burger"
              type="button"
              aria-label="Open menu"
              aria-controls="mobileMenu"
              aria-expanded="false"
              data-mobile-menu-open
            >
              <i data-lucide="menu" aria-hidden="true"></i>
            </button>
          </div>
        </div>
      </header>
    `;
    };

    const renderHeader = () => {
        const mount = document.querySelector(selectors.headerMount);
        if (!mount) return;

        mount.innerHTML = createHeaderMarkup();
    };

    const createMobileMenuMarkup = () => {
        return `
      <div class="mobile-menu" id="mobileMenu" data-mobile-menu>
        <div class="mobile-menu__panel" role="dialog" aria-modal="true" aria-label="Mobile navigation" data-mobile-menu-panel>
          <div class="mobile-menu__top">
            ${createBrandMarkup()}

            <button class="mobile-menu__close" type="button" aria-label="Close menu" data-mobile-menu-close>
              <i data-lucide="x" aria-hidden="true"></i>
            </button>
          </div>

          <nav class="mobile-menu__nav" aria-label="Mobile main navigation">
            ${(config.navigation || [])
                .filter((item) => !item.hasDropdown)
                .map(
                    (item) => `
                  <a class="mobile-menu__link" href="${item.href}" data-nav-link>
                    <span>${item.label}</span>
                    <i data-lucide="arrow-up-right" aria-hidden="true"></i>
                  </a>
                `
                )
                .join("")}
          </nav>

          <div class="mobile-menu__section">
            <p class="mobile-menu__title">Services</p>
            <div class="mobile-menu__services">
              ${(config.services || [])
                .map(
                    (service) => `
                    <a class="mobile-menu__service" href="${service.href}">
                      <span class="mobile-menu__service-icon" aria-hidden="true">
                        <i data-lucide="${service.icon || "sparkles"}"></i>
                      </span>
                      <span class="mobile-menu__service-title">${service.shortTitle || service.title}</span>
                    </a>
                  `
                )
                .join("")}
            </div>
          </div>

          <div class="mobile-menu__section">
            <p class="mobile-menu__title">Contact</p>

            <div class="mobile-menu__contact">
              <a class="mobile-menu__contact-link" href="${getEmailHref()}" data-email-link>
                <i data-lucide="mail" aria-hidden="true"></i>
                <span>${safeText(config.email)}</span>
              </a>

              <a class="mobile-menu__contact-link" href="${getAddressHref()}" target="_blank" rel="noopener" data-address-link>
                <i data-lucide="map-pin" aria-hidden="true"></i>
                <span>${safeText(config.address?.full)}</span>
              </a>

              <a
                class="mobile-menu__contact-link ${hasPhone() ? "" : "is-hidden"}"
                href="${hasPhone() ? getPhoneHref() : "#"}"
                data-phone-link
                data-phone-wrap
              >
                <i data-lucide="phone" aria-hidden="true"></i>
                <span>${safeText(config.phone)}</span>
              </a>
            </div>
          </div>

          <div class="mobile-menu__section">
            <p class="mobile-menu__title">Legal</p>
            <div class="mobile-menu__legal">
              ${(config.legalLinks || [])
                .map((link) => `<a href="${link.href}">${link.label}</a>`)
                .join("")}
            </div>
          </div>
        </div>
      </div>
    `;
    };

    const renderMobileMenu = () => {
        if (document.querySelector(selectors.mobileMenu)) return;

        document.body.insertAdjacentHTML("beforeend", createMobileMenuMarkup());
    };

    const openMobileMenu = () => {
        const menu = document.querySelector(selectors.mobileMenu);
        const panel = document.querySelector(selectors.mobileMenuPanel);
        const openButton = document.querySelector(selectors.mobileMenuOpen);

        if (!menu || !panel) return;

        state.lastFocusedElement = document.activeElement;

        menu.classList.add("is-open");
        document.body.classList.add("menu-open");

        openButton?.setAttribute("aria-expanded", "true");

        requestAnimationFrame(() => {
            const firstFocusable = panel.querySelector(
                'button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );

            firstFocusable?.focus();
        });
    };

    const closeMobileMenu = () => {
        const menu = document.querySelector(selectors.mobileMenu);
        const openButton = document.querySelector(selectors.mobileMenuOpen);

        if (!menu) return;

        menu.classList.remove("is-open");
        document.body.classList.remove("menu-open");

        openButton?.setAttribute("aria-expanded", "false");

        if (state.lastFocusedElement && typeof state.lastFocusedElement.focus === "function") {
            state.lastFocusedElement.focus();
        }
    };

    const bindMobileMenu = () => {
        const openButton = document.querySelector(selectors.mobileMenuOpen);
        const closeButton = document.querySelector(selectors.mobileMenuClose);
        const menu = document.querySelector(selectors.mobileMenu);
        const panel = document.querySelector(selectors.mobileMenuPanel);

        openButton?.addEventListener("click", openMobileMenu);
        closeButton?.addEventListener("click", closeMobileMenu);

        menu?.addEventListener("click", (event) => {
            if (!panel?.contains(event.target)) {
                closeMobileMenu();
            }
        });

        menu?.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", closeMobileMenu);
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape" && menu?.classList.contains("is-open")) {
                closeMobileMenu();
            }
        });
    };

    const bindServicesDropdown = () => {
        const buttons = document.querySelectorAll(selectors.servicesButton);

        buttons.forEach((button) => {
            const item = button.closest(".site-nav__item");
            const dropdown = item?.querySelector(selectors.servicesDropdown);

            if (!item || !dropdown) return;

            const open = () => {
                clearTimeout(state.dropdownCloseTimer);
                button.setAttribute("aria-expanded", "true");
                dropdown.classList.add("is-open");
            };

            const close = () => {
                state.dropdownCloseTimer = setTimeout(() => {
                    button.setAttribute("aria-expanded", "false");
                    dropdown.classList.remove("is-open");
                }, 120);
            };

            item.addEventListener("mouseenter", open);
            item.addEventListener("mouseleave", close);
            item.addEventListener("focusin", open);
            item.addEventListener("focusout", (event) => {
                if (!item.contains(event.relatedTarget)) {
                    close();
                }
            });

            button.addEventListener("click", () => {
                const expanded = button.getAttribute("aria-expanded") === "true";

                if (expanded) {
                    button.setAttribute("aria-expanded", "false");
                    dropdown.classList.remove("is-open");
                } else {
                    open();
                }
            });
        });
    };

    const applyDynamicContactLinks = () => {
        document.querySelectorAll(selectors.emailLink).forEach((link) => {
            link.setAttribute("href", getEmailHref());
        });

        document.querySelectorAll(selectors.addressLink).forEach((link) => {
            link.setAttribute("href", getAddressHref());
            link.setAttribute("target", "_blank");
            link.setAttribute("rel", "noopener");
        });

        document.querySelectorAll(selectors.phoneWrap).forEach((element) => {
            if (!hasPhone()) {
                element.classList.add("is-hidden");
                return;
            }

            element.classList.remove("is-hidden");
        });

        document.querySelectorAll(selectors.phoneLink).forEach((link) => {
            if (!hasPhone()) return;
            link.setAttribute("href", getPhoneHref());
        });
    };

    const setActiveNavLinks = () => {
        const currentPage = getCurrentPage();
        const servicePages = (config.services || []).map((service) => service.href);

        document.querySelectorAll(selectors.navLink).forEach((link) => {
            const href = link.getAttribute("href") || "";
            const normalizedHref = href.split("#")[0] || "index.html";

            const shouldBeActive =
                normalizedHref === currentPage ||
                (href.includes("#") && currentPage === "index.html" && window.location.hash && href.endsWith(window.location.hash)) ||
                (href.includes("#services") && servicePages.includes(currentPage));

            link.classList.toggle("is-active", shouldBeActive);
        });
    };

    const createFooterMarkup = () => {
        const year = new Date().getFullYear();

        return `
      <footer class="site-footer">
        <div class="site-footer__inner">
          <div class="site-footer__grid">
            <div class="site-footer__brand">
              ${createBrandMarkup()}
              <p class="site-footer__text">
                ${safeText(config.footer?.text)}
              </p>
            </div>

            <div class="site-footer__col">
              <h2 class="site-footer__col-title">Quick links</h2>
              <ul class="site-footer__list">
                ${(config.navigation || [])
                .filter((item) => !item.hasDropdown)
                .map((item) => `<li><a href="${item.href}">${item.label}</a></li>`)
                .join("")}
              </ul>
            </div>

            <div class="site-footer__col">
              <h2 class="site-footer__col-title">Services</h2>
              <ul class="site-footer__list">
                ${(config.services || [])
                .map((service) => `<li><a href="${service.href}">${service.title}</a></li>`)
                .join("")}
              </ul>
            </div>

            <div class="site-footer__col">
              <h2 class="site-footer__col-title">Legal</h2>
              <ul class="site-footer__list">
                ${(config.legalLinks || [])
                .map((link) => `<li><a href="${link.href}">${link.label}</a></li>`)
                .join("")}
              </ul>
            </div>

            <div class="site-footer__col">
              <h2 class="site-footer__col-title">Contact</h2>
              <div class="site-footer__contact">
                <div class="site-footer__contact-item">
                  <i data-lucide="mail" aria-hidden="true"></i>
                  <a href="${getEmailHref()}" data-email-link>${safeText(config.email)}</a>
                </div>

                <div class="site-footer__contact-item">
                  <i data-lucide="map-pin" aria-hidden="true"></i>
                  <a href="${getAddressHref()}" target="_blank" rel="noopener" data-address-link>
                    ${safeText(config.address?.full)}
                  </a>
                </div>

                <div class="site-footer__contact-item ${hasPhone() ? "" : "is-hidden"}" data-phone-wrap>
                  <i data-lucide="phone" aria-hidden="true"></i>
                  <a href="${hasPhone() ? getPhoneHref() : "#"}" data-phone-link>${safeText(config.phone)}</a>
                </div>
              </div>
            </div>
          </div>

          <div class="site-footer__bottom">
            <p>© ${year} ${safeText(config.companyName)}. All rights reserved.</p>
            <p class="site-footer__disclaimer">${safeText(config.footer?.disclaimer)}</p>
          </div>
        </div>
      </footer>
    `;
    };

    const renderFooter = () => {
        const mount = document.querySelector(selectors.footerMount);
        if (!mount) return;

        mount.innerHTML = createFooterMarkup();
    };

    const createCookieBannerMarkup = () => {
        return `
      <div class="cookie-banner" data-cookie-banner role="region" aria-label="Cookie preferences">
        <h2 class="cookie-banner__title">${safeText(config.cookieBanner?.title) || "Cookie preferences"}</h2>

        <p class="cookie-banner__text">
          ${safeText(config.cookieBanner?.text)}
        </p>

        <div class="cookie-banner__links">
          ${(config.legalLinks || [])
                .map((link) => `<a href="${link.href}">${link.label}</a>`)
                .join("")}
        </div>

        <div class="cookie-banner__actions">
          <button class="btn btn--primary btn--small" type="button" data-cookie-accept>
            ${safeText(config.cookieBanner?.accept) || "Accept"}
          </button>

          <button class="btn btn--dark btn--small" type="button" data-cookie-decline>
            ${safeText(config.cookieBanner?.decline) || "Decline"}
          </button>
        </div>
      </div>
    `;
    };

    const renderCookieBanner = () => {
        if (document.querySelector(selectors.cookieMount)) return;

        document.body.insertAdjacentHTML("beforeend", createCookieBannerMarkup());
    };

    const bindCookieBanner = () => {
        const banner = document.querySelector(selectors.cookieMount);
        const acceptButton = banner?.querySelector("[data-cookie-accept]");
        const declineButton = banner?.querySelector("[data-cookie-decline]");
        const storageKey = safeText(config.cookieBanner?.storageKey) || "union_cookie_choice";

        if (!banner) return;

        const savedChoice = localStorage.getItem(storageKey);

        if (!savedChoice) {
            requestAnimationFrame(() => {
                banner.classList.add("is-visible");
            });
        }

        const saveChoice = (choice) => {
            localStorage.setItem(storageKey, choice);
            banner.classList.remove("is-visible");
        };

        acceptButton?.addEventListener("click", () => saveChoice("accepted"));
        declineButton?.addEventListener("click", () => saveChoice("declined"));
    };

    const bindSmoothHashLinks = () => {
        document.addEventListener("click", (event) => {
            const link = event.target.closest('a[href*="#"]');

            if (!link) return;

            const href = link.getAttribute("href");
            if (!href || href === "#") return;

            const [page, hash] = href.split("#");
            const targetPage = page || getCurrentPage();

            if (!hash) return;
            if (targetPage && targetPage !== getCurrentPage() && !(targetPage === "index.html" && isHomePage())) return;

            const target = document.getElementById(hash);
            if (!target) return;

            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

            history.pushState(null, "", `#${hash}`);
            setActiveNavLinks();
        });
    };

    const bindHeaderScrollState = () => {
        const header = document.querySelector("[data-header]");
        if (!header) return;

        const update = () => {
            header.classList.toggle("is-scrolled", window.scrollY > 24);
        };

        update();
        window.addEventListener("scroll", update, { passive: true });
    };

    const exposeHelpers = () => {
        window.UNION = {
            config,
            getCurrentPage,
            isHomePage,
            isServicePage,
            isLegalPage,
            serviceById,
            refreshIcons: initLucide
        };
    };

    const init = () => {
        applyPageMeta();

        renderHeader();
        renderFooter();
        renderMobileMenu();
        renderCookieBanner();

        applyDynamicContactLinks();
        setActiveNavLinks();

        bindMobileMenu();
        bindServicesDropdown();
        bindCookieBanner();
        bindSmoothHashLinks();
        bindHeaderScrollState();

        exposeHelpers();
        initLucide();
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
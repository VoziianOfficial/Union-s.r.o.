(function () {
    "use strict";

    const config = window.SITE_CONFIG || {};

    const selectors = {
        legalNavLink: "[data-legal-nav-link]",
        revealItems: "[data-reveal]",
        companyName: "[data-company-name]",
        brandName: "[data-brand-name]",
        companyEmail: "[data-company-email]",
        companyAddress: "[data-company-address]",
        currentYear: "[data-current-year]",
        emailLink: "[data-email-link]",
        addressLink: "[data-address-link]"
    };

    const safeText = (value) => String(value || "").trim();

    const getCurrentPage = () => {
        const path = window.location.pathname;
        const file = path.substring(path.lastIndexOf("/") + 1);
        return file || "index.html";
    };

    const getEmailHref = () => {
        return `mailto:${safeText(config.email)}`;
    };

    const getAddressHref = () => {
        return safeText(config.googleMapsUrl) || "#";
    };

    const initLucide = () => {
        if (window.lucide && typeof window.lucide.createIcons === "function") {
            window.lucide.createIcons();
        }

        if (window.UNION && typeof window.UNION.refreshIcons === "function") {
            window.UNION.refreshIcons();
        }
    };

    /* ==============================
       ACTIVE LEGAL NAV
    ============================== */

    const setActiveLegalNav = () => {
        const currentPage = getCurrentPage();

        document.querySelectorAll(selectors.legalNavLink).forEach((link) => {
            const href = link.getAttribute("href") || "";
            const normalizedHref = href.split("#")[0];

            link.classList.toggle("is-active", normalizedHref === currentPage);
        });
    };

    /* ==============================
       DYNAMIC TEXT
    ============================== */

    const applyDynamicText = () => {
        document.querySelectorAll(selectors.companyName).forEach((element) => {
            element.textContent = safeText(config.companyName);
        });

        document.querySelectorAll(selectors.brandName).forEach((element) => {
            element.textContent = safeText(config.brandName);
        });

        document.querySelectorAll(selectors.companyEmail).forEach((element) => {
            element.textContent = safeText(config.email);
        });

        document.querySelectorAll(selectors.companyAddress).forEach((element) => {
            element.textContent = safeText(config.address?.full);
        });

        document.querySelectorAll(selectors.currentYear).forEach((element) => {
            element.textContent = new Date().getFullYear();
        });

        document.querySelectorAll(selectors.emailLink).forEach((link) => {
            link.setAttribute("href", getEmailHref());
        });

        document.querySelectorAll(selectors.addressLink).forEach((link) => {
            link.setAttribute("href", getAddressHref());
            link.setAttribute("target", "_blank");
            link.setAttribute("rel", "noopener");
        });
    };

    /* ==============================
       SMOOTH HASH LINKS
    ============================== */

    const bindSmoothHashLinks = () => {
        document.addEventListener("click", (event) => {
            const link = event.target.closest('a[href^="#"]');
            if (!link) return;

            const href = link.getAttribute("href");
            if (!href || href === "#") return;

            const target = document.querySelector(href);
            if (!target) return;

            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

            history.pushState(null, "", href);
        });
    };

    /* ==============================
       REVEAL ON SCROLL
    ============================== */

    const bindRevealOnScroll = () => {
        const items = document.querySelectorAll(selectors.revealItems);
        if (!items.length) return;

        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        if (prefersReducedMotion || !("IntersectionObserver" in window)) {
            items.forEach((item) => item.classList.add("is-visible"));
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;

                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                });
            },
            {
                threshold: 0.14,
                rootMargin: "0px 0px -44px 0px"
            }
        );

        items.forEach((item, index) => {
            item.style.setProperty("--reveal-delay", `${Math.min(index * 45, 220)}ms`);
            observer.observe(item);
        });
    };

    /* ==============================
       PRINT BUTTON OPTIONAL SUPPORT
    ============================== */

    const bindPrintButtons = () => {
        document.querySelectorAll("[data-print-page]").forEach((button) => {
            button.addEventListener("click", () => {
                window.print();
            });
        });
    };

    /* ==============================
       INIT
    ============================== */

    const init = () => {
        setActiveLegalNav();
        applyDynamicText();
        bindSmoothHashLinks();
        bindRevealOnScroll();
        bindPrintButtons();
        initLucide();
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
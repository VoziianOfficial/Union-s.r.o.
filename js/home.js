(function () {
    "use strict";

    const config = window.SITE_CONFIG || {};

    const selectors = {
        faqList: "[data-faq-list]",
        faqItem: "[data-faq-item]",
        faqQuestion: "[data-faq-question]",
        faqAnswer: "[data-faq-answer]",
        serviceSelect: "[data-service-select]",
        contactForm: "[data-contact-form]",
        formMessage: "[data-form-message]",
        hero: "[data-home-hero]",
        heroImage: "[data-hero-image]",
        floatingElements: "[data-float]",
        revealItems: "[data-reveal]"
    };

    const safeText = (value) => String(value || "").trim();

    const initLucide = () => {
        if (window.lucide && typeof window.lucide.createIcons === "function") {
            window.lucide.createIcons();
        }

        if (window.UNION && typeof window.UNION.refreshIcons === "function") {
            window.UNION.refreshIcons();
        }
    };

    /* ==============================
       FAQ
    ============================== */

    const getFaqItems = () => {
        if (Array.isArray(config.faq) && config.faq.length) {
            return config.faq;
        }

        return [
            {
                question: "What does Union s.r.o. help with?",
                answer:
                    "Union s.r.o. helps businesses plan and improve digital marketing through SEO, paid advertising, social media, web design, conversion-focused landing pages, and local visibility campaigns."
            },
            {
                question: "Is Union s.r.o. a direct marketing agency?",
                answer:
                    "Yes. Union s.r.o. is presented as a direct digital marketing and advertising agency. The website should not describe the company as an aggregator or provider-matching platform."
            },
            {
                question: "Can I request a custom marketing plan?",
                answer:
                    "Yes. You can submit a project request through the contact form. The team can review your business goals, target audience, current visibility, and campaign needs."
            },
            {
                question: "Do you work with small businesses?",
                answer:
                    "Yes. The website content is structured for businesses that need practical, clear, and measurable marketing support without overly complex agency language."
            }
        ];
    };

    const renderFaq = () => {
        const faqList = document.querySelector(selectors.faqList);
        if (!faqList) return;

        const faqItems = getFaqItems();

        faqList.innerHTML = faqItems
            .map(
                (item, index) => `
          <article class="faq-item" data-faq-item>
            <button
              class="faq-question"
              type="button"
              aria-expanded="${index === 0 ? "true" : "false"}"
              aria-controls="faq-answer-${index + 1}"
              data-faq-question
            >
              <span>${safeText(item.question)}</span>
              <i data-lucide="plus" aria-hidden="true"></i>
            </button>

            <div
              class="faq-answer ${index === 0 ? "is-open" : ""}"
              id="faq-answer-${index + 1}"
              data-faq-answer
            >
              <div class="faq-answer__inner">
                <p class="faq-answer__text">${safeText(item.answer)}</p>
              </div>
            </div>
          </article>
        `
            )
            .join("");

        initLucide();
    };

    const bindFaq = () => {
        const questions = document.querySelectorAll(selectors.faqQuestion);
        if (!questions.length) return;

        questions.forEach((question) => {
            question.addEventListener("click", () => {
                const currentItem = question.closest(selectors.faqItem);
                const currentAnswer = currentItem?.querySelector(selectors.faqAnswer);
                const isExpanded = question.getAttribute("aria-expanded") === "true";

                questions.forEach((button) => {
                    const item = button.closest(selectors.faqItem);
                    const answer = item?.querySelector(selectors.faqAnswer);

                    button.setAttribute("aria-expanded", "false");
                    answer?.classList.remove("is-open");
                });

                if (!isExpanded) {
                    question.setAttribute("aria-expanded", "true");
                    currentAnswer?.classList.add("is-open");
                }
            });
        });
    };

    /* ==============================
       FORM SERVICE OPTIONS
    ============================== */

    const renderServiceOptions = () => {
        const selects = document.querySelectorAll(selectors.serviceSelect);
        if (!selects.length) return;

        const services = Array.isArray(config.services) ? config.services : [];

        selects.forEach((select) => {
            const placeholder =
                select.getAttribute("data-placeholder") || "Select a service";

            select.innerHTML = `
        <option value="">${placeholder}</option>
        ${services
                    .map(
                        (service) => `
              <option value="${safeText(service.title)}">
                ${safeText(service.title)}
              </option>
            `
                    )
                    .join("")}
        <option value="Not sure yet">Not sure yet</option>
      `;
        });
    };

    /* ==============================
       FORM VALIDATION
    ============================== */

    const isValidEmail = (value) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    };

    const showFormMessage = (form, type, message) => {
        const messageBox = form.querySelector(selectors.formMessage);
        if (!messageBox) return;

        messageBox.classList.remove("form-message--success", "form-message--error");
        messageBox.classList.add("is-visible", `form-message--${type}`);
        messageBox.textContent = message;
    };

    const clearFieldError = (field) => {
        const wrapper = field.closest(".form-field");
        const error = wrapper?.querySelector(".form-field__error");

        field.removeAttribute("aria-invalid");
        field.classList.remove("is-invalid");

        if (error) {
            error.remove();
        }
    };

    const showFieldError = (field, message) => {
        const wrapper = field.closest(".form-field");
        if (!wrapper) return;

        clearFieldError(field);

        field.setAttribute("aria-invalid", "true");
        field.classList.add("is-invalid");

        const error = document.createElement("p");
        error.className = "form-field__error";
        error.textContent = message;

        wrapper.appendChild(error);
    };

    const validateForm = (form) => {
        let isValid = true;

        const requiredFields = form.querySelectorAll("[required]");

        requiredFields.forEach((field) => {
            clearFieldError(field);

            const value = safeText(field.value);
            const type = field.getAttribute("type");

            if (!value && field.type !== "checkbox") {
                showFieldError(field, "This field is required.");
                isValid = false;
                return;
            }

            if (field.type === "checkbox" && !field.checked) {
                showFieldError(field, "Please confirm this before submitting.");
                isValid = false;
                return;
            }

            if (type === "email" && value && !isValidEmail(value)) {
                showFieldError(field, "Please enter a valid email address.");
                isValid = false;
            }
        });

        return isValid;
    };

    const bindForms = () => {
        const forms = document.querySelectorAll(selectors.contactForm);
        if (!forms.length) return;

        forms.forEach((form) => {
            const fields = form.querySelectorAll("input, select, textarea");

            fields.forEach((field) => {
                field.addEventListener("input", () => clearFieldError(field));
                field.addEventListener("change", () => clearFieldError(field));
            });

            form.addEventListener("submit", (event) => {
                event.preventDefault();

                const isValid = validateForm(form);

                if (!isValid) {
                    showFormMessage(
                        form,
                        "error",
                        "Please check the highlighted fields and try again."
                    );

                    const firstInvalidField = form.querySelector("[aria-invalid='true']");
                    firstInvalidField?.focus();

                    return;
                }

                const submitButton = form.querySelector("[type='submit']");
                const originalText = submitButton?.textContent;

                if (submitButton) {
                    submitButton.disabled = true;
                    submitButton.textContent = "Sending...";
                }

                window.setTimeout(() => {
                    form.reset();

                    showFormMessage(
                        form,
                        "success",
                        safeText(config.form?.successMessage) ||
                        "Thank you. Your request has been received successfully."
                    );

                    if (submitButton) {
                        submitButton.disabled = false;
                        submitButton.textContent = originalText || "Submit request";
                    }
                }, 650);
            });
        });
    };

    /* ==============================
       HERO PARALLAX / FLOATING
    ============================== */

    const bindHeroParallax = () => {
        const hero = document.querySelector(selectors.hero);
        const heroImage = document.querySelector(selectors.heroImage);

        if (!hero) return;

        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        if (prefersReducedMotion) return;

        hero.addEventListener("pointermove", (event) => {
            const rect = hero.getBoundingClientRect();
            const x = (event.clientX - rect.left) / rect.width - 0.5;
            const y = (event.clientY - rect.top) / rect.height - 0.5;

            if (heroImage) {
                heroImage.style.transform = `translate3d(${x * 10}px, ${y * 8
                    }px, 0)`;
            }

            hero.querySelectorAll(selectors.floatingElements).forEach((element) => {
                const depth = Number(element.getAttribute("data-float")) || 1;
                element.style.transform = `translate3d(${x * depth * 8}px, ${y * depth * 8
                    }px, 0)`;
            });
        });

        hero.addEventListener("pointerleave", () => {
            if (heroImage) {
                heroImage.style.transform = "";
            }

            hero.querySelectorAll(selectors.floatingElements).forEach((element) => {
                element.style.transform = "";
            });
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
                threshold: 0.16,
                rootMargin: "0px 0px -40px 0px"
            }
        );

        items.forEach((item, index) => {
            item.style.setProperty("--reveal-delay", `${Math.min(index * 60, 240)}ms`);
            observer.observe(item);
        });
    };

    /* ==============================
       SCROLL TO NEXT SECTION
    ============================== */

    const bindHeroScrollButton = () => {
        const button = document.querySelector("[data-hero-scroll]");
        if (!button) return;

        button.addEventListener("click", () => {
            const targetSelector = button.getAttribute("data-target") || "#why";
            const target = document.querySelector(targetSelector);

            if (!target) return;

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        });
    };

    /* ==============================
       AUTO YEAR / SMALL TEXT FILLERS
    ============================== */

    const applyInlineDynamicText = () => {
        document.querySelectorAll("[data-current-year]").forEach((element) => {
            element.textContent = new Date().getFullYear();
        });

        document.querySelectorAll("[data-company-name]").forEach((element) => {
            element.textContent = safeText(config.companyName);
        });

        document.querySelectorAll("[data-brand-name]").forEach((element) => {
            element.textContent = safeText(config.brandName);
        });

        document.querySelectorAll("[data-company-email]").forEach((element) => {
            element.textContent = safeText(config.email);
        });

        document.querySelectorAll("[data-company-address]").forEach((element) => {
            element.textContent = safeText(config.address?.full);
        });
    };

    /* ==============================
       INIT
    ============================== */

    const init = () => {
        renderFaq();
        bindFaq();

        renderServiceOptions();

        bindForms();
        bindHeroParallax();
        bindRevealOnScroll();
        bindHeroScrollButton();

        applyInlineDynamicText();
        initLucide();
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
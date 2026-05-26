(function () {
    "use strict";

    const config = window.SITE_CONFIG || {};

    const selectors = {
        servicePage: "[data-service-page]",
        revealItems: "[data-reveal]",

        breadcrumbTitle: "[data-service-breadcrumb-title]",
        eyebrow: "[data-service-eyebrow]",
        title: "[data-service-title]",
        text: "[data-service-text]",

        heroImage: "[data-service-hero-image]",
        overviewImage: "[data-service-overview-image]",

        overviewTitle: "[data-service-overview-title]",
        overviewText: "[data-service-overview-text]",
        overviewFloatingTitle: "[data-service-floating-title]",
        overviewFloatingText: "[data-service-floating-text]",
        metrics: "[data-service-metrics]",

        fitList: "[data-service-fit-list]",
        doesList: "[data-service-does-list]",

        strategyText: "[data-service-strategy-text]",
        strategyCards: "[data-service-strategy-cards]",

        deliverables: "[data-service-deliverables]",

        methodSteps: "[data-service-method-steps]",

        faqList: "[data-service-faq-list]",
        faqItem: "[data-faq-item]",
        faqQuestion: "[data-faq-question]",
        faqAnswer: "[data-faq-answer]",

        relatedServices: "[data-related-services]",

        scrollButton: "[data-service-scroll]"
    };

    const safeText = (value) => String(value || "").trim();

    const getCurrentPage = () => {
        const path = window.location.pathname;
        const file = path.substring(path.lastIndexOf("/") + 1);
        return file || "index.html";
    };

    const getCurrentService = () => {
        const currentPage = getCurrentPage();

        return (config.services || []).find((service) => {
            return service.href === currentPage;
        });
    };

    const getServiceById = (id) => {
        return (config.services || []).find((service) => service.id === id);
    };

    const initLucide = () => {
        if (window.lucide && typeof window.lucide.createIcons === "function") {
            window.lucide.createIcons();
        }

        if (window.UNION && typeof window.UNION.refreshIcons === "function") {
            window.UNION.refreshIcons();
        }
    };

    const setText = (selector, value) => {
        document.querySelectorAll(selector).forEach((element) => {
            element.textContent = safeText(value);
        });
    };

    const setImage = (selector, src, alt) => {
        document.querySelectorAll(selector).forEach((image) => {
            if (!src) return;

            image.setAttribute("src", src);
            image.setAttribute("alt", alt || "");
        });
    };



    const renderServiceBasics = (service) => {
        setText(selectors.breadcrumbTitle, service.title);
        setText(selectors.eyebrow, service.eyebrow);
        setText(selectors.title, service.heroTitle);
        setText(selectors.text, service.heroText);

        setImage(
            selectors.heroImage,
            service.image,
            `${service.title} marketing service hero image`
        );

        setImage(
            selectors.overviewImage,
            service.overviewImage,
            `${service.title} strategy overview image`
        );

        setText(
            selectors.overviewTitle,
            `${service.title} shaped around clarity, structure, and practical marketing decisions.`
        );

        setText(
            selectors.overviewText,
            service.summary
        );

        setText(
            selectors.overviewFloatingTitle,
            `${service.title} direction`
        );

        setText(
            selectors.overviewFloatingText,
            "A clearer way to connect message, channel, page flow, and user action."
        );
    };



    const getMetrics = (service) => {
        const title = safeText(service.title);

        const common = [
            {
                title: "Message clarity",
                text: `${title} decisions are reviewed through the way visitors read, compare, and act.`
            },
            {
                title: "Channel logic",
                text: "The service is connected to wider marketing structure instead of treated as an isolated task."
            },
            {
                title: "Action focus",
                text: "Recommendations support clearer next steps, stronger trust, and less friction."
            }
        ];

        const custom = {
            "google-ads": [
                {
                    title: "Search intent",
                    text: "Campaigns are shaped around what people are actively searching for."
                },
                {
                    title: "Ad structure",
                    text: "Keywords, ad groups, copy, and landing pages are organized together."
                },
                {
                    title: "Review rhythm",
                    text: "Performance is easier to understand when campaigns have a clear structure."
                }
            ],
            "seo-optimization": [
                {
                    title: "Technical clarity",
                    text: "SEO starts with crawlable pages, clean metadata, and readable structure."
                },
                {
                    title: "Search intent",
                    text: "Content is shaped around what users need and how they search."
                },
                {
                    title: "Page hierarchy",
                    text: "Headings, internal links, and service pages help search engines understand the site."
                }
            ],
            "social-media-marketing": [
                {
                    title: "Content rhythm",
                    text: "Social content becomes stronger when it follows a clear publishing direction."
                },
                {
                    title: "Brand voice",
                    text: "Messaging stays recognizable, useful, and consistent across posts."
                },
                {
                    title: "Audience attention",
                    text: "Campaign themes are planned around what the audience should notice and remember."
                }
            ],
            "web-design": [
                {
                    title: "UX clarity",
                    text: "Visitors should understand the page purpose and next step quickly."
                },
                {
                    title: "Responsive flow",
                    text: "Layouts need to feel clean on desktop, tablet, and mobile screens."
                },
                {
                    title: "Visual hierarchy",
                    text: "Design choices guide attention instead of creating noise."
                }
            ],
            "conversion-boost": [
                {
                    title: "CTA clarity",
                    text: "Calls to action are reviewed for placement, wording, and visual strength."
                },
                {
                    title: "Friction review",
                    text: "Forms, sections, and page flow are checked for points that slow users down."
                },
                {
                    title: "Trust signals",
                    text: "Confidence-building details help users feel safer before taking action."
                }
            ],
            "local-seo": [
                {
                    title: "Local signals",
                    text: "Service area information and location content should be easy to understand."
                },
                {
                    title: "Search relevance",
                    text: "Local pages are shaped around real search needs and area clarity."
                },
                {
                    title: "Profile consistency",
                    text: "Business information should stay consistent across local visibility points."
                }
            ]
        };

        return custom[service.id] || common;
    };

    const renderMetrics = (service) => {
        const container = document.querySelector(selectors.metrics);
        if (!container) return;

        container.innerHTML = getMetrics(service)
            .map(
                (item) => `
          <article class="service-metric" data-reveal>
            <strong>${safeText(item.title)}</strong>
            <span>${safeText(item.text)}</span>
          </article>
        `
            )
            .join("");
    };



    const renderFitList = (service) => {
        const container = document.querySelector(selectors.fitList);
        if (!container) return;

        container.innerHTML = (service.bestFor || [])
            .map(
                (item, index) => `
          <article class="corner-card fit-card" data-reveal>
            <span class="fit-card__number">${String(index + 1).padStart(2, "0")}</span>
            <h3 class="fit-card__title">${safeText(item)}</h3>
            <p class="fit-card__text">
              This focus helps create a more organized marketing path before budget, content, or design work becomes scattered.
            </p>
          </article>
        `
            )
            .join("");
    };



    const renderDoesList = (service) => {
        const container = document.querySelector(selectors.doesList);
        if (!container) return;

        const icons = [
            "workflow",
            "search",
            "pen-tool",
            "layout-dashboard",
            "target",
            "activity"
        ];

        container.innerHTML = (service.whatWeDo || [])
            .map(
                (item, index) => `
          <article class="does-item" data-reveal>
            <span class="does-item__icon" aria-hidden="true">
              <i data-lucide="${icons[index % icons.length]}"></i>
            </span>

            <div>
              <h3 class="does-item__title">${safeText(item)}</h3>
              <p class="does-item__text">
                Union s.r.o. reviews this area through strategy, communication clarity, user flow, and practical execution.
              </p>
            </div>
          </article>
        `
            )
            .join("");
    };



    const renderStrategy = (service) => {
        setText(selectors.strategyText, service.strategyLayer);

        const container = document.querySelector(selectors.strategyCards);
        if (!container) return;

        const cards = [
            {
                icon: "sparkles",
                title: "Clearer priority setting",
                text:
                    "The most important improvements are separated from nice-to-have ideas."
            },
            {
                icon: "workflow",
                title: "Connected channel thinking",
                text:
                    "The service is reviewed as part of a wider marketing system, not a standalone action."
            },
            {
                icon: "mouse-pointer-click",
                title: "Conversion-aware decisions",
                text:
                    "Page clarity, CTAs, trust signals, and visitor confidence are included in the direction."
            }
        ];

        container.innerHTML = cards
            .map(
                (card) => `
          <article class="strategy-card" data-reveal>
            <span class="strategy-card__icon" aria-hidden="true">
              <i data-lucide="${card.icon}"></i>
            </span>

            <span>
              <strong>${safeText(card.title)}</strong>
              <span>${safeText(card.text)}</span>
            </span>
          </article>
        `
            )
            .join("");
    };



    const renderDeliverables = (service) => {
        const container = document.querySelector(selectors.deliverables);
        if (!container) return;

        const icons = [
            "clipboard-check",
            "search",
            "pen-tool",
            "layout-dashboard",
            "line-chart",
            "target"
        ];

        container.innerHTML = (service.deliverables || [])
            .map(
                (item, index) => `
          <article class="deliverable-card" data-reveal>
            <span class="deliverable-card__icon" aria-hidden="true">
              <i data-lucide="${icons[index % icons.length]}"></i>
            </span>

            <h3 class="deliverable-card__title">${safeText(item)}</h3>

            <p class="deliverable-card__text">
              A practical output designed to make the service easier to understand, improve, and connect to wider marketing work.
            </p>
          </article>
        `
            )
            .join("");
    };



    const renderMethodSteps = () => {
        const container = document.querySelector(selectors.methodSteps);
        if (!container) return;

        const steps = [
            {
                title: "Review the current situation",
                text:
                    "Union s.r.o. looks at the service area, page structure, message, audience needs, and current marketing path."
            },
            {
                title: "Define the clearer direction",
                text:
                    "Priorities are organized into a practical structure so the work has a stronger starting point."
            },
            {
                title: "Shape the execution plan",
                text:
                    "Recommendations focus on what should be adjusted, created, refined, or aligned."
            },
            {
                title: "Improve through review",
                text:
                    "The direction can be reviewed over time as campaigns, pages, and audience behavior evolve."
            }
        ];

        container.innerHTML = steps
            .map(
                (step, index) => `
          <article class="method-step" data-reveal>
            <span class="method-step__number">${String(index + 1).padStart(2, "0")}</span>
            <div>
              <h3 class="method-step__title">${safeText(step.title)}</h3>
              <p class="method-step__text">${safeText(step.text)}</p>
            </div>
          </article>
        `
            )
            .join("");
    };



    const renderFaq = (service) => {
        const container = document.querySelector(selectors.faqList);
        if (!container) return;

        container.innerHTML = (service.faqs || [])
            .map(
                (item, index) => `
          <article class="faq-item" data-faq-item data-reveal>
            <button
              class="faq-question"
              type="button"
              aria-expanded="${index === 0 ? "true" : "false"}"
              aria-controls="service-faq-answer-${index + 1}"
              data-faq-question
            >
              <span>${safeText(item.question)}</span>
              <i data-lucide="plus" aria-hidden="true"></i>
            </button>

            <div
              class="faq-answer ${index === 0 ? "is-open" : ""}"
              id="service-faq-answer-${index + 1}"
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



    const renderRelatedServices = (service) => {
        const container = document.querySelector(selectors.relatedServices);
        if (!container) return;

        const related = (service.related || [])
            .map((id) => getServiceById(id))
            .filter(Boolean);

        const fallback = (config.services || [])
            .filter((item) => item.id !== service.id)
            .slice(0, 3);

        const items = related.length ? related : fallback;

        container.innerHTML = items
            .map(
                (item) => `
          <article class="related-card" data-reveal>
            <span class="related-card__icon" aria-hidden="true">
              <i data-lucide="${item.icon || "sparkles"}"></i>
            </span>

            <h3 class="related-card__title">${safeText(item.title)}</h3>

            <p class="related-card__text">${safeText(item.summary)}</p>

            <a class="text-link related-card__link" href="${item.href}">
              <span>Explore service</span>
              <i data-lucide="arrow-up-right" aria-hidden="true"></i>
            </a>
          </article>
        `
            )
            .join("");
    };



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



    const bindScrollButton = () => {
        const button = document.querySelector(selectors.scrollButton);
        if (!button) return;

        button.addEventListener("click", () => {
            const targetSelector = button.getAttribute("data-target") || "#overview";
            const target = document.querySelector(targetSelector);

            if (!target) return;

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        });
    };



    const applyServiceBodyClass = (service) => {
        document.body.classList.add(`service-${service.id}`);
    };



    const init = () => {
        const service = getCurrentService();

        if (!service) {
            console.warn("Union service page data was not found for:", getCurrentPage());
            return;
        }

        applyServiceBodyClass(service);

        renderServiceBasics(service);
        renderMetrics(service);
        renderFitList(service);
        renderDoesList(service);
        renderStrategy(service);
        renderDeliverables(service);
        renderMethodSteps();
        renderFaq(service);
        renderRelatedServices(service);

        bindFaq();
        bindScrollButton();
        bindRevealOnScroll();

        initLucide();
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
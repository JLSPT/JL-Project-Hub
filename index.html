
/* =========================================
   JL PROJECT HUB
   Complete Page Navigation
========================================= */

document.addEventListener("DOMContentLoaded", () => {
    const navigation = document.getElementById("navigation");
    const menuToggle = document.getElementById("menuToggle");

    const navLinks = document.querySelectorAll(
        ".nav-link[data-page]"
    );

    const pageTriggers = document.querySelectorAll("[data-page]");

    const pageSections = document.querySelectorAll(
        ".page-section[data-section]"
    );

    const validPages = [
        "home",
        "voting",
        "streaming",
        "calendar",
        "red-corner",
        "profile"
    ];

    function closeMobileMenu() {
        if (!navigation || !menuToggle) return;

        navigation.classList.remove("is-open");
        menuToggle.classList.remove("is-active");
        menuToggle.setAttribute("aria-expanded", "false");
    }

    function showPage(pageName, updateHash = true) {
        const targetPage = validPages.includes(pageName)
            ? pageName
            : "home";

        pageSections.forEach((section) => {
            const isActive =
                section.dataset.section === targetPage;

            section.hidden = !isActive;
            section.classList.toggle("active", isActive);
            section.classList.toggle("is-active", isActive);
        });

        navLinks.forEach((link) => {
            const isActive = link.dataset.page === targetPage;

            link.classList.toggle("active", isActive);
            link.classList.toggle("is-active", isActive);

            if (isActive) {
                link.setAttribute("aria-current", "page");
            } else {
                link.removeAttribute("aria-current");
            }
        });

        if (
            updateHash &&
            window.location.hash !== `#${targetPage}`
        ) {
            window.history.pushState(
                { page: targetPage },
                "",
                `#${targetPage}`
            );
        }

        closeMobileMenu();
        window.scrollTo({ top: 0, behavior: "auto" });

        document.dispatchEvent(
            new CustomEvent("hub:pagechange", {
                detail: { page: targetPage }
            })
        );
    }

    window.showHubPage = showPage;

    // Handle navigation links and all buttons using data-page.
    pageTriggers.forEach((trigger) => {
        trigger.addEventListener("click", (event) => {
            const targetPage = trigger.dataset.page;

            if (!validPages.includes(targetPage)) return;

            event.preventDefault();
            showPage(targetPage);
        });
    });

    // Clicking the logo returns to Home.
    document.querySelectorAll(".brand").forEach((brand) => {
        brand.addEventListener("click", (event) => {
            event.preventDefault();
            showPage("home");
        });
    });

    // Mobile navigation menu.
    if (menuToggle && navigation) {
        menuToggle.setAttribute("aria-expanded", "false");

        menuToggle.addEventListener("click", () => {
            const isOpen = navigation.classList.toggle("is-open");

            menuToggle.classList.toggle("is-active", isOpen);
            menuToggle.setAttribute(
                "aria-expanded",
                String(isOpen)
            );
        });
    }

    // Browser Back and Forward support.
    window.addEventListener("popstate", () => {
        const pageFromHash =
            window.location.hash.slice(1) || "home";

        showPage(pageFromHash, false);
    });

    // Support direct links such as index.html#streaming.
    const initialPage =
        window.location.hash.slice(1) || "home";

    showPage(initialPage, false);
});

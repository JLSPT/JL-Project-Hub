
/* =========================================
   JL PROJECT HUB
   Page Navigation
========================================= */

document.addEventListener("DOMContentLoaded", () => {
    const navigation = document.getElementById("navigation");
    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.querySelectorAll(".nav-link[data-page]");
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

            section.classList.toggle("is-active", isActive);
            section.hidden = !isActive;
        });

        navLinks.forEach((link) => {
            const isActive = link.dataset.page === targetPage;

            link.classList.toggle("is-active", isActive);

            if (isActive) {
                link.setAttribute("aria-current", "page");
            } else {
                link.removeAttribute("aria-current");
            }
        });

        if (updateHash && window.location.hash !== `#${targetPage}`) {
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

    // Make the page switcher available to other scripts.
    window.showHubPage = showPage;

    // Navigation links.
    navLinks.forEach((link) => {
        link.addEventListener("click", (event) => {
            event.preventDefault();
            showPage(link.dataset.page);
        });
    });

    // Brand logo returns to Home.
    document.querySelectorAll(".brand").forEach((brand) => {
        brand.addEventListener("click", (event) => {
            event.preventDefault();
            showPage("home");
        });
    });

    // Mobile menu toggle.
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

    // Browser Back and Forward buttons.
    window.addEventListener("popstate", () => {
        const pageFromHash = window.location.hash.slice(1) || "home";
        showPage(pageFromHash, false);
    });

    // Open the page specified in the URL.
    const initialPage = window.location.hash.slice(1) || "home";
    showPage(initialPage, false);
});

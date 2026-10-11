
/* =========================================
   JL PROJECT HUB
   PAGE NAVIGATION
========================================= */

document.addEventListener("DOMContentLoaded", () => {
    const nav = document.getElementById("navigation");
    const menuToggle = document.getElementById("menuToggle");

    const navLinks = document.querySelectorAll(
        ".nav-link[data-page]"
    );

    const pageSections = document.querySelectorAll(
        ".page-section[data-section]"
    );

    const pageButtons = document.querySelectorAll(
        "[data-page]:not(.nav-link)"
    );

    const validPages = [
        "home",
        "voting",
        "streaming",
        "calendar",
        "red-corner",
        "profile"
    ];

    function showPage(pageName, updateHash = true) {
        if (!validPages.includes(pageName)) {
            pageName = "home";
        }

        pageSections.forEach((section) => {
            const isActive =
                section.dataset.section === pageName;

            section.classList.toggle("active", isActive);
            section.setAttribute(
                "aria-hidden",
                String(!isActive)
            );
        });

        navLinks.forEach((link) => {
            const isActive =
                link.dataset.page === pageName;

            link.classList.toggle("active", isActive);

            if (isActive) {
                link.setAttribute("aria-current", "page");
            } else {
                link.removeAttribute("aria-current");
            }
        });

        closeMobileMenu();

        if (updateHash) {
            const newHash = `#${pageName}`;

            if (window.location.hash !== newHash) {
                window.history.pushState(
                    { page: pageName },
                    "",
                    newHash
                );
            }
        }

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

        document.dispatchEvent(
            new CustomEvent("hub:pagechange", {
                detail: { page: pageName }
            })
        );
    }

    function closeMobileMenu() {
        if (!nav || !menuToggle) return;

        nav.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute(
            "aria-label",
            "Open navigation"
        );
        menuToggle.textContent = "☰";
    }

    function toggleMobileMenu() {
        if (!nav || !menuToggle) return;

        const isOpen = nav.classList.toggle("open");

        menuToggle.setAttribute(
            "aria-expanded",
            String(isOpen)
        );

        menuToggle.setAttribute(
            "aria-label",
            isOpen ? "Close navigation" : "Open navigation"
        );

        menuToggle.textContent = isOpen ? "×" : "☰";
    }

    // Main navigation links
    navLinks.forEach((link) => {
        link.addEventListener("click", (event) => {
            event.preventDefault();
            showPage(link.dataset.page);
        });
    });

    // Buttons and links that navigate to another page
    pageButtons.forEach((element) => {
        element.addEventListener("click", (event) => {
            const pageName = element.dataset.page;

            if (!validPages.includes(pageName)) return;

            event.preventDefault();
            showPage(pageName);
        });
    });

    // Mobile navigation toggle
    if (menuToggle) {
        menuToggle.addEventListener(
            "click",
            toggleMobileMenu
        );
    }

    // Browser back and forward buttons
    window.addEventListener("popstate", () => {
        const pageName = window.location.hash
            .replace("#", "");

        showPage(pageName || "home", false);
    });

    // Open the correct page when a URL hash is provided
    const initialPage = window.location.hash
        .replace("#", "");

    showPage(
        validPages.includes(initialPage)
            ? initialPage
            : "home",
        false
    );
});

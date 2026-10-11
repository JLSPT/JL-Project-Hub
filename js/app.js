
/* =========================================
   JL PROJECT HUB
   MAIN APPLICATION
========================================= */

document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    // Current year for the footer
    const currentYear = document.getElementById("currentYear");

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }

    // Shared page navigation helper
    window.showHubPage = function (pageName) {
        const link = document.querySelector(
            `.nav-link[data-page="${pageName}"]`
        );

        if (link) {
            link.click();
            return;
        }

        const section = document.querySelector(
            `.page-section[data-section="${pageName}"]`
        );

        if (section) {
            document.querySelectorAll(".page-section").forEach(
                (page) => {
                    page.classList.toggle(
                        "active",
                        page === section
                    );
                }
            );

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        }
    };

    // Make external links open safely in a new tab
    document.querySelectorAll('a[target="_blank"]').forEach(
        (link) => {
            const existing = link.getAttribute("rel") || "";

            const relValues = new Set(existing.split(/\s+/).filter(Boolean));

            relValues.add("noopener");
            relValues.add("noreferrer");

            link.setAttribute("rel", [...relValues].join(" "));
        }
    );

    // Announce that the interface is ready
    document.documentElement.classList.add("app-ready");

    document.dispatchEvent(
        new CustomEvent("hub:ready")
    );
});

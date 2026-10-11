
/* =========================================
   JL PROJECT HUB
   App Initialization
========================================= */

document.addEventListener("DOMContentLoaded", () => {
    // Automatically update the footer year.
    const copyrightYear = document.getElementById("copyrightYear");

    if (copyrightYear) {
        copyrightYear.textContent = new Date().getFullYear();
    }

    // Add safe attributes to external links.
    document.querySelectorAll('a[target="_blank"]').forEach((link) => {
        const existingRel = link.getAttribute("rel") || "";
        const relValues = new Set(existingRel.split(/\s+/).filter(Boolean));

        relValues.add("noopener");
        relValues.add("noreferrer");

        link.setAttribute("rel", [...relValues].join(" "));
    });

    // Mark the site as initialized.
    document.documentElement.classList.add("app-ready");

    // Notify other scripts that the app is ready.
    document.dispatchEvent(new CustomEvent("hub:ready"));
});

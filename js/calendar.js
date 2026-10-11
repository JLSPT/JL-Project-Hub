
/* =========================================
   JL PROJECT HUB
   GLOBAL CONTENT SEARCH
========================================= */

document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("hubSearchInput");
    const searchResults = document.getElementById("searchResults");
    const clearButton = document.getElementById("clearSearch");

    if (!searchInput || !searchResults) return;

    const searchableItems = Array.from(
        document.querySelectorAll("[data-search-item]")
    );

    const normalize = (value) =>
        String(value || "")
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/\s+/g, " ")
            .trim();

    function getItemTitle(item) {
        return (
            item.dataset.searchTitle ||
            item.querySelector("h1, h2, h3, h4, .card-title")
                ?.textContent ||
            "Untitled resource"
        ).trim();
    }

    function getItemDescription(item) {
        const description = item.querySelector(
            ".card-description, p"
        );

        return description
            ? description.textContent.trim()
            : "Open this section to explore more information.";
    }

    function getItemPage(item) {
        const pageSection = item.closest("[data-section]");

        return pageSection
            ? pageSection.dataset.section
            : "home";
    }

    function getItemSearchText(item) {
        return normalize([
            item.dataset.searchTitle,
            item.dataset.searchKeywords,
            item.textContent
        ].join(" "));
    }

    function makeResult(item) {
        const result = document.createElement("button");
        result.type = "button";
        result.className = "search-result-item";

        const title = document.createElement("span");
        title.className = "search-result-title";
        title.textContent = getItemTitle(item);

        const description = document.createElement("span");
        description.className = "search-result-description";
        description.textContent = getItemDescription(item);

        const category = document.createElement("span");
        category.className = "search-result-category";
        category.textContent = getItemPage(item)
            .replace("-", " ")
            .replace(/\b\w/g, (letter) => letter.toUpperCase());

        result.append(title, description, category);

        result.addEventListener("click", () => {
            const page = getItemPage(item);

            if (typeof window.showHubPage === "function") {
                window.showHubPage(page);
            } else {
                const navLink = document.querySelector(
                    `.nav-link[data-page="${page}"]`
                );

                if (navLink) {
                    navLink.click();
                }
            }

            // Bring the matching item into view when possible.
            window.setTimeout(() => {
                item.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });

                item.classList.add("search-highlight");

                window.setTimeout(() => {
                    item.classList.remove("search-highlight");
                }, 1800);
            }, 100);
        });

        return result;
    }

    function renderHint(message) {
        searchResults.replaceChildren();

        const hint = document.createElement("p");
        hint.className = "search-hint";
        hint.textContent = message;

        searchResults.appendChild(hint);
    }

    function performSearch() {
        const query = normalize(searchInput.value);

        if (clearButton) {
            clearButton.hidden = query.length === 0;
        }

        if (!query) {
            renderHint(
                'Try "AHOF", "voting guide", "Stationhead", or "calendar".'
            );
            return;
        }

        const terms = query.split(" ").filter(Boolean);

        const matches = searchableItems
            .map((item) => {
                const text = getItemSearchText(item);

                const matched = terms.every((term) =>
                    text.includes(term)
                );

                if (!matched) return null;

                let score = 0;
                const title = normalize(getItemTitle(item));
                const keywords = normalize(
                    item.dataset.searchKeywords
                );

                if (title === query) score += 100;
                if (title.includes(query)) score += 50;
                if (keywords.includes(query)) score += 25;

                return { item, score };
            })
            .filter(Boolean)
            .sort((a, b) => b.score - a.score);

        searchResults.replaceChildren();

        if (matches.length === 0) {
            const empty = document.createElement("div");
            empty.className = "search-empty";

            const heading = document.createElement("h3");
            heading.textContent = "No matching resources found";

            const description = document.createElement("p");
            description.textContent =
                "Try another keyword, platform name, song title, or campaign category.";

            empty.append(heading, description);
            searchResults.appendChild(empty);
            return;
        }

        const summary = document.createElement("p");
        summary.className = "search-summary";
        summary.textContent =
            `${matches.length} resource${matches.length === 1 ? "" : "s"} found`;

        const list = document.createElement("div");
        list.className = "search-result-list";

        matches.forEach(({ item }) => {
            list.appendChild(makeResult(item));
        });

        searchResults.append(summary, list);
    }

    searchInput.addEventListener("input", performSearch);

    if (clearButton) {
        clearButton.addEventListener("click", () => {
            searchInput.value = "";
            performSearch();
            searchInput.focus();
        });
    }

    // Allow other scripts to refresh the search index after content changes.
    document.addEventListener("hub:contentupdated", () => {
        searchableItems.splice(
            0,
            searchableItems.length,
            ...document.querySelectorAll("[data-search-item]")
        );

        performSearch();
    });
});

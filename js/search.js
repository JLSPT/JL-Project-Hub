
/* =========================================
   JL PROJECT HUB
   Resource Search
========================================= */

document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("hubSearchInput");
    const searchResults = document.getElementById("searchResults");
    const clearButton = document.getElementById("clearSearch");

    if (!searchInput || !searchResults) return;

    const searchableItems = Array.from(
        document.querySelectorAll("[data-search-item]")
    );

    function getItemTitle(item) {
        return (
            item.dataset.searchTitle ||
            item.querySelector("h1, h2, h3, h4, .card-title, .station-title")
                ?.textContent?.trim() ||
            "Untitled resource"
        );
    }

    function getItemKeywords(item) {
        return item.dataset.searchKeywords || "";
    }

    function getItemDescription(item) {
        return (
            item.dataset.searchDescription ||
            item.querySelector(
                ".card-description, .station-description, p"
            )?.textContent?.trim() ||
            ""
        );
    }

    function getItemPage(item) {
        const section = item.closest("[data-section]");
        return section?.dataset.section || "home";
    }

    function normalizeText(value) {
        return value.toLowerCase().trim();
    }

    function clearResults() {
        searchResults.replaceChildren();
        searchResults.hidden = true;
    }

    function createResult(item, query) {
        const title = getItemTitle(item);
        const description = getItemDescription(item);
        const keywords = getItemKeywords(item);
        const page = getItemPage(item);

        const result = document.createElement("button");
        result.type = "button";
        result.className = "search-result-item";

        const titleElement = document.createElement("span");
        titleElement.className = "search-result-title";
        titleElement.textContent = title;

        const descriptionElement = document.createElement("span");
        descriptionElement.className = "search-result-description";
        descriptionElement.textContent = description;

        const categoryElement = document.createElement("span");
        categoryElement.className = "search-result-category";
        categoryElement.textContent = page
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");

        result.append(
            titleElement,
            descriptionElement,
            categoryElement
        );

        result.addEventListener("click", () => {
            if (typeof window.showHubPage === "function") {
                window.showHubPage(page);
            }

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

            searchInput.value = "";
            clearResults();
        });

        return result;
    }

    function searchResources() {
        const query = normalizeText(searchInput.value);

        searchResults.replaceChildren();

        if (!query) {
            searchResults.hidden = true;
            return;
        }

        const matches = searchableItems.filter((item) => {
            const searchableText = normalizeText([
                getItemTitle(item),
                getItemDescription(item),
                getItemKeywords(item),
                item.textContent || ""
            ].join(" "));

            return searchableText.includes(query);
        });

        searchResults.hidden = false;

        const list = document.createElement("div");
        list.className = "search-result-list";

        if (matches.length === 0) {
            const emptyMessage = document.createElement("p");
            emptyMessage.className = "search-empty";
            emptyMessage.textContent =
                "No resources found. Try another keyword.";

            list.appendChild(emptyMessage);
        } else {
            matches.forEach((item) => {
                list.appendChild(createResult(item, query));
            });
        }

        searchResults.appendChild(list);
    }

    searchInput.addEventListener("input", searchResources);

    if (clearButton) {
        clearButton.addEventListener("click", () => {
            searchInput.value = "";
            clearResults();
            searchInput.focus();
        });
    }

    document.addEventListener("click", (event) => {
        const clickedInsideSearch =
            searchInput.contains(event.target) ||
            searchResults.contains(event.target) ||
            clearButton?.contains(event.target);

        if (!clickedInsideSearch) {
            clearResults();
        }
    });

    searchInput.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            searchInput.value = "";
            clearResults();
            searchInput.blur();
        }
    });
});

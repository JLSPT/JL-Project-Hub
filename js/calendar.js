
/* =========================================
   JL PROJECT HUB
   EVENT CALENDAR — KST
========================================= */

document.addEventListener("DOMContentLoaded", () => {
    const calendarGrid = document.getElementById("calendarGrid");
    const monthLabel = document.getElementById("calendarMonth");

    // These IDs match the current index.html.
    const previousButton = document.getElementById("prevMonth");
    const nextButton = document.getElementById("nextMonth");

    if (!calendarGrid || !monthLabel) {
        console.warn("Calendar elements were not found.");
        return;
    }

    const TIME_ZONE = "Asia/Seoul";

    function getKSTDateParts(date = new Date()) {
        const parts = new Intl.DateTimeFormat("en-CA", {
            timeZone: TIME_ZONE,
            year: "numeric",
            month: "2-digit",
            day: "2-digit"
        }).formatToParts(date);

        const get = (type) =>
            Number(parts.find((part) => part.type === type).value);

        return {
            year: get("year"),
            month: get("month"),
            day: get("day")
        };
    }

    const today = getKSTDateParts();

    let viewYear = today.year;
    let viewMonth = today.month - 1;

    /*
     * Add confirmed events here when ready.
     *
     * Example:
     * {
     *   date: "2026-10-21",
     *   title: "Project Deadline",
     *   type: "gold",
     *   time: "20:00"
     * }
     *
     * Supported types: "gold", "green", "default"
     * Times use KST (UTC+9).
     */

    const events = [];

    const monthFormatter = new Intl.DateTimeFormat("en", {
        month: "long",
        year: "numeric",
        timeZone: TIME_ZONE
    });

    function pad(number) {
        return String(number).padStart(2, "0");
    }

    function formatDate(year, monthIndex, day) {
        return `${year}-${pad(monthIndex + 1)}-${pad(day)}`;
    }

    function makeElement(tag, className, text) {
        const element = document.createElement(tag);

        if (className) {
            element.className = className;
        }

        if (text !== undefined) {
            element.textContent = text;
        }

        return element;
    }

    function renderCalendar() {
        const firstDate = new Date(
            Date.UTC(viewYear, viewMonth, 1, 12)
        );

        monthLabel.textContent = monthFormatter.format(firstDate);
        calendarGrid.replaceChildren();

        const weekdays = [
            "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"
        ];

        weekdays.forEach((weekday) => {
            calendarGrid.appendChild(
                makeElement("div", "calendar-weekday", weekday)
            );
        });

        const firstWeekday = firstDate.getUTCDay();

        const daysInMonth = new Date(
            Date.UTC(viewYear, viewMonth + 1, 0, 12)
        ).getUTCDate();

        const daysInPreviousMonth = new Date(
            Date.UTC(viewYear, viewMonth, 0, 12)
        ).getUTCDate();

        const totalCells =
            Math.ceil((firstWeekday + daysInMonth) / 7) * 7;

        for (let cell = 0; cell < totalCells; cell++) {
            let day;
            let year = viewYear;
            let month = viewMonth;
            let isCurrentMonth = true;

            if (cell < firstWeekday) {
                day = daysInPreviousMonth - firstWeekday + cell + 1;
                isCurrentMonth = false;

                if (month === 0) {
                    year--;
                    month = 11;
                } else {
                    month--;
                }
            } else if (cell >= firstWeekday + daysInMonth) {
                day = cell - firstWeekday - daysInMonth + 1;
                isCurrentMonth = false;

                if (month === 11) {
                    year++;
                    month = 0;
                } else {
                    month++;
                }
            } else {
                day = cell - firstWeekday + 1;
            }

            const dateKey = formatDate(year, month, day);

            const dayElement = makeElement(
                "div",
                "calendar-day" + (!isCurrentMonth ? " muted" : "")
            );

            if (
                year === today.year &&
                month === today.month - 1 &&
                day === today.day
            ) {
                dayElement.classList.add("today");
            }

            dayElement.appendChild(
                makeElement("span", "calendar-date", String(day))
            );

            events
                .filter((event) => event.date === dateKey)
                .forEach((event) => {
                    const eventClass = [
                        "calendar-event",
                        ["gold", "green"].includes(event.type)
                            ? event.type
                            : ""
                    ].filter(Boolean).join(" ");

                    const eventText = event.time
                        ? `${event.time} ${event.title}`
                        : event.title;

                    const eventElement = makeElement(
                        "div",
                        eventClass,
                        eventText
                    );

                    eventElement.title = `${event.title}${event.time ? ` · ${event.time} KST` : ""}`;

                    dayElement.appendChild(eventElement);
                });

            calendarGrid.appendChild(dayElement);
        }
    }

    function changeMonth(offset) {
        viewMonth += offset;

        if (viewMonth < 0) {
            viewMonth = 11;
            viewYear--;
        } else if (viewMonth > 11) {
            viewMonth = 0;
            viewYear++;
        }

        renderCalendar();
    }

    if (previousButton) {
        previousButton.addEventListener("click", () => {
            changeMonth(-1);
        });
    }

    if (nextButton) {
        nextButton.addEventListener("click", () => {
            changeMonth(1);
        });
    }

    renderCalendar();
});

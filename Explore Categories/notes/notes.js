
document.addEventListener("DOMContentLoaded", () => {

    // =====================================
    // 1. GET HTML ELEMENTS
    // =====================================

    const notesSearch = document.getElementById("notesSearch");
    const departmentFilter = document.getElementById("notesDepartment");
    const semesterFilter = document.getElementById("notesSemester");

    const subjectTags = document.querySelectorAll(".notes-subject-tag");

    const typeButtons = document.querySelectorAll(".notes-type-btn");

    const notesShowMore = document.getElementById("notesShowMore");
    const resetButton = document.getElementById("reset");

    const notesGrid = document.getElementById("notesGrid");
    const noteCards = Array.from(
        notesGrid.querySelectorAll(".note-card")
    );

    const notesCount = document.getElementById("notesCount");
    const sortNotes = document.getElementById("sortNotes");


    // =====================================
    // 2. FILTER STATE
    // =====================================

    let selectedSubjects = new Set();

    subjectTags.forEach(tag => {

        if (tag.classList.contains("active") ||
            tag.getAttribute("aria-pressed") === "true") {

            selectedSubjects.add(tag.dataset.subject);

        }

    });

    let selectedType =
        document.querySelector(".notes-type-btn.active")?.dataset.type ||
        document.querySelector('.notes-type-btn[aria-pressed="true"]')?.dataset.type ||
        "";


    // =====================================
    // 3. SUBJECT TAG FILTER
    // =====================================

    function normalizeSubject(subject) {

        return subject
            .toLowerCase()
            .replace(/[\s-]+/g, "");

    }

    subjectTags.forEach(tag => {

        tag.addEventListener("click", () => {

            const subject = tag.dataset.subject;

            if (selectedSubjects.has(subject)) {

                selectedSubjects.delete(subject);

                tag.classList.remove("active");
                tag.setAttribute("aria-pressed", "false");

            } else {

                selectedSubjects.add(subject);

                tag.classList.add("active");
                tag.setAttribute("aria-pressed", "true");

            }

            filterNotes();

        });

    });


    // =====================================
    // 4. FREE / EXCHANGE FILTER
    // =====================================

    function updateTypeButtons() {

        typeButtons.forEach(button => {

            const isActive =
                button.dataset.type === selectedType;

            button.classList.toggle("active", isActive);

            button.setAttribute(
                "aria-pressed",
                isActive ? "true" : "false"
            );

        });

    }

    typeButtons.forEach(button => {

        button.addEventListener("click", () => {

            const clickedType = button.dataset.type;

            // Clicking the selected type clears the filter
            selectedType =
                selectedType === clickedType ? "" : clickedType;

            updateTypeButtons();
            filterNotes();

        });

    });


    // =====================================
    // 5. FILTER NOTES
    // =====================================

    function filterNotes() {

        const searchValue = notesSearch.value
            .trim()
            .toLowerCase();

        const selectedDepartment = departmentFilter.value;
        const selectedSemester = semesterFilter.value;

        let visibleCount = 0;

        noteCards.forEach(card => {

            const title = card.dataset.title.toLowerCase();

            const subject = card.dataset.subject.toLowerCase();

            const department = card.dataset.department;

            const semester = card.dataset.semester;

            const type = card.dataset.type;

            // Search by title or subject
            const matchesSearch =
                title.includes(searchValue) ||
                subject.includes(searchValue);

            // Department filter
            const matchesDepartment =
                selectedDepartment === "all" ||
                department === selectedDepartment;

            // Semester filter
            const matchesSemester =
                selectedSemester === "all" ||
                semester === selectedSemester;

            // Subject tag filter (OR logic)
            const matchesSubject =
                selectedSubjects.size === 0 ||
                [...selectedSubjects].some(selectedSubject =>
                    normalizeSubject(selectedSubject) ===
                    normalizeSubject(subject)
                );

            // Free / Exchange filter
            const matchesType =
                selectedType === "" ||
                type === selectedType;

            const isVisible =
                matchesSearch &&
                matchesDepartment &&
                matchesSemester &&
                matchesSubject &&
                matchesType;

            card.hidden = !isVisible;

            if (isVisible) {
                visibleCount++;
            }

        });

        // Update count
        notesCount.textContent = visibleCount;

    }


    // =====================================
    // 6. SORT NOTES
    // =====================================

    function sortNotesCards() {

        const sortValue = sortNotes.value;

        const sortedCards = [...noteCards];

        if (sortValue === "popular") {

            sortedCards.sort((a, b) => {

                return Number(b.dataset.popularity) -
                       Number(a.dataset.popularity);

            });

        }

        else if (sortValue === "rating") {

            sortedCards.sort((a, b) => {

                return Number(b.dataset.rating) -
                       Number(a.dataset.rating);

            });

        }

        else if (sortValue === "title") {

            sortedCards.sort((a, b) => {

                return a.dataset.title.localeCompare(
                    b.dataset.title
                );

            });

        }

        // Reorder cards in the HTML
        sortedCards.forEach(card => {

            notesGrid.appendChild(card);

        });

    }


    // =====================================
    // 7. SHOW MORE SUBJECT TAGS
    // =====================================

    notesShowMore.addEventListener("click", () => {

        const isExpanded =
            notesShowMore.getAttribute("aria-expanded") === "true";

        const extraTags = document.querySelectorAll(".extra-note-tag");

        extraTags.forEach(tag => {

            tag.hidden = isExpanded;

        });

        notesShowMore.setAttribute(
            "aria-expanded",
            isExpanded ? "false" : "true"
        );

        notesShowMore.innerHTML = isExpanded
            ? '<i class="fa-solid fa-plus"></i> Show more'
            : '<i class="fa-solid fa-minus"></i> Show less';

    });


    // =====================================
    // 8. EVENT LISTENERS
    // =====================================

    notesSearch.addEventListener("input", filterNotes);

    departmentFilter.addEventListener("change", filterNotes);

    semesterFilter.addEventListener("change", filterNotes);

    sortNotes.addEventListener("change", () => {

        sortNotesCards();
        filterNotes();

    });


    // =====================================
    // 9. RESET ALL FILTERS
    // =====================================

    resetButton.addEventListener("click", () => {

        // Clear search
        notesSearch.value = "";

        // Reset dropdowns
        departmentFilter.value = "all";
        semesterFilter.value = "all";

        // Clear all selected subject tags
        selectedSubjects.clear();

        subjectTags.forEach(tag => {

            tag.classList.remove("active");

            tag.setAttribute("aria-pressed", "false");

        });

        // Clear Free / Exchange filter
        selectedType = "";

        updateTypeButtons();

        // Reset sorting
        sortNotes.value = "popular";

        // Collapse extra subject tags
        document.querySelectorAll(".extra-note-tag").forEach(tag => {

            tag.hidden = true;

        });

        notesShowMore.setAttribute("aria-expanded", "false");

        notesShowMore.innerHTML =
            '<i class="fa-solid fa-plus"></i> Show more';

        // Sort and display ALL notes
        sortNotesCards();

        filterNotes();

    });


    // =====================================
    // 10. HEADER SEARCH INTEGRATION
    // =====================================

    const searchForm = document.getElementById("searchForm");
    const siteSearch = document.getElementById("siteSearch");

    if (searchForm && siteSearch) {

        searchForm.addEventListener("submit", event => {

            event.preventDefault();

            notesSearch.value = siteSearch.value;

            filterNotes();

            notesGrid.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        });

    }


    // =====================================
    // 11. INITIALIZE
    // =====================================

    updateTypeButtons();

    sortNotesCards();

    filterNotes();

});

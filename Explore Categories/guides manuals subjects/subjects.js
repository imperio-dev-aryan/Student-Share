
document.addEventListener("DOMContentLoaded", () => {

    // ========================================
    // ELEMENTS
    // ========================================

    const searchInput = document.getElementById("subjectSearch");
    const departmentFilter = document.getElementById("subjectDepartment");
    const semesterFilter = document.getElementById("subjectSemester");
    const typeButtons = document.querySelectorAll(".guide-type-btn");
    const resetButton = document.getElementById("reset");

    const subjectsGrid = document.getElementById("subjectsGrid");
    const subjectCards = Array.from(
        subjectsGrid.querySelectorAll(".guide-card")
    );

    const subjectsCount = document.getElementById("subjectsCount");
    const subjectsSort = document.getElementById("subjectsSort");
    const subjectsEmpty = document.getElementById("subjectsEmpty");

    // ========================================
    // INITIAL FILTER STATE
    // ========================================

    const initialType = document.querySelector(
        '.guide-type-btn[aria-pressed="true"]'
    )?.dataset.type || "";

    let selectedType = null;

    // ========================================
    // TYPE FILTER: CORE / ELECTIVE
    // ========================================

    function updateTypeButtons() {

        typeButtons.forEach(button => {

            const isActive = button.dataset.type === selectedType;

            button.setAttribute("aria-pressed", isActive);

        });

    }

    typeButtons.forEach(button => {

        button.addEventListener("click", () => {

            const clickedType = button.dataset.type;

            // Clicking the active type clears the filter
            selectedType =
                selectedType === clickedType ? "" : clickedType;

            updateTypeButtons();
            filterSubjects();

        });

    });

    // ========================================
    // FILTER SUBJECTS
    // ========================================

    function filterSubjects() {

        const searchValue = searchInput.value
            .trim()
            .toLowerCase();

        const selectedDepartment = departmentFilter.value;
        const selectedSemester = semesterFilter.value;

        let visibleCount = 0;

        subjectCards.forEach(card => {

            const title = card.dataset.title.toLowerCase();
            const department = card.dataset.department;
            const semester = card.dataset.semester;
            const type = card.dataset.type;

            const matchesSearch =
                title.includes(searchValue);

            const matchesDepartment =
                selectedDepartment === "all" ||
                department === selectedDepartment;

            const matchesSemester =
                selectedSemester === "all" ||
                semester === selectedSemester;

            const matchesType =
                selectedType === null ||
                type === selectedType;

            const isVisible =
                matchesSearch &&
                matchesDepartment &&
                matchesSemester &&
                matchesType;

            card.hidden = !isVisible;

            if (isVisible) {
                visibleCount++;
            }

        });

        // Update result count
        subjectsCount.textContent = visibleCount;

        // Show or hide empty state
        subjectsEmpty.hidden = visibleCount !== 0;

    }

    // ========================================
    // SORT SUBJECTS
    // ========================================

    function sortSubjects() {

        const sortValue = subjectsSort.value;

        const sortedCards = [...subjectCards];

        if (sortValue === "popular") {

            sortedCards.sort((a, b) => {
                return Number(b.dataset.resources) -
                       Number(a.dataset.resources);
            });

        }

        else if (sortValue === "name") {

            sortedCards.sort((a, b) => {
                return a.dataset.title.localeCompare(
                    b.dataset.title
                );
            });

        }

        else if (sortValue === "semester") {

            sortedCards.sort((a, b) => {

                const semesterDifference =
                    Number(a.dataset.semester) -
                    Number(b.dataset.semester);

                // Use name as a secondary sorting rule
                if (semesterDifference === 0) {
                    return a.dataset.title.localeCompare(
                        b.dataset.title
                    );
                }

                return semesterDifference;

            });

        }

        // Reorder cards in the DOM
        sortedCards.forEach(card => {
            subjectsGrid.appendChild(card);
        });

    }

    // ========================================
    // EVENT LISTENERS
    // ========================================

    searchInput.addEventListener("input", filterSubjects);

    departmentFilter.addEventListener("change", filterSubjects);

    semesterFilter.addEventListener("change", filterSubjects);

    subjectsSort.addEventListener("change", () => {
        sortSubjects();
        filterSubjects();
    });

    // ========================================
    // RESET FILTERS
    // ========================================

    resetButton.addEventListener("click", () => {

        searchInput.value = "";
        departmentFilter.value = "all";
        semesterFilter.value = "all";

        selectedType = initialType;

        subjectsSort.value = "popular";

        updateTypeButtons();
        sortSubjects();
        filterSubjects();

    });

    // ========================================
    // HEADER SEARCH INTEGRATION
    // ========================================

    const searchForm = document.getElementById("searchForm");
    const siteSearch = document.getElementById("siteSearch");

    if (searchForm && siteSearch) {

        searchForm.addEventListener("submit", event => {

            event.preventDefault();

            searchInput.value = siteSearch.value;

            filterSubjects();

            subjectsGrid.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        });

    }

    // ========================================
    // INITIALIZE
    // ========================================

    updateTypeButtons();
    sortSubjects();
    filterSubjects();

});

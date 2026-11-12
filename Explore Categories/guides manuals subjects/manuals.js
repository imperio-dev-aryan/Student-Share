
document.addEventListener("DOMContentLoaded", () => {

    // =====================================
    // 1. SELECT HTML ELEMENTS
    // =====================================

    const manualSearch = document.getElementById("manualSearch");
    const departmentFilter = document.getElementById("manualDepartment");
    const semesterFilter = document.getElementById("manualSemester");

    const subjectTags = document.querySelectorAll(
        "#manualSubjectTags .guide-subject-tag"
    );

    const clearSubjects = document.getElementById("clearManualSubjects");

    const typeButtons = document.querySelectorAll(".guide-type-btn");

    const resetButton = document.getElementById("reset");

    const manualsSort = document.getElementById("manualsSort");
    const manualsGrid = document.getElementById("manualsGrid");
    const manualsCount = document.getElementById("manualsCount");
    const manualsEmpty = document.getElementById("manualsEmpty");

    const manualCards = Array.from(
        manualsGrid.querySelectorAll(".guide-card")
    );


    // =====================================
    // 2. INITIAL FILTER STATE
    // =====================================

    let selectedType = null;

    // =====================================
    // 3. SUBJECT FILTER
    // =====================================

    subjectTags.forEach((tag) => {

        tag.addEventListener("click", () => {

            const isActive =
                tag.getAttribute("aria-pressed") === "true";

            tag.setAttribute(
                "aria-pressed",
                String(!isActive)
            );

            tag.classList.toggle("active", !isActive);

            filterManuals();

        });

    });


    // Clear all selected subjects
    clearSubjects.addEventListener("click", () => {

        subjectTags.forEach((tag) => {

            tag.classList.remove("active");

            tag.setAttribute("aria-pressed", "false");

        });

        filterManuals();

    });


    // =====================================
    // 4. TYPE FILTER
    // =====================================

    function updateTypeButtons() {

        typeButtons.forEach((button) => {

            const isActive =
                button.dataset.type === selectedType;

            button.classList.toggle("active", isActive);

            button.setAttribute(
                "aria-pressed",
                String(isActive)
            );

        });

    }


    typeButtons.forEach((button) => {

        button.addEventListener("click", () => {

            const clickedType = button.dataset.type;

            // Clicking the active type clears the filter.
            selectedType =
                selectedType === clickedType ? null : clickedType;

            updateTypeButtons();

            filterManuals();

        });

    });


    // =====================================
    // 5. SEARCH AND DROPDOWN FILTERS
    // =====================================

    manualSearch.addEventListener("input", filterManuals);

    departmentFilter.addEventListener("change", filterManuals);

    semesterFilter.addEventListener("change", filterManuals);


    // =====================================
    // 6. MAIN FILTER FUNCTION
    // =====================================

    function filterManuals() {

        const searchValue =
            manualSearch.value.trim().toLowerCase();

        const selectedDepartment = departmentFilter.value;

        const selectedSemester = semesterFilter.value;

        // Get all selected subjects.
        const selectedSubjects = Array.from(subjectTags)
            .filter(tag => tag.getAttribute("aria-pressed") === "true")
            .map(tag => tag.dataset.subject.toLowerCase());

        let visibleCount = 0;


        manualCards.forEach((card) => {

            const title =
                (card.dataset.title || "").toLowerCase();

            const subject =
                (card.dataset.subject || "").toLowerCase();

            const department =
                card.dataset.department;

            const semester =
                card.dataset.semester;

            const type =
                card.dataset.type;


            // Search filter
            const matchesSearch =
                searchValue === "" ||
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


            // Subject filter
            const matchesSubject =
                selectedSubjects.length === 0 ||
                selectedSubjects.some(
                    selectedSubject => subject === selectedSubject
                );


            // Free / Exchange filter
            const matchesType =
                selectedType === null ||
                type === selectedType;


            // Combine all filters
            const shouldDisplay =
                matchesSearch &&
                matchesDepartment &&
                matchesSemester &&
                matchesSubject &&
                matchesType;


            // Show or hide card
            card.hidden = !shouldDisplay;

            if (shouldDisplay) {
                visibleCount++;
            }

        });


        // Update result count
        manualsCount.textContent = visibleCount;


        // Show empty state if no manuals match
        manualsEmpty.hidden = visibleCount !== 0;

    }


    // =====================================
    // 7. SORTING
    // =====================================

    function sortManuals() {

        const sortValue = manualsSort.value;

        const sortedCards = [...manualCards];


        sortedCards.sort((a, b) => {

            switch (sortValue) {

                case "popular":
                    return Number(b.dataset.popularity) -
                           Number(a.dataset.popularity);


                case "rating":
                    return Number(b.dataset.rating) -
                           Number(a.dataset.rating);


                case "newest":
                    return new Date(b.dataset.date) -
                           new Date(a.dataset.date);


                case "title":
                    return a.dataset.title.localeCompare(
                        b.dataset.title
                    );


                default:
                    return 0;

            }

        });


        // Reinsert cards in sorted order
        sortedCards.forEach((card) => {
            manualsGrid.appendChild(card);
        });

    }


    manualsSort.addEventListener("change", () => {

        sortManuals();

        filterManuals();

    });


    // =====================================
    // 8. BOOKMARK FUNCTIONALITY
    // =====================================

    document.querySelectorAll(
        "#manualsGrid .guide-bookmark"
    ).forEach((button) => {

        button.addEventListener("click", () => {

            const isBookmarked =
                button.getAttribute("aria-pressed") === "true";

            const newState = !isBookmarked;

            button.setAttribute(
                "aria-pressed",
                String(newState)
            );

            const icon = button.querySelector("i");

            if (newState) {

                icon.classList.remove("fa-regular");
                icon.classList.add("fa-solid");

            } else {

                icon.classList.remove("fa-solid");
                icon.classList.add("fa-regular");

            }

        });

    });


    // =====================================
    // 9. RESET ALL FILTERS
    // =====================================

    resetButton.addEventListener("click", () => {

        // Clear search
        manualSearch.value = "";


        // Reset dropdowns
        departmentFilter.value = "all";

        semesterFilter.value = "all";


        // Clear selected subjects
        subjectTags.forEach((tag) => {

            tag.classList.remove("active");

            tag.setAttribute("aria-pressed", "false");

        });


        // Restore initial Free filter
        selectedType = "free";

        updateTypeButtons();


        // Reset sorting
        manualsSort.value = "popular";

        sortManuals();

        filterManuals();

    });


    // =====================================
    // 10. HEADER SEARCH INTEGRATION
    // =====================================

    const headerSearch = document.getElementById("siteSearch");
    const headerForm = document.getElementById("searchForm");

    if (headerForm && headerSearch) {

        headerForm.addEventListener("submit", (event) => {

            event.preventDefault();

            manualSearch.value = headerSearch.value.trim();

            filterManuals();

            manualsGrid.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        });

    }


    // =====================================
    // 11. INITIAL PAGE LOAD
    // =====================================

    updateTypeButtons();

    sortManuals();

    filterManuals();

});

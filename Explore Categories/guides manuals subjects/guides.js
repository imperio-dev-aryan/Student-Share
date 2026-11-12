
document.addEventListener("DOMContentLoaded", () => {

    // =====================================
    // 1. SELECT HTML ELEMENTS
    // =====================================

    const guideSearch = document.getElementById("guideSearch");
    const departmentFilter = document.getElementById("guideDepartment");
    const semesterFilter = document.getElementById("notesSemester");

    const subjectTags = document.querySelectorAll(
        "#guideSubjectTags .guide-subject-tag"
    );

    const clearSubjects = document.getElementById("clearGuideSubjects");

    const typeButtons = document.querySelectorAll(".guide-type-btn");

    const resetButton = document.getElementById("reset");

    const guidesSort = document.getElementById("guidesSort");
    const guidesGrid = document.getElementById("guidesGrid");
    const guidesCount = document.getElementById("guidesCount");
    const guidesEmpty = document.getElementById("guidesEmpty");

    const guideCards = Array.from(
        guidesGrid.querySelectorAll(".guide-card")
    );


    // =====================================
    // 2. INITIAL FILTER STATE
    // =====================================

    // Read the initially selected type from HTML.
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

            filterGuides();

        });

    });


    // Clear all selected subjects
    clearSubjects.addEventListener("click", () => {

        subjectTags.forEach((tag) => {

            tag.classList.remove("active");
            tag.setAttribute("aria-pressed", "false");

        });

        filterGuides();

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

            // Clicking an active type clears the filter.
            selectedType =
                selectedType === clickedType ? null : clickedType;

            updateTypeButtons();

            filterGuides();

        });

    });


    // =====================================
    // 5. SEARCH AND DROPDOWN FILTERS
    // =====================================

    guideSearch.addEventListener("input", filterGuides);

    departmentFilter.addEventListener("change", filterGuides);

    semesterFilter.addEventListener("change", filterGuides);


    // =====================================
    // 6. MAIN FILTER FUNCTION
    // =====================================

    function filterGuides() {

        const searchValue =
            guideSearch.value.trim().toLowerCase();

        const selectedDepartment = departmentFilter.value;

        const selectedSemester = semesterFilter.value;

        // Get all currently selected subjects.
        const selectedSubjects = Array.from(subjectTags)
            .filter(tag => tag.getAttribute("aria-pressed") === "true")
            .map(tag => tag.dataset.subject.toLowerCase());

        let visibleCount = 0;


        guideCards.forEach((card) => {

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
        guidesCount.textContent = visibleCount;


        // Show empty state when no cards match
        guidesEmpty.hidden = visibleCount !== 0;

    }


    // =====================================
    // 7. SORTING
    // =====================================

    function sortGuides() {

        const sortValue = guidesSort.value;

        const sortedCards = [...guideCards];


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
            guidesGrid.appendChild(card);
        });

    }


    guidesSort.addEventListener("change", () => {

        sortGuides();

        filterGuides();

    });


    // =====================================
    // 8. BOOKMARK FUNCTIONALITY
    // =====================================

    document.querySelectorAll(
        "#guidesGrid .guide-bookmark"
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
    guideSearch.value = "";

    // Reset dropdowns
    departmentFilter.value = "all";
    semesterFilter.value = "all";

    // Clear all selected subject tags
    subjectTags.forEach(tag => {
        tag.classList.remove("active");
        tag.setAttribute("aria-pressed", "false");
    });

    // Remove Free / Exchange filter
    selectedType = "";

    updateTypeButtons();

    // Reset sorting
    guidesSort.value = "popular";

    // Sort and display all cards
    sortGuides();

    subjectTags.forEach(tag => {
        tag.classList.remove("active");
    });

    filterGuides();

});

    // =====================================
    // 10. INITIAL PAGE LOAD
    // =====================================

    updateTypeButtons();

    sortGuides();

    filterGuides();

});

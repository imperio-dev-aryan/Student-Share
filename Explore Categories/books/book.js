
document.addEventListener("DOMContentLoaded", () => {

    // ========================================
    // DOM ELEMENTS
    // ========================================

    const bookSearch = document.getElementById("bookSearch");
    const departmentFilter = document.getElementById("departmentFilter");
    const semesterFilter = document.getElementById("semesterFilter");

    const subjectTags = document.querySelectorAll(".subject-tag");
    const typeButtons = document.querySelectorAll(".type-btn");

    const showMoreTags = document.getElementById("showMoreTags");
    const resetButton = document.getElementById("reset");

    const booksGrid = document.getElementById("booksGrid");
    const booksCount = document.getElementById("booksCount");
    const booksSort = document.getElementById("booksSort");
    const noBooksFound = document.getElementById("noBooksFound");

    const siteSearch = document.getElementById("siteSearch");
    const searchForm = document.getElementById("searchForm");

    const booksResults = document.getElementById("booksResults");

    const bookCards = Array.from(
        document.querySelectorAll("#booksGrid .book-card")
    );


    // ========================================
    // FILTER STATE
    // ========================================

    // No resource type selected initially
    let selectedType = null;


    // ========================================
    // SUBJECT TAG FILTER
    // ========================================

    subjectTags.forEach((tag) => {

        tag.addEventListener("click", () => {

            tag.classList.toggle("active");

            const isActive = tag.classList.contains("active");

            tag.setAttribute("aria-pressed", String(isActive));

            filterBooks();

        });

    });


    // ========================================
    // SHOW MORE SUBJECT TAGS
    // ========================================

    showMoreTags.addEventListener("click", () => {

        const isExpanded =
            showMoreTags.getAttribute("aria-expanded") === "true";

        const extraTags = document.querySelectorAll(".extra-tag");

        extraTags.forEach((tag) => {
            tag.hidden = isExpanded;
        });

        showMoreTags.setAttribute(
            "aria-expanded",
            String(!isExpanded)
        );

        showMoreTags.innerHTML = isExpanded
            ? '<i class="fa-solid fa-plus"></i> Show more'
            : '<i class="fa-solid fa-minus"></i> Show less';

    });


    // ========================================
    // RESOURCE TYPE FILTER
    // ========================================

    typeButtons.forEach((button) => {

        button.addEventListener("click", () => {

            const clickedType = button.dataset.type;

            // Clicking an already selected type deselects it
            selectedType =
                selectedType === clickedType ? null : clickedType;

            // Update button appearance
            typeButtons.forEach((btn) => {

                const isActive = btn.dataset.type === selectedType;

                btn.classList.toggle("active", isActive);

                btn.setAttribute(
                    "aria-pressed",
                    String(isActive)
                );

            });

            filterBooks();

        });

    });


    // ========================================
    // SEARCH FILTER
    // ========================================

    bookSearch.addEventListener("input", filterBooks);


    // ========================================
    // DEPARTMENT FILTER
    // ========================================

    departmentFilter.addEventListener("change", filterBooks);


    // ========================================
    // SEMESTER FILTER
    // ========================================

    semesterFilter.addEventListener("change", filterBooks);


    // ========================================
    // MAIN FILTER FUNCTION
    // ========================================

    function filterBooks() {

        const searchValue = bookSearch.value.trim().toLowerCase();

        const selectedDepartment = departmentFilter.value;
        const selectedSemester = semesterFilter.value;

        // Get all currently selected subjects
        const selectedSubjects = Array.from(
            document.querySelectorAll(".subject-tag.active")
        ).map((tag) => tag.dataset.subject.toLowerCase());


        let visibleCount = 0;


        bookCards.forEach((card) => {

            const title = (card.dataset.title || "").toLowerCase();
            const author = (card.dataset.author || "").toLowerCase();
            const subjects = (card.dataset.subject || "").toLowerCase();

            const department = card.dataset.department;
            const semester = card.dataset.semester;
            const type = card.dataset.type;


            // Search condition
            const matchesSearch =
                searchValue === "" ||
                title.includes(searchValue) ||
                author.includes(searchValue) ||
                subjects.includes(searchValue);


            // Department condition
            const matchesDepartment =
                selectedDepartment === "all" ||
                department === selectedDepartment;


            // Subject condition
            // A book matches if it contains ANY selected subject
            const matchesSubject =
                selectedSubjects.length === 0 ||
                selectedSubjects.some((subject) =>
                    subjects.includes(subject)
                );


            // Semester condition
            const matchesSemester =
                selectedSemester === "all" ||
                semester === selectedSemester;


            // Resource type condition
            // If nothing is selected, show both Free and Exchange
            const matchesType =
                selectedType === null ||
                type === selectedType;


            // Combine all filter conditions
            const shouldDisplay =
                matchesSearch &&
                matchesDepartment &&
                matchesSubject &&
                matchesSemester &&
                matchesType;


            // Display or hide book
            card.hidden = !shouldDisplay;

            if (shouldDisplay) {
                visibleCount++;
            }

        });


        // Update available book count
        booksCount.textContent = visibleCount;


        // Show no-results message when no books match
        noBooksFound.hidden = visibleCount !== 0;

    }


    // ========================================
    // SORTING FUNCTION
    // ========================================

    booksSort.addEventListener("change", sortBooks);


    function sortBooks() {

        const sortValue = booksSort.value;

        const sortedCards = [...bookCards];

        sortedCards.sort((a, b) => {

            switch (sortValue) {

                case "popular":

                    return (
                        Number(b.dataset.popularity) -
                        Number(a.dataset.popularity)
                    );


                case "newest":

                    return (
                        new Date(b.dataset.date) -
                        new Date(a.dataset.date)
                    );


                case "rating":

                    return (
                        Number(b.dataset.rating) -
                        Number(a.dataset.rating)
                    );


                case "title":

                    return a.dataset.title.localeCompare(
                        b.dataset.title
                    );


                default:

                    return 0;

            }

        });


        // Reorder cards inside the grid
        sortedCards.forEach((card) => {
            booksGrid.appendChild(card);
        });

    }


    // ========================================
    // RESET FILTERS
    // ========================================

    resetButton.addEventListener("click", resetFilters);


    function resetFilters() {

        // Clear search
        bookSearch.value = "";


        // Reset department
        departmentFilter.value = "all";


        // Reset semester
        semesterFilter.value = "all";


        // Deselect every subject
        subjectTags.forEach((tag) => {

            tag.classList.remove("active");

            tag.setAttribute("aria-pressed", "false");

        });


        // Deselect every resource type
        selectedType = null;

        typeButtons.forEach((button) => {

            button.classList.remove("active");

            button.setAttribute("aria-pressed", "false");

        });


        // Collapse additional subject tags
        document.querySelectorAll(".extra-tag").forEach((tag) => {

            tag.hidden = true;

        });

        showMoreTags.setAttribute("aria-expanded", "false");

        showMoreTags.innerHTML =
            '<i class="fa-solid fa-plus"></i> Show more';


        // Reset sorting
        booksSort.value = "popular";

        sortBooks();


        // Apply cleared filters
        filterBooks();

    }


    // ========================================
    // HEADER SEARCH INTEGRATION
    // ========================================

    if (searchForm && siteSearch) {

        searchForm.addEventListener("submit", (event) => {

            event.preventDefault();

            bookSearch.value = siteSearch.value.trim();

            filterBooks();

            booksResults?.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        });

    }


    // ========================================
    // INITIAL PAGE LOAD
    // ========================================

    // Remove any accidental HTML default selections
    subjectTags.forEach((tag) => {

        tag.classList.remove("active");

        tag.setAttribute("aria-pressed", "false");

    });

    typeButtons.forEach((button) => {

        button.classList.remove("active");

        button.setAttribute("aria-pressed", "false");

    });


    // Ensure additional tags start hidden
    document.querySelectorAll(".extra-tag").forEach((tag) => {
        tag.hidden = true;
    });

    showMoreTags.setAttribute("aria-expanded", "false");

    showMoreTags.innerHTML =
        '<i class="fa-solid fa-plus"></i> Show more';


    // Initial sorting and filtering
    booksSort.value = "popular";

    sortBooks();
    filterBooks();

});

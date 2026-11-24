
// ============================================
// IPL WEBSITE - JAVASCRIPT
// Activities 5, 7 and 8
// ============================================

document.addEventListener("DOMContentLoaded", function () {

    // =====================================
    // 1. REUSABLE TOAST NOTIFICATION
    // =====================================

    window.showToast = function (message) {

        let oldToast = document.getElementById("toast-message");

        if (oldToast) {
            oldToast.remove();
        }

        let toast = document.createElement("div");

        toast.id = "toast-message";
        toast.innerText = message;

        toast.style.position = "fixed";
        toast.style.bottom = "20px";
        toast.style.right = "20px";
        toast.style.backgroundColor = "#222";
        toast.style.color = "white";
        toast.style.padding = "15px 25px";
        toast.style.borderRadius = "8px";
        toast.style.zIndex = "2000";

        document.body.appendChild(toast);

        setTimeout(function () {
            toast.remove();
        }, 3000);

    };


    // =====================================
    // 2. ACTIVITY 8 - HAMBURGER MENU
    // =====================================

    let menuToggle = document.getElementById("menuToggle");

    let mainNav = document.getElementById("mainNav");

    if (menuToggle && mainNav) {

        menuToggle.addEventListener("click", function () {

            mainNav.classList.toggle("active");

            let isOpen = mainNav.classList.contains("active");

            menuToggle.innerText = isOpen ? "✕" : "☰";

            menuToggle.setAttribute("aria-expanded", isOpen);

        });


        // Close menu after clicking a navigation link

        let navLinks = mainNav.querySelectorAll("a");

        navLinks.forEach(function (link) {

            link.addEventListener("click", function () {

                mainNav.classList.remove("active");

                menuToggle.innerText = "☰";

                menuToggle.setAttribute("aria-expanded", "false");

            });

        });

    }


    // =====================================
    // 3. ACTIVITY 8 - FILTER MATCHES BY TEAM
    // =====================================

    let teamFilter = document.getElementById("teamFilter");

    let matchCards = document.querySelectorAll(".match-card");

    if (teamFilter) {

        teamFilter.addEventListener("change", function () {

            let selectedTeam = teamFilter.value;

            matchCards.forEach(function (card) {

                let teams = card.dataset.teams.split(" ");

                if (selectedTeam === "all" || teams.includes(selectedTeam)) {

                    card.style.display = "";

                } else {

                    card.style.display = "none";

                }

            });

            showToast("Match filter updated!");

        });

    }


    // =====================================
    // 4. ACTIVITY 8 - GRID AND LIST VIEW
    // =====================================

    let matchContainer = document.getElementById("matchContainer");

    let gridViewBtn = document.getElementById("gridViewBtn");

    let listViewBtn = document.getElementById("listViewBtn");


    // GRID VIEW

    if (gridViewBtn && matchContainer) {

        gridViewBtn.addEventListener("click", function () {

            matchContainer.classList.remove("list-view");

            matchContainer.classList.add("match-grid");

            gridViewBtn.classList.add("active");

            listViewBtn.classList.remove("active");

            showToast("Grid View Enabled!");

        });

    }


    // LIST VIEW

    if (listViewBtn && matchContainer) {

        listViewBtn.addEventListener("click", function () {

            matchContainer.classList.remove("match-grid");

            matchContainer.classList.add("list-view");

            listViewBtn.classList.add("active");

            gridViewBtn.classList.remove("active");

            showToast("List View Enabled!");

        });

    }


    // =====================================
    // 5. ACTIVITY 7 - BOOKING SUMMARY
    // =====================================

    let matchSelect = document.getElementById("match");

    let categorySelect = document.getElementById("category");

    let ticketQuantity = document.getElementById("tickets");


    let summaryMatch = document.getElementById("summary-match");

    let summaryCategory = document.getElementById("summary-category");

    let summaryPrice = document.getElementById("summary-price");

    let summaryQuantity = document.getElementById("summary-quantity");

    let summaryTotal = document.getElementById("summary-total");


    if (
        matchSelect &&
        categorySelect &&
        ticketQuantity &&
        summaryMatch &&
        summaryCategory &&
        summaryPrice &&
        summaryQuantity &&
        summaryTotal
    ) {

        function updateBookingSummary(showNotification = true) {

            let matchOption = matchSelect.options[matchSelect.selectedIndex];

            let matchName = matchSelect.value;

            let category = categorySelect.value;

            let quantity = Number(ticketQuantity.value);

            let priceKey = category.toLowerCase();

            let price = matchOption
                ? Number(matchOption.dataset[priceKey] || 0)
                : 0;


            if (!Number.isInteger(quantity) || quantity < 1 || quantity > 10) {

                summaryTotal.innerText = "0";

                if (showNotification) {
                    showToast("Please select between 1 and 10 tickets!");
                }

                return;

            }


            let totalPrice = price * quantity;


            summaryMatch.innerText = matchName || "Not Selected";

            summaryCategory.innerText = category || "Not Selected";

            summaryPrice.innerText = price.toLocaleString("en-IN");

            summaryQuantity.innerText = quantity;

            summaryTotal.innerText = totalPrice.toLocaleString("en-IN");


            if (showNotification) {
                showToast("Booking Summary Updated!");
            }

        }


        // Get match selected from main page

        let params = new URLSearchParams(window.location.search);

        let matchFromSchedule = params.get("match");


        if (matchFromSchedule) {

            let matchingOption = Array.from(matchSelect.options).find(
                option => option.value === matchFromSchedule
            );

            if (matchingOption) {
                matchSelect.value = matchFromSchedule;
            }

        }


        // Display initial summary

        updateBookingSummary(false);


        // Add event listeners

        matchSelect.addEventListener("change", function () {
            updateBookingSummary();
        });

        categorySelect.addEventListener("change", function () {
            updateBookingSummary();
        });

        ticketQuantity.addEventListener("input", function () {
            updateBookingSummary();
        });


        // Reset summary

        let bookingForm = document.getElementById("booking-form");

        if (bookingForm) {

            bookingForm.addEventListener("reset", function () {

                setTimeout(function () {
                    updateBookingSummary(false);
                }, 0);

            });

        }


        // Smooth scrolling when opening booking page

        if (window.location.hash === "#booking-form") {

            setTimeout(function () {

                bookingForm.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

                showToast("Complete your IPL booking!");

            }, 200);

        }

    }

});

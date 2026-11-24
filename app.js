// =====================================
// 1. REUSABLE TOAST NOTIFICATION
// =====================================

function showToast(message) {
    // Remove an older toast if one is still visible.
    const oldToast = document.getElementById("toast-message");
    if (oldToast) {
        oldToast.remove();
    }

    const toast = document.createElement("div");
    toast.id = "toast-message";
    toast.innerText = message;

    toast.style.position = "fixed";
    toast.style.bottom = "20px";
    toast.style.right = "20px";
    toast.style.backgroundColor = "#222";
    toast.style.color = "white";
    toast.style.padding = "15px 25px";
    toast.style.borderRadius = "8px";
    toast.style.zIndex = "1000";
    toast.style.fontSize = "16px";

    document.body.appendChild(toast);

    setTimeout(function () {
        toast.remove();
    }, 3000);
}


// =====================================
// 2. BOOK BUTTON AND SMOOTH SCROLLING
// =====================================

document.addEventListener("DOMContentLoaded", function () {

    // On the main page, pass the selected match to booking.html.
    const bookButtons = document.querySelectorAll(".book-btn");

    bookButtons.forEach(function (button) {
        button.addEventListener("click", function (event) {
            const selectedMatch = button.dataset.match;

            // Schedule table buttons have data-match.
            // Navigate to booking.html instead of scrolling to the form on index.html.
            if (selectedMatch) {
                event.preventDefault();

                const bookingUrl =
                    "booking.html?match=" +
                    encodeURIComponent(selectedMatch) +
                    "#booking-form";

                window.location.href = bookingUrl;
            }
        });
    });


    // =====================================
    // 3. ACTIVITY 7: LIVE BOOKING SUMMARY
    // =====================================

    const matchSelect = document.getElementById("match");
    const categorySelect = document.getElementById("category");
    const ticketQuantity = document.getElementById("tickets");

    const summaryMatch = document.getElementById("summary-match");
    const summaryCategory = document.getElementById("summary-category");
    const summaryPrice = document.getElementById("summary-price");
    const summaryQuantity = document.getElementById("summary-quantity");
    const summaryTotal = document.getElementById("summary-total");

    // These controls exist only on booking.html.
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
            const matchOption = matchSelect.options[matchSelect.selectedIndex];
            const matchName = matchSelect.value;
            const category = categorySelect.value;
            const quantity = Number(ticketQuantity.value);

            const priceKey = category ? category.toLowerCase() : "";
            const price = matchOption && priceKey
                ? Number(matchOption.dataset[priceKey] || 0)
                : 0;

            // Keep the summary safe and accurate for empty/invalid inputs.
            if (!Number.isInteger(quantity) || quantity < 1 || quantity > 10) {
                summaryQuantity.innerText = ticketQuantity.value || "0";
                summaryTotal.innerText = "0";
                summaryPrice.innerText = price.toLocaleString("en-IN");
                if (showNotification) {
                    showToast("Please select between 1 and 10 tickets.");
                }
                return;
            }

            const total = price * quantity;

            summaryMatch.innerText = matchName || "Not Selected";
            summaryCategory.innerText = category || "Not Selected";
            summaryPrice.innerText = price.toLocaleString("en-IN");
            summaryQuantity.innerText = quantity;
            summaryTotal.innerText = total.toLocaleString("en-IN");

            if (showNotification) {
                showToast("Booking Summary Updated!");
            }
        }

        // If the user clicked Book beside a match, select that match here.
        const params = new URLSearchParams(window.location.search);
        const matchFromSchedule = params.get("match");

        if (matchFromSchedule) {
            const matchingOption = Array.from(matchSelect.options).find(
                option => option.value === matchFromSchedule
            );

            if (matchingOption) {
                matchSelect.value = matchFromSchedule;
            }
        }

        // Display initial values without showing a toast on page load.
        updateBookingSummary(false);

        // Update live whenever the user changes a selector or quantity.
        matchSelect.addEventListener("change", function () {
            updateBookingSummary(true);
        });

        categorySelect.addEventListener("change", function () {
            updateBookingSummary(true);
        });

        ticketQuantity.addEventListener("input", function () {
            updateBookingSummary(true);
        });

        // Smoothly scroll to the form when arriving from the schedule.
        if (window.location.hash === "#booking-form") {
            setTimeout(function () {
                document.getElementById("booking-form").scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
                showToast("Match selected. Complete your booking!");
            }, 200);
        }

        // Keep the summary in sync after the user resets the form.
        document.getElementById("booking-form").addEventListener("reset", function () {
            setTimeout(function () {
                updateBookingSummary(false);
            }, 0);
        });
    }
});

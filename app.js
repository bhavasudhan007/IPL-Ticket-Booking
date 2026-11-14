
// =====================================
// 1. REUSABLE TOAST NOTIFICATION FUNCTION
// =====================================

function showToast(message) {

    // Create a toast element
    let toast = document.createElement("div");

    toast.innerText = message;

    // Add styling to the toast
    toast.style.position = "fixed";
    toast.style.bottom = "20px";
    toast.style.right = "20px";
    toast.style.backgroundColor = "#222";
    toast.style.color = "white";
    toast.style.padding = "15px 25px";
    toast.style.borderRadius = "8px";
    toast.style.zIndex = "1000";
    toast.style.fontSize = "16px";

    // Add toast to the webpage
    document.body.appendChild(toast);

    // Remove toast after 3 seconds
    setTimeout(function () {
        toast.remove();
    }, 3000);
}


// =====================================
// 2. SMOOTH SCROLLING FUNCTION
// =====================================

function scrollToBooking() {

    let bookingForm = document.getElementById("booking-form");

    if (bookingForm) {

        bookingForm.scrollIntoView({
            behavior: "smooth"
        });

        showToast("Redirecting to ticket booking!");

    }
}


// =====================================
// 3. BOOK BUTTON EVENT HANDLING
// =====================================

document.addEventListener("DOMContentLoaded", function () {

    // Find all Book buttons
    let bookButtons = document.querySelectorAll(".book-btn");

    bookButtons.forEach(function (button) {

        button.addEventListener("click", function (event) {

            let target = button.getAttribute("href");

            // Same-page booking form
            if (target === "#booking-form") {

                event.preventDefault();
                scrollToBooking();

            }

        });

    });

    // Handle booking form links from another page
    if (window.location.hash === "#booking-form") {

        let bookingForm = document.getElementById("booking-form");

        if (bookingForm) {

            setTimeout(function () {
                bookingForm.scrollIntoView({
                    behavior: "smooth"
                });

                showToast("Welcome to IPL Ticket Booking!");

            }, 300);

        }

    }

});

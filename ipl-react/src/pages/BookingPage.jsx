
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function BookingPage({ onBook }) {
    const location = useLocation();
    const navigate = useNavigate();

    const match = location.state?.match;

    const [userName, setUserName] = useState("");
    const [tickets, setTickets] = useState(1);
    const [booking, setBooking] = useState(false);

    if (!match) {
        return (
            <div className="booking-page">
                <h2>No match selected</h2>
                <button onClick={() => navigate("/")}>
                    Back to Matches
                </button>
            </div>
        );
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setBooking(true);

        const result = await onBook(
            match,
            userName,
            Number(tickets)
        );

        setBooking(false);

        if (result) {
            navigate("/confirmation", {
                state: {
                    match,
                    userName,
                    tickets: Number(tickets),
                    totalPrice: match.price * Number(tickets)
                }
            });
        }
    }

    return (
        <div className="booking-page">
            <h1>Book Your IPL Tickets</h1>

            <div className="booking-card">
                <h2>{match.team1} vs {match.team2}</h2>

                <p><strong>Date:</strong> {match.date}</p>
                <p><strong>Venue:</strong> {match.venue}</p>
                <p><strong>Ticket Price:</strong> ₹{match.price}</p>
                <p><strong>Available Seats:</strong> {match.available_seats}</p>

                <hr />

                <form onSubmit={handleSubmit}>
                    <label>Your Name</label>
                    <input
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="Enter your name"
                        required
                    />

                    <label>Number of Tickets</label>
                    <input
                        type="number"
                        min="1"
                        max={match.available_seats}
                        value={tickets}
                        onChange={(e) => setTickets(e.target.value)}
                        required
                    />

                    <h3>
                        Total Price: ₹{match.price * Number(tickets)}
                    </h3>

                    <button type="submit" disabled={booking}>
                        {booking ? "Processing..." : "Confirm Booking"}
                    </button>
                </form>

                <button
                    className="back-button"
                    onClick={() => navigate("/")}
                >
                    Back to Matches
                </button>
            </div>
        </div>
    );
}

export default BookingPage;

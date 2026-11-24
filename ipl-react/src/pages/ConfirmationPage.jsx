
import { useLocation, useNavigate } from "react-router-dom";

function ConfirmationPage() {
    const location = useLocation();
    const navigate = useNavigate();

    const booking = location.state;

    if (!booking) {
        return (
            <div className="booking-page">
                <h2>No booking details found.</h2>
                <button onClick={() => navigate("/")}>
                    Back to Matches
                </button>
            </div>
        );
    }

    return (
        <div className="booking-page">
            <div className="booking-card">
                <h1>Booking Successful!</h1>
                <h2>Your tickets are booked.</h2>

                <hr />

                <p><strong>Name:</strong> {booking.userName}</p>
                <p>
                    <strong>Match:</strong>{" "}
                    {booking.match.team1} vs {booking.match.team2}
                </p>
                <p><strong>Date:</strong> {booking.match.date}</p>
                <p><strong>Venue:</strong> {booking.match.venue}</p>
                <p><strong>Tickets:</strong> {booking.tickets}</p>
                <h2>Total Paid: ₹{booking.totalPrice}</h2>

                <button onClick={() => navigate("/")}>
                    Back to Matches
                </button>
            </div>
        </div>
    );
}

export default ConfirmationPage;

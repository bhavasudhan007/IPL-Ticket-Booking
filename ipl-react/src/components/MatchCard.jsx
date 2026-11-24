
import { useNavigate } from "react-router-dom";

function MatchCard(props) {
    const navigate = useNavigate();

    function handleBookClick() {
        navigate("/booking", {
            state: {
                match: {
                    id: props.id,
                    team1: props.team1,
                    team2: props.team2,
                    date: props.date,
                    venue: props.venue,
                    price: props.price,
                    available_seats: props.available_seats
                }
            }
        });
    }

    return (
        <div className="match-card">
            <h2>{props.team1} vs {props.team2}</h2>

            <p><strong>Date:</strong> {props.date}</p>
            <p><strong>Venue:</strong> {props.venue}</p>
            <p><strong>Ticket Price:</strong> ₹{props.price}</p>
            <p><strong>Available Seats:</strong> {props.available_seats}</p>

            <button onClick={handleBookClick}>
                Book Tickets
            </button>
        </div>
    );
}

export default MatchCard;

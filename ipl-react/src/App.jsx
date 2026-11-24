
import { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import MatchCard from "./components/MatchCard";

import BookingPage from "./pages/BookingPage";
import ConfirmationPage from "./pages/ConfirmationPage";

import { supabase } from "./supabase";

function Home({ matches, loading, error, selectedTeam, setSelectedTeam }) {
  const filteredMatches = matches.filter((match) => {
    return (
      selectedTeam === "All" ||
      match.team1 === selectedTeam ||
      match.team2 === selectedTeam
    );
  });

  return (
    <>
      <Navbar />
      <Hero />

      <section className="matches-section" id="matches">
        <h1>Upcoming IPL Matches</h1>

        <select
          value={selectedTeam}
          onChange={(e) => setSelectedTeam(e.target.value)}
        >
          <option value="All">All Teams</option>
          <option value="CSK">CSK</option>
          <option value="MI">MI</option>
          <option value="RCB">RCB</option>
          <option value="KKR">KKR</option>
          <option value="GT">GT</option>
          <option value="RR">RR</option>
          <option value="SRH">SRH</option>
          <option value="DC">DC</option>
          <option value="LSG">LSG</option>
          <option value="PBKS">PBKS</option>
        </select>

        <div className="match-container">
          {loading && <p>Loading matches...</p>}

          {error && <p>Error loading matches: {error}</p>}

          {!loading && !error && filteredMatches.map((match) => (
            <MatchCard
              key={match.id}
              {...match}
            />
          ))}

          {!loading && !error && filteredMatches.length === 0 && (
            <p>No matches found.</p>
          )}
        </div>
      </section>

      <section className="about-section" id="about">
        <h2>About IPL 2026</h2>
        <p>
          Experience the excitement of the Indian Premier League.
          Support your favourite team and enjoy live cricket action!
        </p>
      </section>

      <footer>
        <p>© 2026 IPL Ticket Booking. All Rights Reserved.</p>
      </footer>
    </>
  );
}

function App() {
  const [matches, setMatches] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchMatches() {
    const { data, error } = await supabase
      .from("matches")
      .select("*")
      .order("id");

    if (error) {
      console.error(error.message);
      setError(error.message);
    } else {
      setMatches(data);
      setError("");
    }

    setLoading(false);
  }

  useEffect(() => {
    fetchMatches();
  }, []);

  async function handleBooking(match, userName, tickets) {
    if (!userName.trim()) {
      alert("Please enter your name.");
      return false;
    }

    if (!Number.isInteger(tickets) || tickets < 1) {
      alert("Please enter a valid number of tickets.");
      return false;
    }

    if (tickets > match.available_seats) {
      alert("Not enough seats available!");
      return false;
    }

    const totalPrice = match.price * tickets;

    const { data: updatedMatch, error: updateError } = await supabase
      .from("matches")
      .update({
        available_seats: match.available_seats - tickets
      })
      .eq("id", match.id)
      .gte("available_seats", tickets)
      .select()
      .maybeSingle();

    if (updateError) {
      alert("Error updating seats: " + updateError.message);
      return false;
    }

    if (!updatedMatch) {
      alert("Booking failed. Seats may have changed. Please try again.");
      await fetchMatches();
      return false;
    }

    const { error: bookingError } = await supabase
      .from("bookings")
      .insert([
        {
          match_id: match.id,
          user_name: userName.trim(),
          match_title: match.team1 + " vs " + match.team2,
          tickets: tickets,
          total_price: totalPrice
        }
      ]);

    if (bookingError) {
      await supabase
        .from("matches")
        .update({
          available_seats: updatedMatch.available_seats + tickets
        })
        .eq("id", match.id);

      alert("Booking failed: " + bookingError.message);
      await fetchMatches();
      return false;
    }

    await fetchMatches();

    return true;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Home
              matches={matches}
              loading={loading}
              error={error}
              selectedTeam={selectedTeam}
              setSelectedTeam={setSelectedTeam}
            />
          }
        />

        <Route
          path="/booking"
          element={<BookingPage onBook={handleBooking} />}
        />

        <Route
          path="/confirmation"
          element={<ConfirmationPage />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

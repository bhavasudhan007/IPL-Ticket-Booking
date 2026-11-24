import { useState } from "react";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import MatchCard from "./components/MatchCard";

function App() {

  const matches = [
    {
      id: 1,
      team1: "CSK",
      team2: "MI",
      date: "10 April 2026",
      time: "7:30 PM",
      venue: "Chennai",
      price: 800
    },
    {
      id: 2,
      team1: "RCB",
      team2: "KKR",
      date: "12 April 2026",
      time: "7:30 PM",
      venue: "Bengaluru",
      price: 900
    },
    {
      id: 3,
      team1: "MI",
      team2: "KKR",
      date: "15 April 2026",
      time: "3:30 PM",
      venue: "Mumbai",
      price: 700
    },
    {
      id: 4,
      team1: "SRH",
      team2: "CSK",
      date: "18 April 2026",
      time: "7:30 PM",
      venue: "Hyderabad",
      price: 750
    }
  ];

  const [selectedTeam, setSelectedTeam] = useState("All");

  const filteredMatches = matches.filter((match) => {
    return (
      selectedTeam === "All" ||
      match.team1 === selectedTeam ||
      match.team2 === selectedTeam
    );
  });

  return (
    <div>

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
          <option value="SRH">SRH</option>
        </select>

        <div className="match-container">

          {filteredMatches.map((match) => (
            <MatchCard
              key={match.id}
              team1={match.team1}
              team2={match.team2}
              date={match.date}
              time={match.time}
              venue={match.venue}
              price={match.price}
            />
          ))}

        </div>

        {filteredMatches.length === 0 && (
          <p>No matches found.</p>
        )}

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

    </div>
  );
}

export default App;

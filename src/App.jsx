import { useCallback, useEffect, useState } from "react";
import { supabase } from "./lib/supabase.js";

const BOOKING_FIELDS =
  "id, match_id, quantity, stand, created_at, match:matches(id, home_team, away_team, venue, starts_at)";

const STAND_PRICES = {
  general: 750,
  premium: 1800,
  hospitality: 4500,
};

function formatPrice(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatMatchDate(value) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function AuthForm({ onAuthChange }) {
  const [mode, setMode] = useState("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    const normalizedEmail = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setError("Enter a valid email address.");
      return;
    }
    setIsSubmitting(true);

    const result =
      mode === "sign-in"
        ? await supabase.auth.signInWithPassword({
            email: normalizedEmail,
            password,
          })
        : await supabase.auth.signUp({ email: normalizedEmail, password });

    setIsSubmitting(false);
    if (result.error) {
      setError(result.error.message);
      return;
    }

    if (mode === "sign-up" && !result.data.session) {
      setMessage("Check your email to confirm your account, then sign in.");
    } else {
      onAuthChange(
        mode === "sign-in" ? "You are signed in." : "Your account is ready.",
      );
    }
  }

  return (
    <section className="panel auth-panel" aria-labelledby="account-title">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Your matchday account</p>
          <h2 id="account-title">
            {mode === "sign-in" ? "Welcome back" : "Create an account"}
          </h2>
        </div>
      </div>
      <p className="muted">
        Sign in or create an account to reserve and manage your tickets.
      </p>
      <form className="auth-form" onSubmit={handleSubmit}>
        <label>
          Email address
          <input
            autoComplete="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            autoComplete={
              mode === "sign-in" ? "current-password" : "new-password"
            }
            type="password"
            minLength={8}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>
        {error && (
          <p className="notice error" role="alert">
            {error}
          </p>
        )}
        {message && (
          <p className="notice success" role="status">
            {message}
          </p>
        )}
        <button className="button" type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Please wait..."
            : mode === "sign-in"
              ? "Sign in"
              : "Create account"}
        </button>
      </form>
      <p className="auth-switch">
        {mode === "sign-in" ? "New to Matchday?" : "Already have an account?"}{" "}
        <button
          className="text-button"
          type="button"
          onClick={() => {
            setMode(mode === "sign-in" ? "sign-up" : "sign-in");
            setError("");
            setMessage("");
          }}
        >
          {mode === "sign-in" ? "Create an account" : "Sign in"}
        </button>
      </p>
    </section>
  );
}

function MatchCard({ match, onBook, isSignedIn }) {
  return (
    <article className="match-card">
      <div className="match-card-top">
        <span className="badge">IPL MATCH</span>
        <time dateTime={match.starts_at}>{formatMatchDate(match.starts_at)}</time>
      </div>
      <div className="teams">
        <div className="team">
          <span className="team-mark">{match.home_team.slice(0, 2)}</span>
          <span>{match.home_team}</span>
        </div>
        <span className="versus">VS</span>
        <div className="team">
          <span className="team-mark alternate">{match.away_team.slice(0, 2)}</span>
          <span>{match.away_team}</span>
        </div>
      </div>
      <div className="match-card-bottom">
        <span>{match.venue}</span>
        <button
          className="text-button"
          type="button"
          onClick={() => onBook(match.id)}
          disabled={!isSignedIn}
          title={isSignedIn ? "Choose this match" : "Sign in to book tickets"}
        >
          Book <span aria-hidden="true">→</span>
        </button>
      </div>
    </article>
  );
}

function BookingCard({ booking, onSave, onCancel }) {
  const [isEditing, setIsEditing] = useState(false);
  const [quantity, setQuantity] = useState(booking.quantity);
  const [stand, setStand] = useState(booking.stand);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSave(event) {
    event.preventDefault();
    setIsSaving(true);
    setError("");
    const result = await onSave(booking.id, { quantity, stand });
    setIsSaving(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    setIsEditing(false);
  }

  return (
    <article className="booking-item">
      <div className="booking-item-heading">
        <div>
          <h3>
            {booking.match?.home_team} <span>vs</span>{" "}
            {booking.match?.away_team}
          </h3>
          <p className="muted">
            {booking.match?.venue}
            {booking.match?.starts_at &&
              ` · ${formatMatchDate(booking.match.starts_at)}`}
          </p>
        </div>
        <span className="badge">RESERVED</span>
      </div>
      {isEditing ? (
        <form className="edit-booking-form" onSubmit={handleSave}>
          <label>
            Tickets
            <input
              type="number"
              min="1"
              max="10"
              value={quantity}
              onChange={(event) => setQuantity(Number(event.target.value))}
              required
            />
          </label>
          <label>
            Stand
            <select
              value={stand}
              onChange={(event) => setStand(event.target.value)}
            >
              <option value="general">General</option>
              <option value="premium">Premium</option>
              <option value="hospitality">Hospitality</option>
            </select>
          </label>
          <button className="button small-button" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save changes"}
          </button>
          <button
            className="text-button"
            type="button"
            onClick={() => setIsEditing(false)}
          >
            Keep booking
          </button>
          {error && (
            <p className="notice error" role="alert">
              {error}
            </p>
          )}
        </form>
      ) : (
        <div className="booking-details">
          <p>
            {booking.quantity} {booking.quantity === 1 ? "ticket" : "tickets"}{" "}
            <span>·</span> {booking.stand} stand <span>·</span>{" "}
            Est. {formatPrice(booking.quantity * STAND_PRICES[booking.stand])}
          </p>
          <div className="booking-actions">
            <button
              className="text-button"
              type="button"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </button>
            <button
              className="text-button cancel-button"
              type="button"
              onClick={() => onCancel(booking.id)}
            >
              Cancel booking
            </button>
          </div>
        </div>
      )}
    </article>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [matches, setMatches] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [matchesLoading, setMatchesLoading] = useState(true);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState("");
  const [quantity, setQuantity] = useState(2);
  const [stand, setStand] = useState("general");
  const [pageError, setPageError] = useState("");
  const [notice, setNotice] = useState("");
  const [isBooking, setIsBooking] = useState(false);

  const loadBookings = useCallback(async () => {
    if (!supabase || !user) return;
    setBookingsLoading(true);
    const { data, error } = await supabase
      .from("bookings")
      .select(BOOKING_FIELDS)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    setBookingsLoading(false);
    if (error) {
      setPageError(`Could not load your bookings: ${error.message}`);
      return;
    }
    setBookings(data);
  }, [user]);

  useEffect(() => {
    if (!supabase) {
      setMatchesLoading(false);
      return undefined;
    }

    let active = true;
    supabase
      .from("matches")
      .select("id, home_team, away_team, venue, starts_at")
      .gte("starts_at", new Date().toISOString())
      .order("starts_at", { ascending: true })
      .then(({ data, error }) => {
        if (!active) return;
        if (error) {
          setPageError(`Could not load matches: ${error.message}`);
        } else {
          setMatches(data);
        }
        setMatchesLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!supabase) return undefined;

    let active = true;
    supabase.auth.getSession().then(({ data, error }) => {
      if (!active) return;
      if (error) setPageError(`Could not check your session: ${error.message}`);
      setUser(data.session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    setBookings([]);
    if (user) loadBookings();
  }, [user, loadBookings]);

  async function handleCreateBooking(event) {
    event.preventDefault();
    if (!supabase || !user) return;
    setPageError("");
    setNotice("");
    setIsBooking(true);
    const { error } = await supabase.from("bookings").insert({
      user_id: user.id,
      match_id: selectedMatch,
      quantity,
      stand,
    });
    setIsBooking(false);
    if (error) {
      setPageError(`Could not create your booking: ${error.message}`);
      return;
    }
    setNotice(
      `Your tickets have been reserved. Estimated total: ${formatPrice(
        quantity * STAND_PRICES[stand],
      )}.`,
    );
    setSelectedMatch("");
    setQuantity(2);
    await loadBookings();
    document.getElementById("my-bookings")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  async function handleUpdateBooking(id, updates) {
    setPageError("");
    const { error } = await supabase
      .from("bookings")
      .update({ quantity: updates.quantity, stand: updates.stand })
      .eq("id", id)
      .eq("user_id", user.id);
    if (error) return { error: `Could not update your booking: ${error.message}` };
    setNotice("Your booking has been updated.");
    await loadBookings();
    return { error: "" };
  }

  async function handleCancelBooking(id) {
    if (!window.confirm("Cancel this ticket booking?")) return;
    setPageError("");
    setNotice("");
    const { error } = await supabase
      .from("bookings")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);
    if (error) {
      setPageError(`Could not cancel your booking: ${error.message}`);
      return;
    }
    setNotice("Your booking has been cancelled.");
    await loadBookings();
  }

  async function handleSignOut() {
    setPageError("");
    const { error } = await supabase.auth.signOut();
    if (error) setPageError(`Could not sign out: ${error.message}`);
    else setNotice("You have signed out.");
  }

  function chooseMatch(matchId) {
    setSelectedMatch(matchId);
    document.getElementById("booking")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  return (
    <>
      <header className="site-header">
        <a className="brand" href="#home" aria-label="IPL Matchday home">
          IPL <span>MATCHDAY</span>
        </a>
        <nav aria-label="Main navigation">
          <a href="#matches">Matches</a>
          <a href="#booking">Book tickets</a>
          {user && <a href="#my-bookings">My bookings</a>}
          {user && (
            <button className="nav-signout" type="button" onClick={handleSignOut}>
              Sign out
            </button>
          )}
        </nav>
      </header>

      <section className="hero" id="home">
        <div className="hero-content">
          <p className="eyebrow">The biggest cricket celebration</p>
          <h1>
            Feel the roar.
            <br />
            Be there live.
          </h1>
          <p className="hero-copy">
            Find your match, pick your seats, and get ready for an unforgettable
            day at the stadium.
          </p>
          <a className="button" href="#matches">
            Explore matches <span aria-hidden="true">→</span>
          </a>
        </div>
        <div className="hero-orbit orbit-one" aria-hidden="true" />
        <div className="hero-orbit orbit-two" aria-hidden="true" />
      </section>

      <main>
        {!supabase && (
          <section className="setup-notice" role="status">
            <strong>Connect your Supabase project to get started.</strong>
            <span>
              Copy <code>.env.example</code> to <code>.env</code>, add your
              project URL and anon key, then run the SQL in{" "}
              <code>supabase/schema.sql</code>.
            </span>
          </section>
        )}
        {pageError && (
          <p className="notice error page-notice" role="alert">
            {pageError}
          </p>
        )}
        {notice && (
          <p className="notice success page-notice" role="status">
            {notice}
          </p>
        )}

        <section className="section" id="matches" aria-labelledby="matches-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow">The lineup</p>
              <h2 id="matches-title">Upcoming matches</h2>
              <p className="muted">
                Pick a matchup and make match day yours.
              </p>
            </div>
            <span className="section-count">
              {matchesLoading ? "Loading..." : `${matches.length} matches`}
            </span>
          </div>

          {matchesLoading ? (
            <p className="empty-state">Loading the match schedule...</p>
          ) : matches.length ? (
            <div className="match-grid">
              {matches.map((match) => (
                <MatchCard
                  key={match.id}
                  match={match}
                  onBook={chooseMatch}
                  isSignedIn={Boolean(user)}
                />
              ))}
            </div>
          ) : (
            <p className="empty-state">
              No upcoming matches found. Add upcoming fixtures to the{" "}
              <code>matches</code> table in Supabase to show them here.
            </p>
          )}
        </section>

        <section className="booking-layout section" id="booking">
          <div className="booking-intro">
            <p className="eyebrow">Your seat is waiting</p>
            <h2>Make it a matchday to remember.</h2>
            <p className="muted">
              Choose your game and stand. Your booking will be saved securely to
              your account.
            </p>
            <div className="booking-perk">
              <span aria-hidden="true">✦</span>
              <p>
                <strong>One place for your plans</strong>
                <br />
                Update or cancel your reservation from your bookings.
              </p>
            </div>
          </div>

          {user ? (
            <section className="panel" aria-labelledby="booking-title">
              <div className="panel-heading">
                <div>
                  <p className="eyebrow">Reserve tickets</p>
                  <h2 id="booking-title">Book your seats</h2>
                </div>
              </div>
              <p className="muted">Signed in as {user.email}</p>
              <form className="booking-form" onSubmit={handleCreateBooking}>
                <label>
                  Match
                  <select
                    value={selectedMatch}
                    onChange={(event) => setSelectedMatch(event.target.value)}
                    required
                    disabled={!matches.length}
                  >
                    <option value="">Choose an upcoming match</option>
                    {matches.map((match) => (
                      <option key={match.id} value={match.id}>
                        {match.home_team} vs {match.away_team}
                      </option>
                    ))}
                  </select>
                </label>
                <div className="form-row">
                  <label>
                    Tickets
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={quantity}
                      onChange={(event) =>
                        setQuantity(Number(event.target.value))
                      }
                      required
                    />
                  </label>
                  <label>
                    Stand
                    <select
                      value={stand}
                      onChange={(event) => setStand(event.target.value)}
                    >
                      <option value="general">General</option>
                      <option value="premium">Premium</option>
                      <option value="hospitality">Hospitality</option>
                    </select>
                  </label>
                </div>
                <div className="price-summary" aria-live="polite">
                  <span>
                    Estimated total <small>(indicative demo pricing)</small>
                  </span>
                  <strong>
                    {formatPrice(quantity * STAND_PRICES[stand])}
                  </strong>
                </div>
                <button
                  className="button full-button"
                  type="submit"
                  disabled={isBooking || !matches.length}
                >
                  {isBooking ? "Reserving..." : "Reserve tickets"}
                  {!isBooking && <span aria-hidden="true">→</span>}
                </button>
                <p className="form-footnote">
                  This demo records reservations; it does not process payments.
                </p>
              </form>
            </section>
          ) : supabase ? (
            <AuthForm onAuthChange={setNotice} />
          ) : (
            <section className="panel auth-panel">
              <p className="eyebrow">Your matchday account</p>
              <h2>Sign in to book</h2>
              <p className="muted">
                Add your Supabase credentials to enable account access and
                ticket bookings.
              </p>
            </section>
          )}
        </section>

        {user && (
          <section
            className="section bookings-section"
            id="my-bookings"
            aria-labelledby="bookings-title"
          >
            <div className="section-heading">
              <div>
                <p className="eyebrow">Your plans</p>
                <h2 id="bookings-title">My bookings</h2>
                <p className="muted">All your matchday reservations in one place.</p>
              </div>
            </div>
            {bookingsLoading ? (
              <p className="empty-state">Loading your bookings...</p>
            ) : bookings.length ? (
              <div className="booking-list">
                {bookings.map((booking) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    onSave={handleUpdateBooking}
                    onCancel={handleCancelBooking}
                  />
                ))}
              </div>
            ) : (
              <p className="empty-state">
                No bookings yet. Choose an upcoming match to get started.
              </p>
            )}
          </section>
        )}

        <section className="info-row section" aria-label="Booking information">
          <article className="info-card">
            <span className="info-icon" aria-hidden="true">
              01
            </span>
            <div>
              <h2>Arrive early</h2>
              <p>
                Allow time for security checks, finding your seat, and soaking
                up the pre-match atmosphere.
              </p>
            </div>
          </article>
          <article className="info-card">
            <span className="info-icon" aria-hidden="true">
              02
            </span>
            <div>
              <h2>Know before you go</h2>
              <p>
                Stadium entry rules and ticket availability vary by match.
                Check the venue&apos;s official guidance before you go.
              </p>
            </div>
          </article>
        </section>
      </main>

      <footer>
        <a className="brand footer-brand" href="#home">
          IPL <span>MATCHDAY</span>
        </a>
        <p>A fan-made ticket booking project. Not affiliated with the IPL.</p>
      </footer>
    </>
  );
}

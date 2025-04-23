import { useState, useEffect } from "react";

const ADMIN_PASSWORD = "keystone2025";

const generateBracketMatches = (arenaTeams: Team[]): [Team, Team | null][] => {
  const matches = [];
  const shuffled = [...arenaTeams].sort(() => 0.5 - Math.random());
  for (let i = 0; i < shuffled.length; i += 2) {
    if (shuffled[i + 1]) {
      matches.push([shuffled[i], shuffled[i + 1]]);
    } else {
      matches.push([shuffled[i], null]);
    }
  }
  return matches;
};

export default function Home() {
  const [teams, setTeams] = useState([]);
  const [teamName, setTeamName] = useState("");
  const [arena, setArena] = useState("Arena #1 Varsity Guys (10th–12th)");
  const [players, setPlayers] = useState(Array(5).fill({ name: "", grade: "", number: "" }));
  const [isAdmin, setIsAdmin] = useState(false);
  const [countdown, setCountdown] = useState("");
  const [matchups, setMatchups] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  const arenas = [
    "Arena #1 Varsity Guys (10th–12th)",
    "Arena #2 JV Guys (7th–9th)",
    "Arena #3 ALL Girls (7th–12th)"
  ];

  useEffect(() => {
    const target = new Date("2025-05-07T17:45:00");
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = target.getTime() - now;
      if (distance < 0) {
        setCountdown("Tournament has started!");
        clearInterval(interval);
        return;
      }
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((distance / 1000 / 60) % 60);
      const seconds = Math.floor((distance / 1000) % 60);
      setCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const savedTeams = localStorage.getItem("teams");
    if (savedTeams) setTeams(JSON.parse(savedTeams));
  }, []);

  useEffect(() => {
    const newMatchups = {};
    arenas.forEach((arenaName) => {
      const arenaTeams = teams.filter((team) => team.arena === arenaName);
      if (arenaTeams.length >= 1) {
        newMatchups[arenaName] = generateBracketMatches(arenaTeams);
      }
    });
    setMatchups(newMatchups);
  }, [teams]);

  const handleRegister = () => {
    if (players.some(p => !p.name || !p.grade || !p.number)) {
      alert("Please fill out all fields for every player.");
      return;
    }

    const newTeam = { teamName, arena, players };
    const updatedTeams = [...teams, newTeam];
    setTeams(updatedTeams);
    localStorage.setItem("teams", JSON.stringify(updatedTeams));
    setTeamName("");
    setArena("Arena #1 Varsity Guys (10th–12th)");
    setPlayers(Array(5).fill({ name: "", grade: "", number: "" }));

    // Show success message
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleAdminToggle = () => {
    if (!isAdmin) {
      const input = prompt("Enter admin passcode:");
      if (input === ADMIN_PASSWORD) setIsAdmin(true);
      else alert("Incorrect passcode.");
    } else {
      setIsAdmin(false);
    }
  };

  const handleDeleteTeam = (teamName) => {
    const updatedTeams = teams.filter(team => team.teamName !== teamName);
    setTeams(updatedTeams);
    localStorage.setItem("teams", JSON.stringify(updatedTeams));
  };

  const handleEditTeamName = (teamName, newTeamName) => {
    const updatedTeams = teams.map(team =>
      team.teamName === teamName ? { ...team, teamName: newTeamName } : team
    );
    setTeams(updatedTeams);
    localStorage.setItem("teams", JSON.stringify(updatedTeams));
  };

  const renderBracket = (matches) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {matches.map((match, idx) => (
        <div key={idx} style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          borderBottom: "1px solid #ccc",
          padding: "0.5rem 0"
        }}>
          <div style={{ width: "45%", minWidth: "120px", textAlign: "center" }}>
            {match[0]?.teamName}
          </div>
          <div style={{ width: "10%", minWidth: "50px", textAlign: "center" }}>
            {match[1] ? "VS" : "BYE"}
          </div>
          <div style={{ width: "45%", minWidth: "120px", textAlign: "center" }}>
            {match[1]?.teamName || ""}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <main style={{ padding: "1rem", fontFamily: "Arial, sans-serif", maxWidth: "100%", boxSizing: "border-box" }}>
      <h1 style={{ fontSize: "1.75rem", fontWeight: "bold", textAlign: "center" }}>
        Keystone Students Dodgeball Tournament 2025
      </h1>
      <p style={{ textAlign: "center", marginTop: "0.5rem", fontSize: "1rem" }}>
        Countdown: <strong>{countdown}</strong>
      </p>

      <div style={{ marginTop: "2rem", maxWidth: "100%", width: "100%", marginInline: "auto" }}>
        <h2 style={{ fontSize: "1.25rem" }}>Register a Team</h2>
        <input
          type="text"
          placeholder="Team Name"
          value={teamName}
          onChange={e => setTeamName(e.target.value)}
          style={{ display: "block", width: "100%", marginBottom: "1rem", padding: "0.75rem", fontSize: "1rem" }}
        />
        <select
          value={arena}
          onChange={e => setArena(e.target.value)}
          style={{ display: "block", width: "100%", marginBottom: "1rem", padding: "0.75rem", fontSize: "1rem" }}
        >
          {arenas.map((a, i) => (
            <option key={i}>{a}</option>
          ))}
        </select>

        {players.map((player, i) => (
          <div key={i} style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.5rem" }}>
            <input
              placeholder={`Player ${i + 1} Name`}
              value={player.name}
              onChange={e => {
                const updated = [...players];
                updated[i] = { ...updated[i], name: e.target.value };
                setPlayers(updated);
              }}
              style={{ flex: "1 1 100%", padding: "0.5rem" }}
            />
            <input
              placeholder="Grade"
              value={player.grade}
              onChange={e => {
                const updated = [...players];
                updated[i] = { ...updated[i], grade: e.target.value };
                setPlayers(updated);
              }}
              style={{ width: "100px", padding: "0.5rem" }}
            />
            <input
              placeholder="Phone #"
              value={player.number}
              onChange={e => {
                const updated = [...players];
                updated[i] = { ...updated[i], number: e.target.value };
                setPlayers(updated);
              }}
              style={{ flex: "1", minWidth: "120px", padding: "0.5rem" }}
            />
          </div>
        ))}
      </div>

      {/* Sticky Submit Button */}
      <div style={{
        position: "fixed",
        bottom: "0",
        left: "0",
        right: "0",
        background: "#ea580c",
        padding: "1rem",
        textAlign: "center",
        zIndex: 1000
      }}>
        <button
          onClick={handleRegister}
          style={{
            width: "100%",
            maxWidth: "500px",
            padding: "1rem",
            fontSize: "1.1rem",
            color: "white",
            background: "#ea580c",
            border: "none",
            fontWeight: "bold",
            cursor: "pointer"
          }}
        >
          Submit Team
        </button>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div style={{
          position: "fixed",
          top: "1rem",
          left: "50%",
          transform: "translateX(-50%)",
          background: "#4ade80",
          color: "white",
          padding: "0.75rem 1.5rem",
          borderRadius: "8px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
          zIndex: 999
        }}>
          ✅ Registration Complete!
        </div>
      )}

      <div style={{ marginTop: "4rem", textAlign: "center" }}>
        <label>
          <input type="checkbox" checked={isAdmin} onChange={handleAdminToggle} />
          {' '}Admin Mode
        </label>
      </div>

      {isAdmin && (
        <div style={{ marginTop: "2rem", width: "100%", marginInline: "auto" }}>
          <h3>Registered Teams</h3>
          {teams.length === 0 ? (
            <p>No teams registered yet.</p>
          ) : (
            <ul>
              {teams.map((team, i) => (
                <li key={i}>
                  <strong>{team.teamName}</strong> ({team.arena}) - Players:{" "}
                  {team.players.map(p => p.name).join(", ")}
                  <button onClick={() => handleDeleteTeam(team.teamName)} style={{ marginLeft: "1rem" }}>Delete</button>
                  <input
                    type="text"
                    defaultValue={team.teamName}
                    onBlur={(e) => handleEditTeamName(team.teamName, e.target.value)}
                    style={{ marginLeft: "0.5rem", padding: "0.25rem" }}
                  />
                </li>
              ))}
            </ul>
          )}

          {arenas.map((arenaName) => {
            const matches = matchups[arenaName];
            if (!matches || matches.length === 0) return null;
            return (
              <div key={arenaName} style={{ marginTop: "2rem" }}>
                <h4>{arenaName} Bracket</h4>
                {renderBracket(matches)}
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}

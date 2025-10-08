"use client";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import questions from "./questions.json";
import { Great_Vibes } from "next/font/google";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const greatVibes = Great_Vibes({ subsets: ["latin"], weight: "400" });

export default function Home() {
  const [name, setName] = useState("");
  const [answers, setAnswers] = useState({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [answersUploaded, setAnswersUploaded] = useState(false); 
  const [correctAnswers, setCorrectAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [leaderboard, setLeaderboard] = useState([]);
  const [userId, setUserId] = useState(null);


  const userSubmission = leaderboard.find(
    (user) => String(user.id) === String(userId) // or match by ID/email/etc.
  );


  useEffect(() => {
    async function fetchCorrectAnswers() {
      try {
        const res = await fetch("/api/correctAnswers");
        const data = await res.json();
        setCorrectAnswers(data);
      } catch (err) {
        console.error("Failed to fetch correct answers", err);
      }
    }
  
    if (answersUploaded) {
      fetchCorrectAnswers();
    }
  }, [answersUploaded]);
  
  console.log("User ID from cookie:", userId);
console.log("Leaderboard data:", leaderboard);

  // Fetch leaderboard data
  useEffect(() => {
    async function fetchLeaderboard() {
      const res = await fetch("/api/scores");
      const data = await res.json();
      setLeaderboard(data);
      setLoading(false);
    }

    fetchLeaderboard();
  }, []);

// see if answers are uploaded
useEffect(() => {
  async function fetchAnswersStatus() {
    try {
      const res = await fetch("/api/hasCorrectAnswers");
      const data = await res.json();
      
      if (data.hasCorrectAnswers) {
        setAnswersUploaded(true);  // Correctly set the state to true if answers are uploaded
      } else {
        setAnswersUploaded(false);
      }
    } catch (error) {
      console.error("Error fetching answers status:", error);
      setAnswersUploaded(false);
    } finally {
      setLoading(false);  // Ensure loading state is set to false when the request finishes
    }
  }

  fetchAnswersStatus();
}, []); // Empty dependency array means this runs once on component mount

  
  // Check if the user has already submitted
  useEffect(() => {
    if (document.cookie.includes("hasSubmitted=true")) {
      setHasSubmitted(true);

      const match = document.cookie.match(/userId=([^;]+)/);
      if (match && match[1]) {
        setUserId(match[1]);
      }

    }
    setLoading(false);
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Only submit if the user hasn't already
    if (document.cookie.includes("hasSubmitted=true")) {
      alert("You’ve already submitted your answers!");
      return;
    }

    const formData = { name, answers };

    const res = await fetch("/api/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    console.log("Submitted:", data);

    if (res.ok) {
      // Set cookie for 30 days
      document.cookie = "hasSubmitted=true; path=/; max-age=" + 60 * 60 * 24 * 30;
      document.cookie = `userId=${data.userId}; path=/; max-age=` + 60 * 60 * 24 * 30;
      alert("Thanks for submitting your bets!");
      setHasSubmitted(true); // Set hasSubmitted to true to display the leaderboard
    } else {
      alert("There was an error submitting your answers.");
    }
  };

  const handleAnswerChange = (questionId, selectedChoice) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: selectedChoice,
    }));
  };

  // Render different sections based on conditions
  if (loading) return <p>Loading leaderboard...</p>;

  return (
    <div className={`${styles.page}`}>
      <main className={styles.main}>
        <div className={`${styles.header} ${greatVibes.className}`}>
          <h1>Danny and Maya's Wedding</h1>
          <h2>Please place your guesses below</h2>
        </div>

        {/* If user has not submitted */}
        {!hasSubmitted && !answersUploaded ?(
          <>
            {/* FORM SECTION */}
            <div className={styles.formContainer}>
              <form onSubmit={handleSubmit} className={styles.form}>
                <input
                  className={styles.textInputs}
                  name="name"
                  placeholder="Name"
                  maxLength={35}
                  onChange={(e) => setName(e.target.value)}
                  required
                />

                {questions.map((q) => (
                  <div key={q.id} className={styles.question}>
                    <label className={`${styles.questionLabel} ${greatVibes.className}`}>Question {q.id.slice(1)}</label>
                    <p className={styles.questionText}>{q.text}</p>
                    {Object.entries(q.choices).map(([choiceText, pointValue]) => (
                      <label key={choiceText}>
                        <div className={styles.inputLabelCombo}>
                          <input
                            required
                            type="radio"
                            name={q.id}
                            value={choiceText}
                            onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                            checked={answers[q.id] === choiceText}
                          />
                          {choiceText}{" "}
                          <span className={styles.pointsLabel}>+{pointValue}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                ))}

                <div className={styles.submitBtnContainer}>
                  <input type="submit" className={styles.submitBtn} />
                </div>
              </form>
            </div>
          </>
        ) : answersUploaded ? (
          <>
            {/* ✅ LEADERBOARD SECTION */}
            <h2 className={styles.leaderboardHeader}>🏆 Leaderboard 🏆</h2>
            <table className={styles.leaderboardTable}>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Name</th>
                  <th>Score</th>
                  <th>Correct</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((user, index) => (
                  <tr key={`${user.name}-${index}`}>
                    <td>{index + 1}</td>
                    <td>{user.name}</td>
                    <td>{user.score}</td>
                    <td>{user.numberOfCorrectAnswers}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <h1 className={styles.personalBreakdownTitle}>Personal Breakdown</h1>
            

            {userSubmission && correctAnswers && Object.keys(correctAnswers).length > 0 ? (
            <>
              <div className={styles.personalBreakdownContainer}>
                <div className={styles.scoreBarContainer}>
                  <CircularProgressbar
                    value={(userSubmission.numberOfCorrectAnswers / 12) * 100}
                    text={`${Math.round((userSubmission.numberOfCorrectAnswers / 12) * 100)}%`}
                    styles={buildStyles({
                      pathColor: '#233E2A',
                      textColor: '#233E2A'
                    })}
                  />
                </div>
                {questions.map((q) => {
                  const userAnswer = userSubmission.answers?.[q.id];
                  const correctAnswer = correctAnswers[q.id];
                  const isCorrect = userAnswer === correctAnswer;
                  const userPoints = q.choices?.[userAnswer] || 0;

                  return (
                    <div key={q.id} className={`${styles.question} ${styles.personalBreakdown}`}>
                      <label className={`${styles.questionLabel} ${greatVibes.className}`}>Question {q.id.slice(1)}</label>
                      <p><strong>Q:</strong> {q.text}</p>
                      <p>
                        <strong>Your Answer:</strong>{" "}
                        {userAnswer || <em>Not answered</em>}{" "}
                        {isCorrect ? (
                          <span style={{ color: "green" }}>✅ +{userPoints} pts</span>
                        ) : (
                          <span style={{ color: "red" }}>❌</span>
                        )}
                      </p>
                      {!isCorrect && (
                        <p><strong>Correct:</strong> {correctAnswer}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <p>No submission found.</p>
          )}


      
          </>
        ) : (
          <h2>Thank you for submitting — check back later for results!</h2>
        )}
      </main>
    </div>
  );
}

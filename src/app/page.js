"use client";

import styles from "./page.module.css";
import { useEffect, useState } from "react";
import questions from "./questions.json";
import { Great_Vibes } from "next/font/google";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import Preloader from "./preloader";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const greatVibes = Great_Vibes({ subsets: ["latin"], weight: "400" });

export default function Home() {
  // State setup
  const [name, setName] = useState("");
  const [answers, setAnswers] = useState({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [answersUploaded, setAnswersUploaded] = useState(false); 
  const [correctAnswers, setCorrectAnswers] = useState({});
  const [leaderboard, setLeaderboard] = useState([]);
  const [userId, setUserId] = useState(null);
  const [showPreloader, setShowPreloader] = useState(true);


  // Extract user submission from leaderboard
  const userSubmission = leaderboard.find(
    (user) => String(user.id) === String(userId)
  );

  // Load all data in a single coordinated useEffect
  useEffect(() => {
    async function loadInitialData() {
      try {
        const [scoresRes, answersStatusRes] = await Promise.all([
          fetch("/api/scores"),
          fetch("/api/hasCorrectAnswers"),
        ]);
  
        const scoresData = await scoresRes.json();
        const answersStatus = await answersStatusRes.json();
  
        setLeaderboard(scoresData);
        setAnswersUploaded(answersStatus.hasCorrectAnswers);
  
        if (answersStatus.hasCorrectAnswers) {
          const correctRes = await fetch("/api/correctAnswers");
          const correctData = await correctRes.json();
          setCorrectAnswers(correctData);
        }
  
        if (document.cookie.includes("hasSubmitted=true")) {
          setHasSubmitted(true);
  
          const match = document.cookie.match(/userId=([^;]+)/);
          if (match && match[1]) {
            setUserId(match[1]);
          }
        }
  
      } catch (err) {
        console.error("Error loading data:", err);
      }
    }
  
    loadInitialData();
  }, []);

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevent duplicate submissions
    if (document.cookie.includes("hasSubmitted=true")) {
      alert("You’ve already submitted your answers!");
      return;
    }

    const formData = { name, answers };

    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        document.cookie = "hasSubmitted=true; path=/; max-age=" + 60 * 60 * 24 * 30;
        document.cookie = `userId=${data.userId}; path=/; max-age=` + 60 * 60 * 24 * 30;

        alert("Thanks for submitting your bets!");
        setHasSubmitted(true);
        setUserId(data.userId);
      } else {
        alert("There was an error submitting your answers.");
      }
    } catch (err) {
      console.error("Submission error:", err);
      alert("There was an error submitting your answers.");
    }
  };

  // Answer change handler
  const handleAnswerChange = (questionId, selectedChoice) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: selectedChoice,
    }));
  };

  // Show preloader while loading
  if (showPreloader) {
    return <Preloader onComplete={() => setShowPreloader(false)} />;
  }
  

  return (
    <div className={`${styles.page}`}>
      <main className={styles.main}>
        <div className={`${styles.header} ${greatVibes.className}`}>
          <h1>Danny and Maya's Wedding</h1>
          
        </div>

        {/* If user has not submitted */}
        {!hasSubmitted && !answersUploaded ?(
          <>
          <div className={`${styles.header} ${greatVibes.className}`}>
            <h2>Please place your guesses below</h2>
          </div>
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
                    value={(userSubmission.numberOfCorrectAnswers / 13) * 100}
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
          <>
          <div className={styles.checkBackTitle}>
            <h2>Thank you for submitting</h2>
            <h3>Check back later for results</h3>  
          </div>
          

          <div className={styles.sandwhichContainer}>
            <DotLottieReact
                src="https://lottie.host/385a81f1-2270-401a-936d-ba9a90fbde93/fIsnyetCxY.lottie"
                autoplay
                loop={true}               
            />
        
        </div>
          </>
        )}
      </main>
    </div>
  );
}

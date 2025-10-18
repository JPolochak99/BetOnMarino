"use client"
import styles from "../page.module.css";
import { useState } from "react";
import questions from "../questions.json"
import { Great_Vibes } from "next/font/google";


const greatVibes = Great_Vibes({ subsets: ["latin"], weight: "400" });

export default function Home() {

  const [answers, setAnswers] = useState({});

  const handleRemoveData = async () => {
    try {
      const response = await fetch("/api/removeAnswers", {
        method: "DELETE", // Assuming you're using DELETE method to remove data
      });

      if (response.ok) {
        setAnswers({}); // Clear answers locally
        alert("Data removed successfully.");
      } else {
        console.error("Failed to remove data");
      }
    } catch (error) {
      console.error("Error removing data:", error);
    }
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Only submit if the user hasn't already
    
  
    const formData = { answers };
  
    const res = await fetch("/api/correctAnswers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
  
    const data = await res.json();
    console.log("Submitted:", data);
  
  };
  
  const handleAnswerChange = (questionId, selectedChoice) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: selectedChoice
    }));
  };

  return (

    
    <div className={styles.page}>
      <main className={styles.main}>
      <div className={`${styles.header} ${greatVibes.className}`}>
          <h1>Danny and Maya's Wedding</h1>
          <h2>Please place your guesses below</h2>
        </div>

 
        <div className={styles.formContainer}>
          <form onSubmit={handleSubmit} className={styles.form}>
            
            {questions.map((q) => (
            <div key={q.id}  className={styles.question}>
              <label className={`${styles.questionLabel} ${greatVibes.className}`}>Question {q.id.slice(1)}</label>
              <p className={styles.questionText}>{q.text}</p>
              {Object.entries(q.choices).map(([choiceText, pointValue]) => (
              <label key={choiceText}>
                <div className={styles.inputLabelCombo}>
                <input required
                  type="radio"
                  name={q.id}
                  value={choiceText}
                  onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                  checked={answers[q.id] === choiceText}
                  />
                  
                    {choiceText} <span className={styles.pointsLabel}>+{pointValue}</span>

                    
                  </div>
                  
              </label>
              ))}
              </div>
            ))} 

            <div className={styles.submitBtnContainer}>
              <input type="submit" className={styles.submitBtn}></input>
            </div>
          </form>

          <div className={styles.removeBtnContainer}>
              <button className={styles.removeBtn} onClick={handleRemoveData}>Remove Data</button>
          </div>

        </div>
     </main>
    </div>
  );
}

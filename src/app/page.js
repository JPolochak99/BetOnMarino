"use client"
import Image from "next/image";
import styles from "./page.module.css";
import { useState } from "react";

export default function Home() {

  const [name, setName] = useState("");
  const [answers, setAnswers] = useState({});

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
      // ✅ Set cookie for 30 days
      document.cookie = "hasSubmitted=true; path=/; max-age=" + 60 * 60 * 24 * 30;
      alert("Thanks for submitting your bets!");
    } else {
      alert("There was an error submitting your answers.");
    }
  };
  
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.header}>
          
            <h1>Danny and Maya's Wedding</h1>
            <h2>Please place your bets below</h2>
        </div>

 
        <div className={styles.formContainer}>
          <form onSubmit={handleSubmit} className={styles.form}>

<input className={styles.textInputs} name='name' placeholder='name'></input>
            <fieldset className={styles.question}>
              <label>Name of the song Maya walks down the isle to?</label>
              <input placeholder="What will the walkout song be" className={styles.textInputs}></input>
            </fieldset>
            
            <fieldset className={styles.question}>
              <label>Who will the first dance be with if there is one?</label>

            <div className={styles.inputLabelCombo}>
              <input type="radio" name='firstDance' value='dan&maya'></input>
              <label htmlFor='dan&maya'>Danny and Maya</label>
              <p className={styles.pointsLabel}>(+100)</p>
            </div>

            <div className={styles.inputLabelCombo}>
              <input type="radio" name='firstDance' value='dan&kim'></input>
              <label htmlFor='dan&maya'>Danny and Aunt Kim</label>
              <p className={styles.pointsLabel}>(+200)</p>
            </div>

            <div className={styles.inputLabelCombo}>
              <input type="radio" name='firstDance' value='maya&dad'></input>
              <label htmlFor='maya&dad'>Maya and her dad</label>
              <p className={styles.pointsLabel}>(+200)</p>
            </div>

            <div className={styles.inputLabelCombo}>
              <input type="radio" name='firstDance' value='other'></input>
              <label htmlFor='dan&maya'>Other</label>
              <p className={styles.pointsLabel}>(+200)</p>
            </div>

            <div className={styles.inputLabelCombo}>
              <input type="radio" name='firstDance' value='none'></input>
              <label htmlFor='none'>None</label>
              <p className={styles.pointsLabel}>(+200)</p>
            </div>
            </fieldset>

            <fieldset className={styles.question}>
              <label>What will Danny read his vows from?</label>
              <div className={styles.inputLabelCombo}>
                <input type="radio" name='danVowMaterial' value="paper"></input>
                <label htmlFor="paper">Paper</label>
                <p className={styles.pointsLabel}>(+200)</p>
              </div>

              <div className={styles.inputLabelCombo}>
                <input type="radio" name='danVowMaterial' value="phone"></input>
                <label htmlFor="phone">Phone</label>
                <p className={styles.pointsLabel}>(+100)</p>
              </div>

              <div className={styles.inputLabelCombo}>
                <input type="radio" name='danVowMaterial' value="none"></input>
                <label htmlFor="none">Nothing, straight from the dome</label>
                <p className={styles.pointsLabel}>(+300)</p>
              </div>
            </fieldset>

            <fieldset className={styles.question}>
              <label>What will Maya read her vows froms?</label>
              <div className={styles.inputLabelCombo}>
                <input type="radio" name='mayaVowMaterial' value="paper"></input>
                <label htmlFor="paper">Paper</label>
                <p className={styles.pointsLabel}>(+200)</p>
              </div>
              
              <div className={styles.inputLabelCombo}>
                <input type="radio" name='mayaVowMaterial' value="phone"></input>
                <label htmlFor="phone">Phone</label>
                <p className={styles.pointsLabel}>(+100)</p>
              </div>

              <div className={styles.inputLabelCombo}>
                <input type="radio" name='mayaVowMaterial' value="none"></input>
                <label htmlFor="none">Nothing, straight from the dome</label>
                <p className={styles.pointsLabel}>(+300)</p>
              </div>
            </fieldset>

            <fieldset className={styles.question}>
              <label>Danny's vows take 2:30s?</label>
              <div className={styles.inputLabelCombo}>
                <input type="radio" name='danVowLength' value="over"></input>
                <label htmlFor="danVowLength">Over</label>
                <p className={styles.pointsLabel}>(+150)</p>
              </div>
              <div className={styles.inputLabelCombo}>
                <input type="radio" name='danVowLength' value="under"></input>
                <label htmlFor="danVowLength">Under</label>
                <p className={styles.pointsLabel}>(+150)</p>
              </div>
            </fieldset>

            <fieldset className={styles.question}>
              <label>Maya's vows take 2:30s?</label>
              <div className={styles.inputLabelCombo}>
                <input type="radio" name='mayaVowLength' value="over"></input>
                <label htmlFor="mayaVowLength">Over</label>
                <p className={styles.pointsLabel}>(+150)</p>
              </div>
              <div className={styles.inputLabelCombo}>
                <input type="radio" name='mayaVowLength' value="under"></input>
                <label htmlFor="mayaVowLength">Under</label>
                <p className={styles.pointsLabel}>(+150)</p>
              </div>
            </fieldset>

            <fieldset className={styles.question}>
              <label>Does Danny Cry during ceremony</label>
              <div className={styles.inputLabelCombo}>
                <input type="radio" name="danCry" value='yes'></input>
                <label htmlFor="yes">Yes</label>
                <p className={styles.pointsLabel}>(+350)</p>
              </div>
              
              <div className={styles.inputLabelCombo}>
                <input type="radio" name="danCry" value='no'></input>
                <label htmlFor="no">No</label>
                <p className={styles.pointsLabel}>(+100)</p>
              </div>
            </fieldset>

            <fieldset className={styles.question}>
              <label>Does Maya Cry during ceremony</label>
              <div className={styles.inputLabelCombo}>
                <input type="radio" name="mayaCry" value='yes'></input>
                <label htmlFor="yes">Yes</label>
                <p className={styles.pointsLabel}>(+100)</p>
              </div>
              <div className={styles.inputLabelCombo}>
                <input type="radio" name="mayaCry" value='no'></input>
                <label htmlFor="no">No</label>
                <p className={styles.pointsLabel}>(+250)</p>
              </div>
            </fieldset>

            <fieldset className={styles.question}>
              <label>Does Aunt Kim cry during ceremony</label>
              <div className={styles.inputLabelCombo}> 
                <input type="radio" name="kimCry" value='yes'></input>
                <label htmlFor="yes">Yes</label>
                <p className={styles.pointsLabel}>(+100)</p>
              </div>
              
              <div className={styles.inputLabelCombo}>
                <input type="radio" name="kimCry" value='no'></input>
                <label htmlFor="no">No</label>
                <p className={styles.pointsLabel}>(+100)</p>
              </div>
            </fieldset>

            <fieldset className={styles.question}>
              <label>Does Mayas Mom Cry during ceremony</label>
            <div className={styles.inputLabelCombo}>
              <input type="radio" name="danCry" value='yes'></input>
              <label htmlFor="yes">Yes</label>
              <p className={styles.pointsLabel}>(+100)</p>
             </div> 
              <div className={styles.inputLabelCombo}>
                <input type="radio" name="danCry" value='no'></input>
                <label htmlFor="no">No</label>
                <p className={styles.pointsLabel}>(+100)</p>
              </div>
            </fieldset>

            <fieldset className={styles.question}>
              <label>Is Harley part of the ceremony</label>
              <div className={styles.inputLabelCombo}>
                <input type="radio" name="dogInOut" value='yes'></input>
                <label htmlFor="yes">Yes</label>
                <p className={styles.pointsLabel}>(+100)</p>
              </div>
              <div className={styles.inputLabelCombo}>
                <input type="radio" name="dogInOut" value='no'></input>
                <label htmlFor="no">No</label>
                <p className={styles.pointsLabel}>(+300)</p>
              </div>
            </fieldset>

            <fieldset className={styles.question}>
              <label>Does someone cough during the ceremony</label>
              <div className={styles.inputLabelCombo}>
                <input type="radio" name="cough" value='yes'></input>
                <label htmlFor="yes">Yes</label>
                <p className={styles.pointsLabel}>(+300)</p>
              </div>
              <div className={styles.inputLabelCombo}>
                <input type="radio" name="cough" value='no'></input>
                <label htmlFor="no">No</label>
                <p className={styles.pointsLabel}>(+100)</p>
              </div>
              
            </fieldset>

            <fieldset className={styles.question}>
              <label>Does someone sneeze during the ceremony</label>
              <div className={styles.inputLabelCombo}>
                <input type="radio" name="sneeze" value='yes'></input>
                <label htmlFor="yes">Yes</label>
                <p className={styles.pointsLabel}>(+500)</p>
              </div>
              <div className={styles.inputLabelCombo}>
                <input type="radio" name="sneeze" value='no'></input>
                <label htmlFor="no">No</label>
                <p className={styles.pointsLabel}>(+100)</p>
              </div>
            </fieldset>
            <div className={styles.submitBtnContainer}>
              <input type="submit" className={styles.submitBtn}></input>
            </div>
          </form>
        </div>
     </main>
    </div>
  );
}

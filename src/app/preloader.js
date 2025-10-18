import { useEffect, useState } from "react";
import styles from "./preloader.module.css";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Great_Vibes } from "next/font/google";

const greatVibes = Great_Vibes({ subsets: ["latin"], weight: "400" });

function Preloader({ onComplete }) {
  const [player, setPlayer] = useState(null);

  // When the player instance becomes available, attach the event listener
  useEffect(() => {
    if (!player) return;

    const handleComplete = () => {
      onComplete?.();
    };

    player.addEventListener("complete", handleComplete);

    return () => {
      player.removeEventListener("complete", handleComplete);
    };
  }, [player, onComplete]);

  return (
    <div className={styles.preloader}>
        <div className={styles.preloaderText}>
            <h1 className={greatVibes.className}>Welcome To Danny and Myah's Wedding</h1>
            <h5>Help yourself to a ham sandwhich</h5>
        </div>
        <div className={styles.sandwhichContainer}>
            <DotLottieReact
                src="https://lottie.host/385a81f1-2270-401a-936d-ba9a90fbde93/fIsnyetCxY.lottie"
                autoplay
                loop={false}                // play it once
                dotLottieRefCallback={setPlayer}  // get reference to the player
            />
        
        </div>
    </div>
  );
}

export default Preloader;

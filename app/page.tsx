import Link from "next/link";
import styles from "./home.module.css";

export default function Home() {
  return (
    <main className={styles.wrap}>
      <video autoPlay loop muted playsInline className={styles.bgVideo}>
        <source src="/bg-video.mp4" type="video/mp4" />
      </video>
      <h1 className={styles.title}>BIDDING</h1>
      <Link href="/manga" className={styles.stepBtn}>
        THEORY QUIZ
      </Link>
      <Link href="/sim" className={styles.stepBtn}>
        SIMULATION
      </Link>
    </main>
  );
}

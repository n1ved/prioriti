'use client'
import styles from "./page.module.css";
import dummyProgressData from "@/data/DummyData/progress";
import ProgressCard from "@/components/progress/ProgressCard";
export default function Dashboard() {
  const progressData = dummyProgressData();
  return (
      <main className={styles.main}>
            <nav className={styles.nav}>
              <h1>prioriti</h1>
            </nav>
            <div className={styles.container}>
              <section className={styles.checklist_container}>
                <h2>Checklist</h2>
              </section>
              <section className={styles.progress_container}>
                <h2>Progress</h2>
                <div className={styles.progress_cards}>
                  {progressData.map((data) => (
                    <ProgressCard key={data.id} {...data} />
                  ))}
                </div>
              </section>
            </div>
      </main>
  )
}
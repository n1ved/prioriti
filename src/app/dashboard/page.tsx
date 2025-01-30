'use client'
import styles from "./page.module.css";
export default function Dashboard() {
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
              </section>
            </div>
      </main>
  )
}
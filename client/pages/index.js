import { useSession } from 'next-auth/react'
import Head from 'next/head'
import Navbar from '../components/Navbar'
import MovieSearch from '../components/MovieSearch'
import styles from '../styles/Home.module.css'

export default function Home() {
  const { data: session } = useSession()

  return (
    <div className={styles.container}>
      <Head>
        <title>Hypertube</title>
        <meta name="description" content="Movie streaming app" />
      </Head>

      <Navbar />

      <main className={styles.main}>{session && <MovieSearch session={session} />}</main>

      <footer className={styles.footer}>All right reserved by @team_hypertube</footer>
    </div>
  )
}

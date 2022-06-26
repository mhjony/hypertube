import Head from 'next/head'
import Navbar from '../components/Navbar'
import MovieSearch from '../components/MovieSearch'
// import Layout from '../components/Layout'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Hypertube</title>
        <meta name="description" content="Generated by create next app" />
      </Head>

      {/* <Header /> */}
      <Navbar />

      {/* <main className={styles.main}> */}
      <main className={styles.main}>
        {/* <Body /> */}
        <MovieSearch />

        {/* <div className={styles.grid}>
          <MovieSearch />
        </div> */}
      </main>

      {/* <Footer /> */}
      <footer className={styles.footer}>All right reserved by @team_hypertube</footer>
    </div>
  )
}

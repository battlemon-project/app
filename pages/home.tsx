import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Link from 'next/link'

export default function Index() {

  return (
    <div>
      <Head>
        <title>Battlemon GameFi Hub</title>
        <meta name="description" content="Battlemon - To the last drop of juice" />
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:site_name" content="Battlemon"/>
    		<meta property="og:title" content="Battlemon GameFi Hub"/>
    		<meta property="og:description" content="To the last drop of juice"/>
    		<meta property="og:image" content="https://promo.battlemon.com/battlemon.jpg"/>
    		<meta property="og:url" content="https://promo.battlemon.com/battlemon.jpg"/>
    		<meta property="og:type" content="website"/>
    		<meta name="twitter:card" content="summary_large_image"/>
    		<meta name="twitter:site" content="@BATTLEM0N"/>
    		<meta name="twitter:creator" content="@BATTLEM0N"/>
    		<meta name="twitter:title" content="Battlemon GameFi Hub"/>
    		<meta name="twitter:description" content="To the last drop of juice"/>
    		<meta name="twitter:image" content="https://promo.battlemon.com/battlemon.jpg"/>

      </Head>

      <Header />

      <main className={styles.main}>

        <h1 className={styles.title}>
          Welcome to Battlemon
        </h1>

        <p className={styles.description}>
          Get started with Sui Blockhain
          <code className={styles.code}>pages/index.tsx</code>
        </p>

        <div className={styles.grid}>
          <Link href="/home" className={styles.card}>
            <h2>Home &rarr;</h2>
            <p>Learn about Battlemon in an interactive scene!</p>
          </Link>

          <Link href="/hub" className={styles.card}>
            <h2>Hub &rarr;</h2>
            <p>Find in-depth information about our Hub.</p>
          </Link>

          <Link
            href="/newlemon"
            className={styles.card}
          >
            <h2>Test Lemon &rarr;</h2>
            <p>Scene with placeholders and animations.</p>
          </Link>

          <Link
            href="/"
            className={styles.card}
          >
            <h2>Marketplace &rarr;</h2>
            <p>Discover Battlemon marketplace.</p>
          </Link>

          <Link
            href="/"
            className={styles.card}
          >
            <h2>History &rarr;</h2>
            <p>
              Instantly view transactions history.
            </p>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  )
}

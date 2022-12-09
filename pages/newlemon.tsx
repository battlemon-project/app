import Head from 'next/head'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Loader from '../components/Loader'
import dynamic from 'next/dynamic'
import { Suspense } from 'react'

const NewLemonScene = dynamic(() => import('../scenes/NewLemonScene'), {
  suspense: true,
})

export default function NewLemon() {

  return (
    <>
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
      
      <Suspense fallback={<Loader status="" />}>
        <NewLemonScene />
      </Suspense>

      <Footer />
    </>
  )
}

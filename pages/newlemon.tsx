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
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      
      <Suspense fallback={<Loader status="" />}>
        <NewLemonScene />
      </Suspense>

      <Footer />
    </>
  )
}
